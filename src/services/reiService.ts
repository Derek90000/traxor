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

// Debug interceptors
reiApiClient.interceptors.request.use(request => {
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

reiApiClient.interceptors.response.use(
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

// Define types for REI API responses
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

export interface HistoricalData {
  symbol: string;
  timeframe: string;
  data: Array<{
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
}

export interface OnChainMetrics {
  blockchain: string;
  metric: string;
  value: number;
  change24h: number;
  timestamp: number;
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

const mockTradingSignal = {
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
  },
  BTC: {
    asset: 'BTC',
    currentPrice: 107607,
    view: 'Neutral' as const,
    viewReason: 'Consolidating in range, awaiting directional catalyst',
    entryZone: {
      min: 106500,
      max: 108500,
      reasoning: 'Current range support to resistance zone'
    },
    targets: [112000, 118000, 125000],
    stopLoss: {
      price: 104000,
      reasoning: 'Below range support and key psychological level'
    },
    invalidation: 'Daily close below 104k or rejection at resistance with high volume',
    analysis: {
      summary: 'Range-bound consolidation with slight bearish bias',
      details: 'BTC is consolidating after recent highs, waiting for next directional move'
    },
    insights: {
      driver: 'Institutional profit-taking and holiday season liquidity',
      chartBehavior: 'Sideways consolidation with decreasing volatility',
      supportingSignals: [
        'Strong support at 105k level',
        'Funding rates normalizing',
        'Whale accumulation continuing'
      ],
      contradictingSignals: [
        'Resistance at 110k proving strong',
        'Holiday season typically lower volume'
      ],
      sentiment: 'cautiously neutral',
      wildcard: 'Year-end institutional rebalancing could drive volatility'
    }
  },
  ETH: {
    asset: 'ETH',
    currentPrice: 2740.4,
    view: 'Bearish' as const,
    viewReason: 'Continued weakness below key resistance levels',
    entryZone: {
      min: 2720,
      max: 2760,
      reasoning: 'Current resistance zone with failed breakout attempts'
    },
    targets: [2650, 2550, 2400],
    stopLoss: {
      price: 2820,
      reasoning: 'Above recent swing high and 200-day EMA'
    },
    invalidation: 'Daily close above 2820 or BTC breaks above 110k with strength',
    analysis: {
      summary: 'Bearish continuation pattern with weak momentum',
      details: 'ETH showing relative weakness to BTC with failed breakout attempts'
    },
    insights: {
      driver: 'Layer 2 competition and reduced DeFi activity',
      chartBehavior: 'Lower highs and lower lows pattern forming',
      supportingSignals: [
        'ETH/BTC ratio declining',
        'Gas fees remaining low indicating reduced usage',
        'Staking rewards not attracting new capital'
      ],
      contradictingSignals: [
        'Strong support at 2600 level',
        'Upcoming protocol upgrades'
      ],
      sentiment: 'bearish',
      wildcard: 'Ethereum ETF flows could change sentiment quickly'
    }
  },
  HYPE: {
    asset: 'HYPE',
    currentPrice: 41.480,
    view: 'Neutral' as const,
    viewReason: 'Oversold bounce potential after recent decline',
    entryZone: {
      min: 40.50,
      max: 42.80,
      reasoning: 'Current support zone with oversold conditions'
    },
    targets: [45.00, 48.50, 52.00],
    stopLoss: {
      price: 38.00,
      reasoning: 'Below key psychological support level'
    },
    invalidation: 'Break below 38.00 or broader market selloff continues',
    analysis: {
      summary: 'Oversold conditions suggest potential bounce',
      details: 'HYPE has declined significantly and may be due for a relief rally'
    },
    insights: {
      driver: 'Oversold technical conditions and potential bargain hunting',
      chartBehavior: 'Steep decline with potential reversal signals',
      supportingSignals: [
        'RSI in oversold territory',
        'Volume increasing on recent decline',
        'Approaching key support levels'
      ],
      contradictingSignals: [
        'Overall market sentiment remains weak',
        'Limited fundamental catalysts'
      ],
      sentiment: 'cautiously optimistic',
      wildcard: 'Meme coin sector rotation could provide unexpected momentum'
    }
  },
  MOODENG: {
    asset: 'MOODENG',
    currentPrice: 0.18271,
    view: 'Bearish' as const,
    viewReason: 'Severe oversold conditions but momentum still negative',
    entryZone: {
      min: 0.17500,
      max: 0.19000,
      reasoning: 'Current price zone with extreme oversold readings'
    },
    targets: [0.15000, 0.12500, 0.10000],
    stopLoss: {
      price: 0.20500,
      reasoning: 'Above recent resistance and 50% retracement'
    },
    invalidation: 'Daily close above 0.205 or meme coin sector reversal',
    analysis: {
      summary: 'Extreme oversold but trend remains bearish',
      details: 'MOODENG showing severe weakness with potential for further decline'
    },
    insights: {
      driver: 'Meme coin sector rotation and profit-taking',
      chartBehavior: 'Steep decline with no clear support levels',
      supportingSignals: [
        'Extremely oversold RSI',
        'High volume on decline',
        'Potential dead cat bounce setup'
      ],
      contradictingSignals: [
        'No clear fundamental support',
        'Meme coin sector under pressure'
      ],
      sentiment: 'very bearish',
      wildcard: 'Social media sentiment could drive unexpected volatility'
    }
  },
  PNUT: {
    asset: 'PNUT',
    currentPrice: 0.25982,
    view: 'Bearish' as const,
    viewReason: 'Continued selling pressure in meme coin sector',
    entryZone: {
      min: 0.25000,
      max: 0.27000,
      reasoning: 'Current resistance zone with failed bounce attempts'
    },
    targets: [0.22000, 0.18000, 0.15000],
    stopLoss: {
      price: 0.29000,
      reasoning: 'Above recent swing high and key resistance'
    },
    invalidation: 'Daily close above 0.29 or sector sentiment reversal',
    analysis: {
      summary: 'Bearish trend continuation expected',
      details: 'PNUT following broader meme coin weakness with limited support'
    },
    insights: {
      driver: 'Meme coin sector rotation and reduced retail interest',
      chartBehavior: 'Lower highs pattern with weak bounces',
      supportingSignals: [
        'Sector-wide weakness',
        'Reduced social media mentions',
        'Volume declining on bounces'
      ],
      contradictingSignals: [
        'Oversold technical readings',
        'Potential for meme coin revival'
      ],
      sentiment: 'bearish',
      wildcard: 'Viral social media content could drive sudden reversal'
    }
  },
  FARTCOIN: {
    asset: 'FARTCOIN',
    currentPrice: 1.3412,
    view: 'Neutral' as const,
    viewReason: 'Holding better than other meme coins, consolidating',
    entryZone: {
      min: 1.30,
      max: 1.38,
      reasoning: 'Current consolidation range with relative strength'
    },
    targets: [1.45, 1.55, 1.70],
    stopLoss: {
      price: 1.25,
      reasoning: 'Below key support and psychological level'
    },
    invalidation: 'Break below 1.25 or broader meme coin selloff',
    analysis: {
      summary: 'Relative strength in weak sector suggests potential',
      details: 'FARTCOIN showing resilience compared to other meme coins'
    },
    insights: {
      driver: 'Relative strength and potential sector rotation',
      chartBehavior: 'Sideways consolidation with higher lows',
      supportingSignals: [
        'Outperforming other meme coins',
        'Volume remaining steady',
        'RSI in neutral territory'
      ],
      contradictingSignals: [
        'Overall meme coin sector weakness',
        'Limited fundamental value'
      ],
      sentiment: 'cautiously neutral',
      wildcard: 'Meme coin sector leader potential if sentiment improves'
    }
  }
};

// Determine if we should use mock data
let USE_MOCKS = !REI_API_KEY || REI_API_KEY === 'your_rei_api_key_here';

// Test API connection with multiple endpoints
const testApiConnection = async (): Promise<{ connected: boolean; endpoint?: string; error?: string }> => {
  const testEndpoints = [
    '/health',
    '/status', 
    '/api/health',
    '/v1/health',
    '/'
  ];

  for (const endpoint of testEndpoints) {
    try {
      console.log(`Testing REI API endpoint: ${REI_API_BASE_URL}${endpoint}`);
      const response = await reiApiClient.get(endpoint, { timeout: 5000 });
      console.log(`✅ Successfully connected to REI API at ${endpoint}`);
      return { connected: true, endpoint };
    } catch (error: any) {
      console.log(`❌ Failed to connect to ${endpoint}: ${error.message}`);
      continue;
    }
  }

  return { 
    connected: false, 
    error: 'Could not connect to any REI API endpoints' 
  };
};

// Check API version
export const checkApiVersion = async () => {
  try {
    const response = await reiApiClient.get('/version');
    const apiVersion = response.data.version;
    console.log(`Connected to REI API version: ${apiVersion}`);
    return apiVersion;
  } catch (error) {
    console.warn('Could not determine API version:', error);
    return null;
  }
};

// REI Service with typed methods
export const reiService = {
  // Test API connection and set mock mode accordingly
  initialize: async (): Promise<{ success: boolean; message: string; usingMocks: boolean }> => {
    if (!REI_API_KEY || REI_API_KEY === 'your_rei_api_key_here') {
      USE_MOCKS = true;
      return {
        success: false,
        message: 'No valid API key provided, using mock data',
        usingMocks: true
      };
    }

    const connectionTest = await testApiConnection();
    USE_MOCKS = !connectionTest.connected;

    if (connectionTest.connected) {
      // Try to get API version
      const version = await checkApiVersion();
      return {
        success: true,
        message: `Connected to REI API${version ? ` (version: ${version})` : ''} at ${connectionTest.endpoint}`,
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
          details: { baseUrl: REI_API_BASE_URL, testedEndpoints: ['/health', '/status', '/api/health', '/v1/health', '/'] }
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

  // Get current market data for a specific cryptocurrency
  getMarketData: async (symbol: string): Promise<MarketData> => {
    if (USE_MOCKS) {
      // Use mock data for development
      const mockData = mockMarketData[symbol as keyof typeof mockMarketData];
      if (!mockData) {
        throw new Error(`No mock data available for ${symbol}. Available symbols: ${Object.keys(mockMarketData).join(', ')}`);
      }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockData;
    }
    
    try {
      // Try different possible API routes
      const possibleRoutes = [
        `/market/${symbol}`,
        `/market/data/${symbol}`,
        `/api/market/${symbol}`,
        `/v1/market/${symbol}`,
        `/market/data?symbol=${symbol}`
      ];

      for (const route of possibleRoutes) {
        try {
          const response = await reiApiClient.get(route);
          return response.data;
        } catch (error: any) {
          if (error.response?.status === 404) {
            continue; // Try next route
          }
          throw error; // Other errors should be thrown
        }
      }
      
      throw new Error('No valid market data endpoint found');
    } catch (error) {
      console.warn('API call failed, falling back to mock data');
      USE_MOCKS = true;
      return reiService.getMarketData(symbol);
    }
  },
  
  // Get trading signals for a specific asset
  getTradingSignal: async (asset: string): Promise<TradingSignal> => {
    if (USE_MOCKS) {
      // Use mock data for development
      const mockSignal = mockTradingSignal[asset as keyof typeof mockTradingSignal];
      if (!mockSignal) {
        // Generate a basic signal for unknown assets
        try {
          const marketData = await reiService.getMarketData(asset);
          return {
            asset,
            currentPrice: marketData.price,
            view: 'Neutral',
            viewReason: 'Insufficient data for directional bias',
            entryZone: {
              min: marketData.price * 0.98,
              max: marketData.price * 1.02,
              reasoning: 'Current price zone with 2% buffer'
            },
            targets: [
              marketData.price * 1.05,
              marketData.price * 1.10,
              marketData.price * 1.15
            ],
            stopLoss: {
              price: marketData.price * 0.95,
              reasoning: '5% stop loss below current price'
            },
            invalidation: 'Market structure change or major news event',
            analysis: {
              summary: 'Limited data available for comprehensive analysis',
              details: 'Basic technical analysis based on current price action'
            },
            insights: {
              driver: 'General market sentiment and technical factors',
              chartBehavior: 'Price action analysis pending more data',
              supportingSignals: ['Current price stability'],
              contradictingSignals: ['Limited historical data'],
              sentiment: 'neutral',
              wildcard: 'Monitor for volume and momentum changes'
            }
          };
        } catch {
          throw new Error(`No signal data available for ${asset}. Available assets: ${Object.keys(mockTradingSignal).join(', ')}`);
        }
      }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return mockSignal;
    }
    
    try {
      // Try different possible API routes
      const possibleRoutes = [
        `/signal/${asset}`,
        `/trading/signal/${asset}`,
        `/api/signal/${asset}`,
        `/v1/signal/${asset}`,
        `/trading/signal?asset=${asset}`
      ];

      for (const route of possibleRoutes) {
        try {
          const response = await reiApiClient.get(route);
          return response.data;
        } catch (error: any) {
          if (error.response?.status === 404) {
            continue; // Try next route
          }
          throw error; // Other errors should be thrown
        }
      }
      
      throw new Error('No valid trading signal endpoint found');
    } catch (error) {
      console.warn('API call failed, falling back to mock data');
      USE_MOCKS = true;
      return reiService.getTradingSignal(asset);
    }
  },
  
  // Get historical price data
  getHistoricalData: async (
    symbol: string, 
    timeframe: string, 
    limit: number
  ): Promise<HistoricalData> => {
    if (USE_MOCKS) {
      // Generate mock historical data
      const currentPrice = mockMarketData[symbol as keyof typeof mockMarketData]?.price || 100;
      const data = [];
      
      for (let i = limit; i > 0; i--) {
        const timestamp = Date.now() - (i * 3600000); // 1 hour intervals
        const variation = (Math.random() - 0.5) * 0.1; // 10% max variation
        const price = currentPrice * (1 + variation);
        
        data.push({
          timestamp,
          open: price * 0.999,
          high: price * 1.002,
          low: price * 0.998,
          close: price,
          volume: Math.random() * 1000000
        });
      }
      
      await new Promise(resolve => setTimeout(resolve, 600));
      
      return {
        symbol,
        timeframe,
        data
      };
    }
    
    try {
      const possibleRoutes = [
        `/historical/${symbol}`,
        `/market/historical/${symbol}`,
        `/api/historical/${symbol}`,
        `/v1/historical/${symbol}`
      ];

      for (const route of possibleRoutes) {
        try {
          const response = await reiApiClient.get(route, {
            params: { timeframe, limit }
          });
          return response.data;
        } catch (error: any) {
          if (error.response?.status === 404) {
            continue; // Try next route
          }
          throw error; // Other errors should be thrown
        }
      }
      
      throw new Error('No valid historical data endpoint found');
    } catch (error) {
      console.warn('API call failed, falling back to mock data');
      USE_MOCKS = true;
      return reiService.getHistoricalData(symbol, timeframe, limit);
    }
  },
  
  // Get on-chain metrics
  getOnChainMetrics: async (
    blockchain: string, 
    metric: string
  ): Promise<OnChainMetrics> => {
    if (USE_MOCKS) {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      return {
        blockchain,
        metric,
        value: Math.random() * 1000000,
        change24h: (Math.random() - 0.5) * 20,
        timestamp: Date.now()
      };
    }
    
    try {
      const possibleRoutes = [
        `/onchain/${blockchain}/${metric}`,
        `/api/onchain/${blockchain}/${metric}`,
        `/v1/onchain/${blockchain}/${metric}`
      ];

      for (const route of possibleRoutes) {
        try {
          const response = await reiApiClient.get(route);
          return response.data;
        } catch (error: any) {
          if (error.response?.status === 404) {
            continue; // Try next route
          }
          throw error; // Other errors should be thrown
        }
      }
      
      throw new Error('No valid on-chain metrics endpoint found');
    } catch (error) {
      console.warn('API call failed, falling back to mock data');
      USE_MOCKS = true;
      return reiService.getOnChainMetrics(blockchain, metric);
    }
  },

  // Get current mock status
  isUsingMocks: () => USE_MOCKS,

  // Force enable/disable mocks
  setMockMode: (useMocks: boolean) => {
    USE_MOCKS = useMocks;
  }
};

export { enableDebugMode };
export default reiService;