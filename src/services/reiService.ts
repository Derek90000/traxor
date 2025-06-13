// src/services/reiService.ts
import axios from 'axios';
import { REI_API_KEY, REI_API_BASE_URL } from '../config/env';

// Create axios instance with REI API configuration
const reiApiClient = axios.create({
  baseURL: REI_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${REI_API_KEY}`
  },
  timeout: 10000 // 10 second timeout
});

// Error handling middleware
reiApiClient.interceptors.response.use(
  response => response,
  error => {
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
  }
};

// Test if we can reach the API
const testApiConnection = async (): Promise<boolean> => {
  try {
    // Try a simple request to test connectivity
    await reiApiClient.get('/health', { timeout: 5000 });
    return true;
  } catch (error) {
    console.log('API connection test failed, using mock data');
    return false;
  }
};

// Determine if we should use mock data
let USE_MOCKS = !REI_API_KEY || REI_API_KEY === 'your_rei_api_key_here';

// REI Service with typed methods
export const reiService = {
  // Test API connection and set mock mode accordingly
  initialize: async (): Promise<void> => {
    if (!USE_MOCKS) {
      const isConnected = await testApiConnection();
      USE_MOCKS = !isConnected;
    }
  },

  // Get current market data for a specific cryptocurrency
  getMarketData: async (symbol: string): Promise<MarketData> => {
    if (USE_MOCKS) {
      // Use mock data for development
      const mockData = mockMarketData[symbol as keyof typeof mockMarketData];
      if (!mockData) {
        throw new Error(`No mock data available for ${symbol}`);
      }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockData;
    }
    
    try {
      // Use actual API in production
      const response = await reiApiClient.get('/market/data', {
        params: { symbol }
      });
      return response.data;
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
      }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return mockSignal;
    }
    
    try {
      // Use actual API in production
      const response = await reiApiClient.get('/trading/signal', {
        params: { asset }
      });
      return response.data;
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
      const response = await reiApiClient.get('/market/historical', {
        params: { symbol, timeframe, limit }
      });
      return response.data;
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
      const response = await reiApiClient.get('/onchain/metrics', {
        params: { blockchain, metric }
      });
      return response.data;
    } catch (error) {
      console.warn('API call failed, falling back to mock data');
      USE_MOCKS = true;
      return reiService.getOnChainMetrics(blockchain, metric);
    }
  }
};

export default reiService;