import axios, { AxiosInstance } from 'axios';

// Environment variables - Updated to match Netlify configuration
const REIGENT_SECRET = import.meta.env.VITE_REIGENT_SECRET || '';
const REIGENT_BASE_URL = import.meta.env.VITE_REIGENT_BASE_URL || 'https://api.reisearch.box';

// Debug mode for troubleshooting
let DEBUG_MODE = false;

export const enableDebugMode = () => {
  DEBUG_MODE = true;
  console.log('Reigent API debug mode enabled');
};

// Create axios instance with Reigent API configuration
const reigentApiClient = axios.create({
  baseURL: REIGENT_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${REIGENT_SECRET}`
  },
  timeout: 120000 // 120 seconds maximum timeout
});

// Create a separate client for development proxy
const devApiClient = axios.create({
  baseURL: import.meta.env.DEV ? '' : REIGENT_BASE_URL, // Use proxy in dev, direct in prod
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${REIGENT_SECRET}`
  },
  timeout: 120000 // 120 seconds maximum timeout
});

// Production client using Netlify Functions
const prodApiClient = axios.create({
  baseURL: '/.netlify/functions',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 120000
});

// Debug interceptors
const addInterceptors = (client: AxiosInstance) => {
  client.interceptors.request.use(request => {
    if (DEBUG_MODE) {
      console.log('Reigent API Request:', {
        url: request.url,
        method: request.method,
        params: request.params,
        headers: {
          ...request.headers,
          Authorization: 'Bearer [REDACTED]' // Don't log the actual token
        }
      });
    }
    return request;
  });

  client.interceptors.response.use(
    response => {
      if (DEBUG_MODE) {
        console.log('Reigent API Response:', {
          status: response.status,
          data: response.data
        });
      }
      return response;
    },
    error => {
      if (DEBUG_MODE) {
        console.error('Reigent API Error Details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          url: error.config?.url
        });
      }
      console.error('Reigent API Error:', error.response?.data || error.message);
      return Promise.reject(error);
    }
  );
};

// Add interceptors to all clients
addInterceptors(reigentApiClient);
addInterceptors(devApiClient);
addInterceptors(prodApiClient);

