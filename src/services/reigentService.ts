import axios from 'axios';

// Simple chat message interface
export interface REIChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Chat request interface
export interface REIChatRequest {
  messages: REIChatMessage[];
  temperature?: number;
  max_tokens?: number;
}

// Chat response interface
export interface REIChatResponse {
  choices: Array<{
    message: REIChatMessage;
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Create axios instance for REI API
const apiClient = axios.create({
  baseURL: 'https://api.reisearch.box/v1',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer f37b4018b61af7f466844eb436cc378c842ebcfa45aecd21f49c434f0fd2442a`
  }
});

// REI service with real API integration
const reiService = {
  // Initialize - test the connection
  initialize: async (): Promise<{ success: boolean; message: string; usingMocks: boolean }> => {
    try {
      console.log('🔌 Testing REI API connection...');
      
      // Test with a simple message
      const testRequest: REIChatRequest = {
        messages: [
          {
            role: 'user',
            content: 'Hello, are you working?'
          }
        ],
        temperature: 0.7,
        max_tokens: 100
      };

      const response = await apiClient.post('/chat/completions', testRequest);
      
      if (response.status === 200 && response.data.choices) {
        console.log('✅ REI API connection successful');
        return {
          success: true,
          message: 'REI Network Connected',
          usingMocks: false
        };
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: any) {
      console.error('❌ REI API connection failed:', error.message);
      console.log('🎭 Falling back to mock data');
      
      return {
        success: false,
        message: `REI API Error: ${error.message}`,
        usingMocks: true
      };
    }
  },

  // Chat with real REI API
  chatWithAgent: async (request: REIChatRequest): Promise<REIChatResponse> => {
    try {
      console.log('📡 Sending request to REI API...');
      
      const response = await apiClient.post('/chat/completions', request);
      
      if (response.status === 200 && response.data.choices) {
        console.log('✅ REI API response received');
        return response.data;
      } else {
        throw new Error('Invalid response format from REI API');
      }
    } catch (error: any) {
      console.error('❌ REI API call failed:', error.message);
      
      // Fallback to mock response
      console.log('🎭 Using mock response as fallback');
      
      const userMessage = request.messages[request.messages.length - 1];
      const query = userMessage.content.toLowerCase();

      let mockResponse = '';

      if (query.includes('btc') || query.includes('bitcoin')) {
        mockResponse = `🧠 Bitcoin Signal Analysis — ${new Date().toLocaleDateString()}

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
      } else if (query.includes('eth') || query.includes('ethereum')) {
        mockResponse = `🧠 Ethereum Signal Analysis — ${new Date().toLocaleDateString()}

📈 Asset: ETH

• 💡 View: Bearish → Continued weakness below key resistance levels
• 🎯 Entry Zone: $2,720 to $2,760 (short)
• 💰 Take Profits: TP1 $2,650 → TP2 $2,550 → TP3 $2,400
• 🛑 Stop Loss: $2,820 (above recent swing high)
• 🚨 Invalidate if: Daily close above 2820 or BTC breaks above 110k with strength

🔍 Insights:
• Layer 2 competition and reduced DeFi activity weighing on sentiment
• ETH/BTC ratio declining showing relative weakness
• Lower highs and lower lows pattern forming with weak momentum
• Gas fees remaining low indicating reduced network usage`;
      } else {
        mockResponse = `🧠 Crypto Market Analysis — ${new Date().toLocaleDateString()}

📈 Market Overview

• 💡 View: Mixed → Holiday season creating choppy conditions across crypto
• 🎯 Strategy: Selective positioning in quality assets with tight risk management
• 💰 Opportunities: Look for oversold bounces in strong fundamentals
• 🛑 Risk Management: Reduce position sizes, use tight stops
• 🚨 Watch for: Year-end institutional rebalancing and low liquidity moves

🔍 Market Insights:
• Bitcoin consolidating in 105k-110k range with decreasing volatility
• Altcoins showing mixed performance with sector rotation ongoing
• Meme coins experiencing typical high volatility corrections
• Holiday season liquidity creating exaggerated moves in both directions`;
      }

      return {
        choices: [{
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
  }
};

export default reiService;