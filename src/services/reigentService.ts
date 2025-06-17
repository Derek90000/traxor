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

// Create axios instance
const apiClient = axios.create({
  timeout: 30000 // 30 seconds
});

// Simple REI service that uses mock data for now
const reiService = {
  // Initialize - always returns success with mock data
  initialize: async (): Promise<{ success: boolean; message: string; usingMocks: boolean }> => {
    console.log('🎭 Initializing with mock data for development');
    return {
      success: true,
      message: 'Mock Signal Engine Active',
      usingMocks: true
    };
  },

  // Chat with mock responses
  chatWithAgent: async (request: REIChatRequest): Promise<REIChatResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

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
    } else if (query.includes('sol') || query.includes('solana')) {
      mockResponse = `🧠 Solana Signal Analysis — ${new Date().toLocaleDateString()}

📈 Asset: SOL

• 💡 View: Bearish → Breaking below key support with increasing selling pressure
• 🎯 Entry Zone: $155.20 to $160.80 (short)
• 💰 Take Profits: TP1 $145.00 → TP2 $135.50 → TP3 $125.00
• 🛑 Stop Loss: $165.00 (above recent swing high)
• 🚨 Invalidate if: Daily close above 165.00 or BTC breaks above 110k with strength

🔍 Insights:
• Broader crypto market weakness and profit-taking affecting momentum
• Break below ascending triangle support with volume confirmation
• RSI showing bearish momentum with volume increasing on red candles
• Strong support at 150 psychological level could provide bounce opportunity`;
    } else if (query.includes('hype')) {
      mockResponse = `🧠 HYPE Token Signal Analysis — ${new Date().toLocaleDateString()}

📈 Asset: HYPE

• 💡 View: Bullish → Strong momentum despite broader market weakness
• 🎯 Entry Zone: $40.50 to $42.00
• 💰 Take Profits: TP1 $45.00 → TP2 $48.50 → TP3 $52.00
• 🛑 Stop Loss: $38.50 (below key support)
• 🚨 Invalidate if: Volume drops below 500M or BTC crashes below 105k

🔍 Insights:
• New token with strong community backing and viral momentum
• High volume suggesting institutional interest despite recent launch
• Social sentiment extremely bullish with growing holder base
• Risk management crucial due to high volatility and newness`;
    } else if (query.includes('moodeng')) {
      mockResponse = `🧠 MOODENG Signal Analysis — ${new Date().toLocaleDateString()}

📈 Asset: MOODENG

• 💡 View: Bearish → Meme coin correction after initial pump
• 🎯 Entry Zone: $0.175 to $0.185 (bounce play)
• 💰 Take Profits: TP1 $0.195 → TP2 $0.210 → TP3 $0.225
• 🛑 Stop Loss: $0.165 (below recent low)
• 🚨 Invalidate if: Volume stays below 5M or broader meme sector weakness

🔍 Insights:
• Typical meme coin volatility with -11% move creating oversold conditions
• Social media buzz still strong suggesting potential bounce
• Low market cap means high risk/high reward potential
• Watch for whale movements and social sentiment shifts`;
    } else if (query.includes('pnut')) {
      mockResponse = `🧠 PNUT Signal Analysis — ${new Date().toLocaleDateString()}

📈 Asset: PNUT

• 💡 View: Neutral → Oversold bounce potential after sharp decline
• 🎯 Entry Zone: $0.255 to $0.265
• 💰 Take Profits: TP1 $0.280 → TP2 $0.295 → TP3 $0.315
• 🛑 Stop Loss: $0.245 (below recent support)
• 🚨 Invalidate if: Breaks below $0.24 or meme sector continues weakness

🔍 Insights:
• Sharp -9.4% decline creating potential oversold bounce setup
• Meme coin sector showing mixed signals with selective strength
• Volume still decent suggesting some institutional interest remains
• Risk management essential due to high volatility nature`;
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
};

export default reiService;