// Define types for Reigent API responses
export interface ReigentAgent {
  id: number;
  identifier: string;
  name: string;
  behavior_prompt: string;
  agent_functionalities: string;
  agent_model: {
    id: number;
    name: string;
    model_name: string;
  };
  response_format: string;
  temperature: number;
  max_tokens: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatCompletionRequest {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  n?: number;
  seed?: number;
  stream?: boolean;
  stop?: string | string[];
  presence_penalty?: number;
  frequency_penalty?: number;
  logit_bias?: Record<string, number>;
  logprobs?: boolean;
  top_logprobs?: number;
  user?: string;
  response_format?: {
    type: 'text' | 'json_object';
  };
  tools?: any[];
  tool_choice?: string | object;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface CreateAgentRequest {
  agentModel: 'claude-3.7-sonnet' | 'claude-sonnet-4' | 'gemini-2.5-flash-preview-05-20';
  behaviourPrompt: string;
  temperature?: number;
  maxTokens?: number;
  responseFormat?: 'text' | 'json' | 'markdown' | 'html';
  color?: string;
}

export interface CreateAgentResponse {
  secretToken: string;
}

// Validation functions
const isValidSecretKey = (key: string): boolean => {
  if (!key) return false;
  
  // Accept keys that start with rei_sk_ (standard format)
  if (key.startsWith('rei_sk_') && key.length > 20) {
    return true;
  }
  
  // Accept hex keys (64 character hex string)
  if (/^[a-f0-9]{64}$/i.test(key)) {
    return true;
  }
  
  // Accept other long alphanumeric keys (fallback)
  if (key.length >= 32 && /^[a-zA-Z0-9]+$/.test(key)) {
    return true;
  }
  
  return false;
};

// Check if we have a public key (starts with pk_rei_)
const isPublicKey = (key: string): boolean => {
  return key && key.startsWith('pk_rei_');
};

// Determine if we should use mock data
let USE_MOCKS = !REIGENT_SECRET || !isValidSecretKey(REIGENT_SECRET);

// Get the appropriate client based on environment
const getClient = () => {
  if (import.meta.env.PROD) {
    return prodApiClient; // Use Netlify Functions in production
  } else if (import.meta.env.DEV) {
    return devApiClient; // Use proxy in development
  } else {
    return reigentApiClient; // Direct API calls (fallback)
  }
};

// Test API connection
const testApiConnection = async (): Promise<{ connected: boolean; endpoint?: string; error?: string }> => {
  const client = getClient();
  
  try {
    let testEndpoint = '';
    
    if (import.meta.env.PROD) {
      // Test Netlify Function
      testEndpoint = '/reigent-proxy';
      console.log(`Testing Netlify Function: ${testEndpoint}`);
      
      const response = await client.post(testEndpoint, {
        endpoint: '/v1/agents'
      }, { timeout: 30000 });
      
      console.log(`✅ Successfully connected via Netlify Function`);
      return { connected: true, endpoint: testEndpoint };
    } else if (import.meta.env.DEV) {
      // Test development proxy
      testEndpoint = '/reigent/v1/agents';
      console.log(`Testing development proxy: ${testEndpoint}`);
      
      const response = await client.get(testEndpoint, { timeout: 30000 });
      console.log(`✅ Successfully connected via development proxy`);
      return { connected: true, endpoint: testEndpoint };
    } else {
      // Test direct API
      testEndpoint = '/v1/agents';
      console.log(`Testing direct API: ${testEndpoint}`);
      
      const response = await client.get(testEndpoint, { timeout: 30000 });
      console.log(`✅ Successfully connected to direct API`);
      return { connected: true, endpoint: testEndpoint };
    }
  } catch (error: any) {
    console.log(`❌ Failed to connect to Reigent API: ${error.message}`);
    
    // Check if it's a CORS error
    if (error.message.includes('Network Error') && !import.meta.env.DEV) {
      return { 
        connected: false, 
        error: 'CORS error - check Netlify Functions configuration' 
      };
    }
    
    // Check if it's an authorization error
    if (error.response?.status === 401 || error.response?.status === 403) {
      return {
        connected: false,
        error: 'Authorization failed - invalid or missing secret key'
      };
    }
    
    // Check if it's a 404 error (function not found)
    if (error.response?.status === 404) {
      return {
        connected: false,
        error: 'Netlify Function not found - check deployment configuration'
      };
    }
    
    return { 
      connected: false, 
      error: error.response?.data?.message || error.message 
    };
  }
};

// Reigent Service
export const reigentService = {
  // Test API connection and set mock mode accordingly
  initialize: async (): Promise<{ success: boolean; message: string; usingMocks: boolean }> => {
    // Debug: Log environment variables (without exposing the actual key)
    console.log('Environment check:', {
      hasViteReigentSecret: !!import.meta.env.VITE_REIGENT_SECRET,
      keyLength: REIGENT_SECRET.length,
      keyPreview: REIGENT_SECRET ? `${REIGENT_SECRET.substring(0, 8)}...` : 'none',
      isDev: import.meta.env.DEV,
      isProd: import.meta.env.PROD
    });

    // Check if we're using placeholder/invalid API configuration
    if (!REIGENT_SECRET) {
      USE_MOCKS = true;
      return {
        success: false,
        message: 'No secret key provided, using mock data',
        usingMocks: true
      };
    }

    // Check if we have a public key instead of secret key
    if (isPublicKey(REIGENT_SECRET)) {
      USE_MOCKS = true;
      return {
        success: false,
        message: 'Public key detected - Reigent API requires secret key, using mock data',
        usingMocks: true
      };
    }

    // Check if we have a valid secret key format
    if (!isValidSecretKey(REIGENT_SECRET)) {
      USE_MOCKS = true;
      return {
        success: false,
        message: `Invalid secret key format (length: ${REIGENT_SECRET.length}), using mock data`,
        usingMocks: true
      };
    }

    console.log(`✅ Valid Reigent secret key detected (${REIGENT_SECRET.length} chars)`);
    
    const connectionTest = await testApiConnection();
    USE_MOCKS = !connectionTest.connected;

    if (connectionTest.connected) {
      return {
        success: true,
        message: `Connected to Reigent API via ${import.meta.env.PROD ? 'Netlify Functions' : 'development proxy'}`,
        usingMocks: false
      };
    } else {
      return {
        success: false,
        message: `Failed to connect to Reigent API: ${connectionTest.error}. Using mock data.`,
        usingMocks: true
      };
    }
  },

  // Get agent information
  getAgent: async (): Promise<ReigentAgent> => {
    if (USE_MOCKS) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        id: 1,
        identifier: "crypto-analyst-001",
        name: "Crypto Trading Analyst",
        behavior_prompt: "You are an expert crypto trading analyst. Provide detailed trading signals with entry zones, targets, stop losses, and market analysis.",
        agent_functionalities: "market-analysis,technical-analysis,trading-signals",
        agent_model: {
          id: 1,
          name: "GPT-4o",
          model_name: "gpt-4o"
        },
        response_format: "text",
        temperature: 0.7,
        max_tokens: 1024
      };
    }

    try {
      const client = getClient();
      
      if (import.meta.env.PROD) {
        // Use Netlify Function
        const response = await client.post('/reigent-proxy', {
          endpoint: '/v1/agents'
        });
        return response.data;
      } else {
        // Use proxy or direct API
        const basePath = import.meta.env.DEV ? '/reigent' : '';
        const response = await client.get(`${basePath}/v1/agents`);
        return response.data;
      }
    } catch (error) {
      console.warn('Failed to get agent, falling back to mock data');
      USE_MOCKS = true;
      return reigentService.getAgent();
    }
  },

