import axios from 'axios';

const REI_SECRET_KEY = 'f37b4018b61af7f466844eb436cc378c842ebcfa45aecd21f49c434f0fd2442a';
const REI_BASE_URL = 'https://api.reisearch.box';

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
const reiClient = axios.create({
  baseURL: REI_BASE_URL,
  headers: {
    'Authorization': `Bearer ${REI_SECRET_KEY}`,
    'Content-Type': 'application/json'
  },
  timeout: 60000 // 60 seconds for LLM responses
});

// Simple REI service
const reiService = {
  // Initialize and test connection
  initialize: async (): Promise<{ success: boolean; message: string; usingMocks: boolean }> => {
    try {
      // Test the connection with a simple request
      const testResponse = await reiClient.post('/v1/chat/completions', {
        messages: [{ role: 'user', content: 'Hello' }],
        temperature: 0.7,
        max_tokens: 10
      });

      if (testResponse.status === 200) {
        console.log('✅ REI API connected successfully');
        return {
          success: true,
          message: 'Connected to REI Network API',
          usingMocks: false
        };
      }
    } catch (error: any) {
      console.error('❌ REI API connection failed:', error.message);
      return {
        success: false,
        message: `Connection failed: ${error.message}`,
        usingMocks: true
      };
    }

    return {
      success: false,
      message: 'Unknown connection error',
      usingMocks: true
    };
  },

  // Chat with the REI agent
  chatWithAgent: async (request: REIChatRequest): Promise<REIChatResponse> => {
    try {
      const response = await reiClient.post('/v1/chat/completions', {
        messages: request.messages,
        temperature: request.temperature || 0.7,
        max_tokens: request.max_tokens || 1000
      });

      return response.data;
    } catch (error: any) {
      console.error('REI chat error:', error.message);
      
      // Return mock response on error
      return {
        choices: [{
          message: {
            role: 'assistant',
            content: `🧠 Mock Signal — ${new Date().toLocaleDateString()}

📈 Asset: BTC

• 💡 View: Bullish → Strong momentum continuation pattern
• 🎯 Entry Zone: $106,800 to $107,500
• 💰 Take Profits: TP1 $110,000 → TP2 $115,000 → TP3 $120,000
• 🛑 Stop Loss: $105,000 (hard exit)
• 🚨 Invalidate if: BTC dumps below 105k, funding > +0.3%

🔍 Insights:
• Institutional accumulation detected in last 6 hours
• Options flow showing bullish positioning for year-end
• On-chain metrics confirm whale interest at current levels
• Technical breakout above 107k could trigger momentum acceleration`
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