// src/services/reiService.ts
import axios from 'axios';
import { REI_API_KEY, REI_API_BASE_URL } from '../config/env';

// Debug mode for troubleshooting
let DEBUG_MODE = false;

export const enableDebugMode = () => {
  DEBUG_MODE = true;
  console.log('REI API debug mode enabled');
};

// Create axios instance with REI API configuration
const reiApiClient = axios.create({
  baseURL: REI_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${REI_API_KEY}`
  },
  timeout: 15000 // 15 second timeout
});

// Create a separate client for development proxy
const devApiClient = axios.create({
  baseURL: import.meta.env.DEV ? '' : REI_API_BASE_URL, // Use proxy in dev, direct in prod
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${REI_API_KEY}`
  },
  timeout: 15000
});

// Debug interceptors
const addInterceptors = (client: typeof reiApiClient) => {
  client.interceptors.request.use(request => {
    if (DEBUG_MODE) {
      console.log('REI API Request:', {
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
        console.log('REI API Response:', {
          status: response.status,
          data: response.data
        });
      }
      return response;
    },
    error => {
      if (DEBUG_MODE) {
        console.error('REI API Error Details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          url: error.config?.url
        });
      }
      console.error('REI API Error:', error.response?.data || error.message);
      return Promise.reject(error);
    }
  );
};

// Add interceptors to both clients
addInterceptors(reiApiClient);
addInterceptors(devApiClient);

// Define types for REI API responses
export interface REIAgent {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  status: 'active' | 'inactive';
}

export interface REIChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface REIChatRequest {
  messages: REIChatMessage[];
  agent_id?: string;
  max_tokens?: number;
  temperature?: number;
  stream?: boolean;
}

export interface REIChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: REIChatMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface MarketData {
  symbol: string;
  price: number;
  priceChange24h: number;
  priceChangeDirection: string;
  volume24h: number;
  marketCap: number;
  technicals: {
    rsi: number;
    macd: string;
    volumeProfile: string;
  };
}

export interface TradingSignal {
  asset: string;
  currentPrice: number;
  view: 'Bullish' | 'Bearish' | 'Neutral';
  viewReason: string;
  entryZone: {
    min: number;
    max: number;
    reasoning: string;
  };
  targets: number[];
  stopLoss: {
    price: number;
    reasoning: string;
  };
  invalidation: string;
  analysis: {
    summary: string;
    details: string;
  };
  insights: {
    driver: string;
    chartBehavior: string;
    supportingSignals: string[];
    contradictingSignals: string[];
    sentiment: string;
    wildcard?: string;
  };
}

// Mock data for development/testing
const mockMarketData = {
  SOL: {
    symbol: 'SOL',
    price: 158.63,
    priceChange24h: -4.90,
    priceChangeDirection: 'down',
    volume24h: 781000000,
    marketCap: 67890123456,
    technicals: {
      rsi: 42.3,
      macd: 'bearish crossover',
      volumeProfile: 'decreasing'
    }
  },
  BTC: {
    symbol: 'BTC',
    price: 107607,
    priceChange24h: -1.75,
    priceChangeDirection: 'down',
    volume24h: 32456789012,
    marketCap: 987654321098,
    technicals: {
      rsi: 45.2,
      macd: 'neutral',
      volumeProfile: 'above average'
    }
  },
  ETH: {
    symbol: 'ETH',
    price: 2740.4,
    priceChange24h: -1.92,
    priceChangeDirection: 'down',
    volume24h: 15456789012,
    marketCap: 365890123456,
    technicals: {
      rsi: 38.7,
      macd: 'bearish',
      volumeProfile: 'decreasing'
    }
  },
  HYPE: {
    symbol: 'HYPE',
    price: 41.480,
    priceChange24h: -2.70,
    priceChangeDirection: 'down',
    volume24h: 746000000,
    marketCap: 12345678901,
    technicals: {
      rsi: 35.8,
      macd: 'oversold bounce',
      volumeProfile: 'increasing'
    }
  },
  MOODENG: {
    symbol: 'MOODENG',
    price: 0.18271,
    priceChange24h: -11.49,
    priceChangeDirection: 'down',
    volume24h: 9600000,
    marketCap: 182710000,
    technicals: {
      rsi: 28.5,
      macd: 'oversold',
      volumeProfile: 'high'
    }
  },
  PNUT: {
    symbol: 'PNUT',
    price: 0.25982,
    priceChange24h: -9.44,
    priceChangeDirection: 'down',
    volume24h: 2600000,
    marketCap: 259820000,
    technicals: {
      rsi: 31.2,
      macd: 'oversold bounce potential',
      volumeProfile: 'elevated'
    }
  },
  FARTCOIN: {
    symbol: 'FARTCOIN',
    price: 1.3412,
    priceChange24h: -1.38,
    priceChangeDirection: 'down',
    volume24h: 45000000,
    marketCap: 1341200000,
    technicals: {
      rsi: 48.7,
      macd: 'neutral',
      volumeProfile: 'normal'
    }
  }
};

// Updated validation functions to accept your key format
const isValidSecretKey = (key: string): boolean => {
  if (!key) return false;
  
  // Accept keys that start with rei_sk_ (standard format)
  if (key.startsWith('rei_sk_') && key.length > 20) {
    return true;
  }
  
  // Accept hex keys (your format) - 64 character hex string
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
let USE_MOCKS = !REI_API_KEY || !isValidSecretKey(REI_API_KEY);

// Test API connection using the documented endpoints
const testApiConnection = async (): Promise<{ connected: boolean; endpoint?: string; error?: string }> => {
  const client = import.meta.env.DEV ? devApiClient : reiApiClient;
  const basePath = import.meta.env.DEV ? '/rei' : '';
  
  try {
    console.log(`Testing REI API connection to: ${basePath}/v1/agents`);
    const response = await client.get(`${basePath}/v1/agents`, { timeout: 5000 });
    console.log(`✅ Successfully connected to REI API`);
    return { connected: true, endpoint: '/v1/agents' };
  } catch (error: any) {
    console.log(`❌ Failed to connect to REI API: ${error.message}`);
    
    // Check if it's a CORS error
    if (error.message.includes('Network Error') && !import.meta.env.DEV) {
      return { 
        connected: false, 
        error: 'CORS error - API needs to allow cross-origin requests or use a proxy' 
      };
    }
    
    // Check if it's an authorization error
    if (error.response?.status === 401 || error.response?.status === 403) {
      return {
        connected: false,
        error: 'Authorization failed - invalid or missing secret key'
      };
    }
    
    return { 
      connected: false, 
      error: error.response?.data?.message || error.message 
    };
  }
};

// REI Service with correct API endpoints
export const reiService = {
  // Test API connection and set mock mode accordingly
  initialize: async (): Promise<{ success: boolean; message: string; usingMocks: boolean }> => {
    // Check if we're using placeholder/invalid API configuration
    if (!REI_API_KEY) {
      USE_MOCKS = true;
      return {
        success: false,
        message: 'No API key provided, using mock data',
        usingMocks: true
      };
    }

    // Check if we have a public key instead of secret key
    if (isPublicKey(REI_API_KEY)) {
      USE_MOCKS = true;
      return {
        success: false,
        message: 'Public key detected - REI API requires secret key, using mock data',
        usingMocks: true
      };
    }

    // Check if we have a valid secret key format
    if (!isValidSecretKey(REI_API_KEY)) {
      USE_MOCKS = true;
      return {
        success: false,
        message: `Invalid API key format (length: ${REI_API_KEY.length}), using mock data`,
        usingMocks: true
      };
    }

    console.log(`✅ Valid REI API key detected (${REI_API_KEY.length} chars)`);
    
    const connectionTest = await testApiConnection();
    USE_MOCKS = !connectionTest.connected;

    if (connectionTest.connected) {
      return {
        success: true,
        message: `Connected to REI API at ${connectionTest.endpoint}`,
        usingMocks: false
      };
    } else {
      return {
        success: false,
        message: `Failed to connect to REI API: ${connectionTest.error}. Using mock data.`,
        usingMocks: true
      };
    }
  },

  // List available agents
  listAgents: async (): Promise<REIAgent[]> => {
    if (USE_MOCKS) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        {
          id: 'crypto-analyst',
          name: 'Crypto Market Analyst',
          description: 'Specialized in cryptocurrency market analysis and trading signals',
          capabilities: ['market-analysis', 'technical-analysis', 'sentiment-analysis'],
          status: 'active'
        },
        {
          id: 'defi-expert',
          name: 'DeFi Protocol Expert',
          description: 'Expert in decentralized finance protocols and yield strategies',
          capabilities: ['defi-analysis', 'yield-farming', 'protocol-research'],
          status: 'active'
        }
      ];
    }

    try {
      const client = import.meta.env.DEV ? devApiClient : reiApiClient;
      const basePath = import.meta.env.DEV ? '/rei' : '';
      const response = await client.get(`${basePath}/v1/agents`);
      return response.data;
    } catch (error) {
      console.warn('Failed to list agents, falling back to mock data');
      USE_MOCKS = true;
      return reiService.listAgents();
    }
  },

  // Chat with an agent
  chatWithAgent: async (request: REIChatRequest): Promise<REIChatResponse> => {
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
        model: 'rei-crypto-analyst',
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
      const client = import.meta.env.DEV ? devApiClient : reiApiClient;
      const basePath = import.meta.env.DEV ? '/rei' : '';
      const response = await client.post(`${basePath}/v1/chat/completions`, request);
      return response.data;
    } catch (error) {
      console.warn('Failed to chat with agent, falling back to mock data');
      USE_MOCKS = true;
      return reiService.chatWithAgent(request);
    }
  },

  // Test connection manually
  testConnection: async (): Promise<{ success: boolean; message: string; details?: any }> => {
    try {
      const result = await testApiConnection();
      if (result.connected) {
        return {
          success: true,
          message: `Successfully connected to REI API at ${result.endpoint}`,
          details: { endpoint: result.endpoint, baseUrl: REI_API_BASE_URL }
        };
      } else {
        return {
          success: false,
          message: result.error || 'Connection failed',
          details: { baseUrl: REI_API_BASE_URL, endpoint: '/v1/agents' }
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: `Connection test failed: ${error.message}`,
        details: { error: error.message, baseUrl: REI_API_BASE_URL }
      };
    }
  },

  // Legacy methods for backward compatibility
  getMarketData: async (symbol: string): Promise<MarketData> => {
    if (USE_MOCKS) {
      const mockData = mockMarketData[symbol as keyof typeof mockMarketData];
      if (!mockData) {
        throw new Error(`No mock data available for ${symbol}. Available symbols: ${Object.keys(mockMarketData).join(', ')}`);
      }
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockData;
    }

    // For now, use chat completion to get market data
    const chatRequest: REIChatRequest = {
      messages: [
        {
          role: 'user',
          content: `Get current market data for ${symbol} including price, volume, and technical indicators`
        }
      ]
    };

    try {
      const response = await reiService.chatWithAgent(chatRequest);
      // Parse the response and convert to MarketData format
      // This would need to be implemented based on actual API response format
      throw new Error('Market data parsing not implemented yet');
    } catch (error) {
      console.warn('API call failed, falling back to mock data');
      USE_MOCKS = true;
      return reiService.getMarketData(symbol);
    }
  },

  getTradingSignal: async (asset: string): Promise<TradingSignal> => {
    // Use the chat completion API to get trading signals
    const chatRequest: REIChatRequest = {
      messages: [
        {
          role: 'system',
          content: 'You are a crypto trading analyst. Provide trading signals in a structured format with entry zones, targets, stop losses, and market analysis.'
        },
        {
          role: 'user',
          content: `Give me a detailed trading signal for ${asset} with current market analysis, entry zones, take profit targets, stop loss levels, and key insights.`
        }
      ],
      temperature: 0.7,
      max_tokens: 800
    };

    try {
      const response = await reiService.chatWithAgent(chatRequest);
      const content = response.choices[0].message.content;
      
      // Parse the response into TradingSignal format
      // This is a simplified parser - you might want to make it more robust
      return {
        asset,
        currentPrice: mockMarketData[asset as keyof typeof mockMarketData]?.price || 0,
        view: 'Neutral',
        viewReason: 'Analysis from REI agent',
        entryZone: {
          min: 0,
          max: 0,
          reasoning: 'Based on REI analysis'
        },
        targets: [],
        stopLoss: {
          price: 0,
          reasoning: 'Risk management level'
        },
        invalidation: 'Market structure change',
        analysis: {
          summary: 'REI Agent Analysis',
          details: content
        },
        insights: {
          driver: 'Market dynamics',
          chartBehavior: 'Technical analysis',
          supportingSignals: [],
          contradictingSignals: [],
          sentiment: 'neutral'
        }
      };
    } catch (error) {
      console.warn('Failed to get trading signal, falling back to mock data');
      USE_MOCKS = true;
      
      // Return mock signal if available
      const mockSignals = {
        SOL: {
          asset: 'SOL',
          currentPrice: 158.63,
          view: 'Bearish' as const,
          viewReason: 'Breaking below key support with increasing selling pressure',
          entryZone: {
            min: 155.20,
            max: 160.80,
            reasoning: 'Current resistance zone after support break'
          },
          targets: [145.00, 135.50, 125.00],
          stopLoss: {
            price: 165.00,
            reasoning: 'Above recent swing high and 50-day EMA reclaim'
          },
          invalidation: 'Daily close above 165.00 or BTC breaks above 110k with strength',
          analysis: {
            summary: 'Bearish breakdown from consolidation pattern',
            details: 'SOL has broken below key support at 160 with increasing volume, suggesting further downside'
          },
          insights: {
            driver: 'Broader crypto market weakness and profit-taking',
            chartBehavior: 'Break below ascending triangle support with volume confirmation',
            supportingSignals: [
              'RSI showing bearish momentum',
              'Volume increasing on red candles',
              'Breaking below 21-day EMA'
            ],
            contradictingSignals: [
              'Strong support at 150 psychological level'
            ],
            sentiment: 'short-term bearish',
            wildcard: 'Solana ecosystem developments could provide support'
          }
        }
      };

      return mockSignals[asset as keyof typeof mockSignals] || {
        asset,
        currentPrice: 0,
        view: 'Neutral',
        viewReason: 'Insufficient data',
        entryZone: { min: 0, max: 0, reasoning: 'No data' },
        targets: [],
        stopLoss: { price: 0, reasoning: 'No data' },
        invalidation: 'No data available',
        analysis: { summary: 'No analysis available', details: 'No data' },
        insights: {
          driver: 'Unknown',
          chartBehavior: 'Unknown',
          supportingSignals: [],
          contradictingSignals: [],
          sentiment: 'neutral'
        }
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

export default reiService;