  // Chat completion
  chatCompletion: async (request: ChatCompletionRequest): Promise<ChatCompletionResponse> => {
    if (USE_MOCKS) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a mock response based on the last user message
      const lastMessage = request.messages[request.messages.length - 1];
      const userQuery = lastMessage.content.toLowerCase();
      
      let mockResponse = '';
      
      if (userQuery.includes('btc') || userQuery.includes('bitcoin')) {
        mockResponse = `🧠 Bitcoin Signal Analysis

📈 Asset: BTC

• 💡 View: Neutral → Consolidating in range, awaiting directional catalyst
• 🎯 Entry Zone: $106,500 to $108,500
• 💰 Take Profits: TP1 $112,000 → TP2 $118,000 → TP3 $125,000
• 🛑 Stop Loss: $104,000 (below range support)
• 🚨 Invalidate if: Daily close below 104k or rejection at resistance with high volume

🔍 Insights:
• Institutional profit-taking and holiday season liquidity affecting price action
• Sideways consolidation with decreasing volatility suggests coiling for next move
• Strong support at 105k level with whale accumulation continuing
• Resistance at 110k proving strong with holiday season typically lower volume`;
      } else if (userQuery.includes('eth') || userQuery.includes('ethereum')) {
        mockResponse = `🧠 Ethereum Signal Analysis

📈 Asset: ETH

• 💡 View: Bearish → Continued weakness below key resistance levels
• 🎯 Entry Zone: $2,720 to $2,760
• 💰 Take Profits: TP1 $2,650 → TP2 $2,550 → TP3 $2,400
• 🛑 Stop Loss: $2,820 (above recent swing high)
• 🚨 Invalidate if: Daily close above 2820 or BTC breaks above 110k with strength

🔍 Insights:
• Layer 2 competition and reduced DeFi activity weighing on sentiment
• ETH/BTC ratio declining showing relative weakness
• Lower highs and lower lows pattern forming with weak momentum
• Gas fees remaining low indicating reduced network usage`;
      } else if (userQuery.includes('sol') || userQuery.includes('solana')) {
        mockResponse = `🧠 Solana Signal Analysis

📈 Asset: SOL

• 💡 View: Bearish → Breaking below key support with increasing selling pressure
• 🎯 Entry Zone: $155.20 to $160.80
• 💰 Take Profits: TP1 $145.00 → TP2 $135.50 → TP3 $125.00
• 🛑 Stop Loss: $165.00 (above recent swing high)
• 🚨 Invalidate if: Daily close above 165.00 or BTC breaks above 110k with strength

🔍 Insights:
• Broader crypto market weakness and profit-taking affecting momentum
• Break below ascending triangle support with volume confirmation
• RSI showing bearish momentum with volume increasing on red candles
• Strong support at 150 psychological level could provide bounce opportunity`;
      } else {
        mockResponse = `🧠 Crypto Market Analysis

Based on your query about "${lastMessage.content}", here's the current market assessment:

• 💡 View: Mixed signals across crypto markets with sector rotation ongoing
• 🎯 Key Levels: Monitor major support/resistance zones for directional bias
• 💰 Opportunities: Selective positioning in oversold quality assets
• 🛑 Risk Management: Tight stops recommended in current volatility

🔍 Market Insights:
• Holiday season liquidity creating choppy price action across assets
• Institutional rebalancing and profit-taking creating selling pressure
• Technical levels becoming more important as fundamental catalysts limited
• Focus on risk management and position sizing in current environment`;
      }

      return {
        id: `chatcmpl-${Date.now()}`,
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        model: 'reigent-crypto-analyst',
        choices: [{
          index: 0,
          message: {
            role: 'assistant',
            content: mockResponse
          },
          finish_reason: 'stop'
        }],
        usage: {
          prompt_tokens: 50,
          completion_tokens: 200,
          total_tokens: 250
        }
      };
    }

    try {
      const client = getClient();
      
      if (import.meta.env.PROD) {
        // Use Netlify Function
        const response = await client.post('/reigent-proxy', {
          endpoint: '/v1/chat/completions',
          ...request
        });
        return response.data;
      } else {
        // Use proxy or direct API
        const basePath = import.meta.env.DEV ? '/reigent' : '';
        const response = await client.post(`${basePath}/v1/chat/completions`, request);
        return response.data;
      }
    } catch (error) {
      console.warn('Failed to chat with agent, falling back to mock data');
      USE_MOCKS = true;
      return reigentService.chatCompletion(request);
    }
  },

  // Create new agent (requires user secret token)
  createAgent: async (request: CreateAgentRequest, userSecretToken: string): Promise<CreateAgentResponse> => {
    if (USE_MOCKS) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        secretToken: `rei_sk_mock_${Date.now()}`
      };
    }

    try {
      const client = getClient();
      
      if (import.meta.env.PROD) {
        // Use Netlify Function with user token
        const response = await client.post('/reigent-proxy', {
          endpoint: '/v1/accounts/units',
          userToken: userSecretToken,
          ...request
        });
        return response.data;
      } else {
        // Use proxy or direct API
        const basePath = import.meta.env.DEV ? '/reigent' : '';
        const response = await client.post(`${basePath}/v1/accounts/units`, request, {
          headers: {
            'Authorization': `Bearer ${userSecretToken}`
          }
        });
        return response.data;
      }
    } catch (error) {
      console.warn('Failed to create agent, falling back to mock data');
      USE_MOCKS = true;
      return reigentService.createAgent(request, userSecretToken);
    }
  },

  // Test connection manually
  testConnection: async (): Promise<{ success: boolean; message: string; details?: any }> => {
    try {
      const result = await testApiConnection();
      if (result.connected) {
        return {
          success: true,
          message: `Successfully connected to Reigent API at ${result.endpoint}`,
          details: { endpoint: result.endpoint, baseUrl: REIGENT_BASE_URL }
        };
      } else {
        return {
          success: false,
          message: result.error || 'Connection failed',
          details: { baseUrl: REIGENT_BASE_URL, endpoint: '/v1/agents' }
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: `Connection test failed: ${error.message}`,
        details: { error: error.message, baseUrl: REIGENT_BASE_URL }
      };
    }
  },

  // Get current mock status
  isUsingMocks: () => USE_MOCKS,

  // Force enable/disable mocks
  setMockMode: (useMocks: boolean) => {
    USE_MOCKS = useMocks;
  }
};

export default reigentService;