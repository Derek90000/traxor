import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Copy, 
  Expand, 
  Bookmark, 
  Brain, 
  Radio, 
  FileText, 
  History, 
  Settings,
  ArrowLeft,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  Star,
  Plus,
  Trash2,
  Download,
  Filter,
  Search,
  Bell,
  Zap,
  Target,
  BarChart3,
  Activity,
  DollarSign,
  Percent,
  Calendar,
  User,
  Shield,
  Database,
  Wifi,
  Volume2,
  VolumeX,
  Terminal as TerminalIcon,
  Menu,
  X,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import reiService, { enableDebugMode } from '../services/reiService';
import type { MarketData, TradingSignal } from '../services/reiService';

interface ResponseCard {
  id: string;
  query: string;
  headline: string;
  bullets: string[];
  sentiment?: string;
  sources?: string[];
  timestamp: Date;
  bookmarked?: boolean;
  rawContent?: string;
  asset?: string;
  view?: string;
  entryZone?: string;
  takeProfits?: string;
  stopLoss?: string;
  invalidateIf?: string;
  insights?: string[];
  sourcesWithLinks?: Array<{name: string, url: string}>;
}

interface WatchlistItem {
  id: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  lastUpdate: Date;
}

interface TradeLog {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  timestamp: Date;
  pnl?: number;
  status: 'FILLED' | 'PENDING' | 'CANCELLED';
}

interface TerminalProps {
  onBack: () => void;
}

const Terminal: React.FC<TerminalProps> = ({ onBack }) => {
  const [query, setQuery] = useState('');
  const [responses, setResponses] = useState<ResponseCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('ask');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState<'unknown' | 'connected' | 'disconnected' | 'testing'>('unknown');
  const [apiMessage, setApiMessage] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock data with updated market data
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([
    { id: '1', symbol: 'BTC', price: 107607, change: -1912, changePercent: -1.75, volume: '3.32B', lastUpdate: new Date() },
    { id: '2', symbol: 'ETH', price: 2740.4, change: -53.8, changePercent: -1.92, volume: '3.14B', lastUpdate: new Date() },
    { id: '3', symbol: 'SOL', price: 158.63, change: -8.16, changePercent: -4.90, volume: '781M', lastUpdate: new Date() },
    { id: '4', symbol: 'HYPE', price: 41.480, change: -1.151, changePercent: -2.70, volume: '746M', lastUpdate: new Date() },
    { id: '5', symbol: 'MOODENG', price: 0.18271, change: -0.02372, changePercent: -11.49, volume: '9.6M', lastUpdate: new Date() },
    { id: '6', symbol: 'PNUT', price: 0.25982, change: -0.02708, changePercent: -9.44, volume: '2.6M', lastUpdate: new Date() },
  ]);

  const [tradeLogs, setTradeLogs] = useState<TradeLog[]>([
    { id: '1', symbol: 'BTC', type: 'BUY', quantity: 0.5, price: 42000, timestamp: new Date(Date.now() - 3600000), pnl: 625, status: 'FILLED' },
    { id: '2', symbol: 'ETH', type: 'SELL', quantity: 2, price: 2720, timestamp: new Date(Date.now() - 7200000), pnl: -90, status: 'FILLED' },
    { id: '3', symbol: 'NVDA', type: 'BUY', quantity: 10, price: 862.5, timestamp: new Date(Date.now() - 10800000), status: 'PENDING' },
  ]);

  const placeholders = [
    "What's the BTC setup looking like?",
    "Give me an ETH trading signal",
    "Analyze SOL price action today",
    "What's the best entry for HYPE?",
    "Show me MOODENG trading opportunities",
    "Assess PNUT momentum right now",
    "What's driving crypto market movement?",
    "Give me a FARTCOIN trading signal"
  ];

  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Initialize REI API on component mount
  useEffect(() => {
    const initializeApi = async () => {
      setApiStatus('testing');
      try {
        const result = await reiService.initialize();
        setApiStatus(result.success ? 'connected' : 'disconnected');
        setApiMessage(result.message);
        
        // Add initialization message to responses
        const initMessage: ResponseCard = {
          id: 'init-' + Date.now(),
          query: 'System initialization',
          headline: result.success ? '🟢 REI API Connected' : '🟡 Using Mock Data',
          bullets: [
            result.message,
            result.usingMocks ? 'All trading signals will use simulated data' : 'Live market data available',
            'Type "help" for available commands'
          ],
          sentiment: result.success ? 'Connected' : 'Mock Mode',
          timestamp: new Date(),
          sources: result.success ? ['REI Network API'] : ['Mock Data Engine']
        };
        
        setResponses([initMessage]);
      } catch (error) {
        setApiStatus('disconnected');
        setApiMessage('Failed to initialize API connection');
      }
    };

    initializeApi();
  }, []);

  // Format large numbers for display
  const formatNumber = (num: number): string => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toString();
  };

  // Format trading signal according to custom prompt format
  const formatTradingSignal = (signal: TradingSignal, asset: string): ResponseCard => {
    const currentDate = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    const bullets = [
      `💡 View: ${signal.view} → ${signal.viewReason}`,
      `🎯 Entry Zone: $${signal.entryZone.min} to $${signal.entryZone.max}`,
      `💰 Take Profits: TP1 $${signal.targets[0]} → TP2 $${signal.targets[1]}${signal.targets[2] ? ` → TP3 $${signal.targets[2]}` : ''}`,
      `🛑 Stop Loss: $${signal.stopLoss.price} (${signal.stopLoss.reasoning})`,
      `🚨 Invalidate if: ${signal.invalidation}`,
      '',
      '🔍 Insights:',
      `• What's driving this move? ${signal.insights.driver}`,
      `• Recent chart behavior: ${signal.insights.chartBehavior}`,
      `• Supporting signals: ${signal.insights.supportingSignals.join(', ')}`,
      signal.insights.contradictingSignals.length > 0 ? `• Contradicting signals: ${signal.insights.contradictingSignals.join(', ')}` : '',
      signal.insights.wildcard ? `• Wildcard: ${signal.insights.wildcard}` : ''
    ].filter(Boolean);

    return {
      id: Date.now().toString(),
      query: `Trading signal for ${asset}`,
      headline: `🧠 ${asset.toUpperCase()} Signal — ${currentDate}`,
      bullets,
      sentiment: signal.view,
      sources: reiService.isUsingMocks() ? ['Mock Data Engine'] : ['REI Network API', 'Market Data Feeds'],
      timestamp: new Date(),
      asset: asset.toUpperCase(),
      view: signal.view,
      entryZone: `$${signal.entryZone.min} - $${signal.entryZone.max}`,
      takeProfits: `TP1: $${signal.targets[0]}, TP2: $${signal.targets[1]}${signal.targets[2] ? `, TP3: $${signal.targets[2]}` : ''}`,
      stopLoss: `$${signal.stopLoss.price}`,
      invalidateIf: signal.invalidation,
      sourcesWithLinks: reiService.isUsingMocks() ? 
        [{ name: 'Mock Data Engine', url: '#' }] : 
        [{ name: 'REI Network API', url: 'https://api.reisearch.box' }]
    };
  };

  // Format market data for display
  const formatMarketData = (data: MarketData, asset: string): ResponseCard => {
    const bullets = [
      `💰 Current Price: $${data.price.toLocaleString()}`,
      `📈 24h Change: ${data.priceChange24h >= 0 ? '+' : ''}${data.priceChange24h}% (${data.priceChangeDirection})`,
      `💵 24h Volume: $${formatNumber(data.volume24h)}`,
      `📊 Market Cap: $${formatNumber(data.marketCap)}`,
      '',
      '⚡ Technical Indicators:',
      `• RSI (14): ${data.technicals.rsi}`,
      `• MACD: ${data.technicals.macd}`,
      `• Volume Profile: ${data.technicals.volumeProfile}`
    ];

    return {
      id: Date.now().toString(),
      query: `Market data for ${asset}`,
      headline: `📊 ${asset.toUpperCase()} Market Data`,
      bullets,
      sentiment: data.priceChange24h >= 0 ? 'Bullish' : 'Bearish',
      sources: reiService.isUsingMocks() ? ['Mock Data Engine'] : ['REI Network API'],
      timestamp: new Date(),
      asset: asset.toUpperCase(),
      sourcesWithLinks: reiService.isUsingMocks() ? 
        [{ name: 'Mock Data Engine', url: '#' }] : 
        [{ name: 'REI Network API', url: 'https://api.reisearch.box' }]
    };
  };

  // Handle REI API commands
  const handleReiCommand = async (args: string[]): Promise<ResponseCard | null> => {
    const subCommand = args[0]?.toLowerCase();
    const symbol = args[1]?.toUpperCase() || 'SOL';
    
    switch (subCommand) {
      case 'test':
        const testResult = await reiService.testConnection();
        return {
          id: Date.now().toString(),
          query: 'REI API connection test',
          headline: testResult.success ? '✅ REI API Connection Test' : '❌ REI API Connection Failed',
          bullets: [
            testResult.message,
            testResult.details ? `Details: ${JSON.stringify(testResult.details, null, 2)}` : '',
            testResult.success ? 'API is ready for live data' : 'Falling back to mock data mode'
          ].filter(Boolean),
          sentiment: testResult.success ? 'Connected' : 'Disconnected',
          sources: ['REI Network API Test'],
          timestamp: new Date()
        };

      case 'debug':
        enableDebugMode();
        return {
          id: Date.now().toString(),
          query: 'Enable debug mode',
          headline: '🔧 Debug Mode Enabled',
          bullets: [
            'REI API debug mode is now active',
            'Check browser console for detailed API logs',
            'All API requests and responses will be logged',
            'Use "rei test" to verify connection with debug info'
          ],
          sentiment: 'Debug',
          sources: ['System'],
          timestamp: new Date()
        };

      case 'signal':
        try {
          const signalData = await reiService.getTradingSignal(symbol);
          return formatTradingSignal(signalData, symbol);
        } catch (error: any) {
          return {
            id: Date.now().toString(),
            query: `Trading signal for ${symbol}`,
            headline: `❌ Error: ${symbol} Signal Failed`,
            bullets: [
              `Failed to fetch trading signal: ${error.message}`,
              reiService.isUsingMocks() ? 'Using mock data mode' : 'Check API connection',
              'Try: rei test - to check API status',
              'Try: rei debug - to enable detailed logging'
            ],
            sentiment: 'Error',
            sources: ['Error Handler'],
            timestamp: new Date()
          };
        }
        
      case 'market':
        try {
          const marketData = await reiService.getMarketData(symbol);
          return formatMarketData(marketData, symbol);
        } catch (error: any) {
          return {
            id: Date.now().toString(),
            query: `Market data for ${symbol}`,
            headline: `❌ Error: ${symbol} Market Data Failed`,
            bullets: [
              `Failed to fetch market data: ${error.message}`,
              reiService.isUsingMocks() ? 'Using mock data mode' : 'Check API connection',
              'Try: rei test - to check API status',
              'Available symbols: BTC, ETH, SOL, HYPE, MOODENG, PNUT, FARTCOIN'
            ],
            sentiment: 'Error',
            sources: ['Error Handler'],
            timestamp: new Date()
          };
        }

      case 'status':
        return {
          id: Date.now().toString(),
          query: 'REI API status',
          headline: '📊 REI API Status',
          bullets: [
            `Connection Status: ${apiStatus}`,
            `Mode: ${reiService.isUsingMocks() ? 'Mock Data' : 'Live API'}`,
            `Message: ${apiMessage}`,
            `Base URL: https://api.reisearch.box`,
            `Available Commands: test, debug, signal, market, status`
          ],
          sentiment: apiStatus === 'connected' ? 'Connected' : 'Disconnected',
          sources: ['System Status'],
          timestamp: new Date()
        };

      default:
        return {
          id: Date.now().toString(),
          query: `Unknown REI command: ${subCommand}`,
          headline: '❓ Unknown REI Command',
          bullets: [
            `Unknown REI command: ${subCommand}`,
            'Available commands:',
            '• rei test - Test API connection',
            '• rei debug - Enable debug logging',
            '• rei signal <SYMBOL> - Get trading signal',
            '• rei market <SYMBOL> - Get market data',
            '• rei status - Show API status',
            '',
            'Examples:',
            '• rei signal SOL',
            '• rei market BTC'
          ],
          sentiment: 'Help',
          sources: ['Help System'],
          timestamp: new Date()
        };
    }
  };

  // Updated API call function using REI service
  const callReiAPI = async (userQuery: string): Promise<ResponseCard> => {
    try {
      // Parse the query to determine what the user wants
      const queryLower = userQuery.toLowerCase();
      
      // Extract asset symbol from query
      const cryptoSymbols = ['btc', 'eth', 'sol', 'hype', 'moodeng', 'pnut', 'fartcoin'];
      let asset = 'SOL'; // default
      
      for (const symbol of cryptoSymbols) {
        if (queryLower.includes(symbol)) {
          asset = symbol.toUpperCase();
          break;
        }
      }

      // Determine if user wants market data or trading signal
      if (queryLower.includes('market') || queryLower.includes('price') || queryLower.includes('data')) {
        const marketData = await reiService.getMarketData(asset);
        return formatMarketData(marketData, asset);
      } else {
        // Default to trading signal
        const signalData = await reiService.getTradingSignal(asset);
        return formatTradingSignal(signalData, asset);
      }

    } catch (error: any) {
      console.error('REI API call failed:', error);
      
      // Return error response
      return {
        id: Date.now().toString(),
        query: userQuery,
        headline: '❌ API Error',
        bullets: [
          `Failed to process query: ${error.message}`,
          reiService.isUsingMocks() ? 'Currently using mock data' : 'Check API connection',
          'Try using specific commands like:',
          '• rei signal SOL',
          '• rei market BTC',
          '• rei test (to check connection)'
        ],
        sentiment: 'Error',
        sources: ['Error Handler'],
        timestamp: new Date()
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setSidebarOpen(false); // Close sidebar on mobile when submitting
    
    try {
      let newResponse: ResponseCard;

      // Check if it's a REI command
      if (query.trim().toLowerCase().startsWith('rei ')) {
        const args = query.trim().split(' ').slice(1); // Remove 'rei' prefix
        const reiResponse = await handleReiCommand(args);
        if (reiResponse) {
          newResponse = reiResponse;
        } else {
          throw new Error('Unknown REI command');
        }
      } else if (query.trim().toLowerCase() === 'help') {
        // Handle help command
        newResponse = {
          id: Date.now().toString(),
          query: 'help',
          headline: '📚 Traxor Terminal Help',
          bullets: [
            '🧠 Natural Language Queries:',
            '• "What\'s the BTC setup looking like?"',
            '• "Give me an ETH trading signal"',
            '• "Analyze SOL price action today"',
            '',
            '🔧 REI Network Commands:',
            '• rei signal <SYMBOL> - Get trading signal',
            '• rei market <SYMBOL> - Get market data', 
            '• rei test - Test API connection',
            '• rei debug - Enable debug logging',
            '• rei status - Show API status',
            '',
            '📊 Available Symbols:',
            '• BTC, ETH, SOL, HYPE, MOODENG, PNUT, FARTCOIN',
            '',
            '💡 Examples:',
            '• rei signal SOL',
            '• rei market BTC',
            '• What\'s driving HYPE today?'
          ],
          sentiment: 'Help',
          sources: ['Help System'],
          timestamp: new Date()
        };
      } else if (query.trim().toLowerCase() === 'clear') {
        // Clear terminal
        setResponses([]);
        setQuery('');
        setIsLoading(false);
        return;
      } else {
        // Handle natural language queries
        newResponse = await callReiAPI(query);
      }
      
      setResponses(prev => [newResponse, ...prev]);
      setQuery('');
      
      // Play sound effect
      if (soundEnabled) {
        console.log('🔊 Signal processed');
      }
    } catch (error) {
      console.error('Failed to get response:', error);
      
      // Add error response
      const errorResponse: ResponseCard = {
        id: Date.now().toString(),
        query: query,
        headline: '❌ Processing Error',
        bullets: [
          'Failed to process your request',
          'Please try again or use a specific command',
          'Type "help" for available commands',
          'Type "rei test" to check API connection'
        ],
        sentiment: 'Error',
        sources: ['Error Handler'],
        timestamp: new Date()
      };
      
      setResponses(prev => [errorResponse, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBookmark = (id: string) => {
    setResponses(prev => prev.map(response => 
      response.id === id ? { ...response, bookmarked: !response.bookmarked } : response
    ));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    console.log('📋 Signal copied to clipboard');
  };

  const navItems = [
    { id: 'ask', icon: Brain, label: 'Signal Engine', badge: responses.length },
    { id: 'watchlist', icon: Radio, label: 'Watchlist', badge: watchlist.length },
    { id: 'logs', icon: FileText, label: 'Trade Logs', badge: tradeLogs.filter(t => t.status === 'PENDING').length },
    { id: 'history', icon: History, label: 'Signal Archive', badge: responses.filter(r => r.bookmarked).length },
    { id: 'settings', icon: Settings, label: 'System Config' }
  ];

  // Updated ticker with current market data
  const tickerData = [
    { symbol: 'BTC', price: 107607, change: -1.75 },
    { symbol: 'ETH', price: 2740.4, change: -1.92 },
    { symbol: 'SOL', price: 158.63, change: -4.90 },
    { symbol: 'HYPE', price: 41.480, change: -2.70 },
    { symbol: 'MOODENG', price: 0.18271, change: -11.49 },
    { symbol: 'PNUT', price: 0.25982, change: -9.44 },
    { symbol: 'FARTCOIN', price: 1.3412, change: -1.38 },
    { symbol: 'VINE', price: 0.035243, change: -6.32 }
  ];

  const getApiStatusIcon = () => {
    switch (apiStatus) {
      case 'connected':
        return <CheckCircle className="w-3 h-3 text-green-400" />;
      case 'disconnected':
        return <XCircle className="w-3 h-3 text-red-400" />;
      case 'testing':
        return <Activity className="w-3 h-3 text-yellow-400 animate-pulse" />;
      default:
        return <AlertTriangle className="w-3 h-3 text-gray-400" />;
    }
  };

  const getApiStatusColor = () => {
    switch (apiStatus) {
      case 'connected':
        return 'text-green-400';
      case 'disconnected':
        return 'text-red-400';
      case 'testing':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'ask':
        return (
          <div className="space-y-4 sm:space-y-6">
            {isLoading && (
              <div className="bg-[#1D1E22]/80 border border-[#FF7744]/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 animate-pulse backdrop-blur-md shadow-2xl">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-3 h-3 bg-[#FF7744] rounded-full animate-ping" />
                  <span className="text-[#FF7744] font-mono text-xs sm:text-sm font-medium">
                    {reiService.isUsingMocks() ? 'Mock Engine processing...' : 'REI API processing...'}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="h-3 sm:h-4 bg-[#2A2B32]/50 rounded w-3/4 animate-pulse" />
                  <div className="h-3 sm:h-4 bg-[#2A2B32]/50 rounded w-1/2 animate-pulse" />
                  <div className="h-3 sm:h-4 bg-[#2A2B32]/50 rounded w-2/3 animate-pulse" />
                </div>
              </div>
            )}

            {responses.map((response) => (
              <div key={response.id} className="bg-[#1D1E22]/80 border border-[#2A2B32] rounded-2xl sm:rounded-3xl p-4 sm:p-6 hover:border-[#FF7744]/30 transition-all duration-300 group backdrop-blur-md shadow-2xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-400 mb-3 font-mono bg-[#2B2417]/60 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl inline-block border border-[#EBC26E]/20 break-all">
                      <span className="text-[#FF7744] font-bold">{'>'}</span> {response.query}
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-[#FF7744] mb-3 leading-tight font-mono">
                      {response.headline}
                    </h3>
                    {response.asset && (
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="inline-block bg-[#33211D]/60 text-[#FF7744] px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium border border-[#FF7744]/20">
                          📈 {response.asset}
                        </span>
                        {response.sentiment && (
                          <span className="inline-block bg-[#33211D]/60 text-[#EBC26E] px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium border border-[#EBC26E]/20">
                            {response.sentiment}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity ml-2 sm:ml-4 flex-shrink-0">
                    <button 
                      onClick={() => copyToClipboard(response.headline + '\n' + response.bullets.join('\n'))}
                      className="p-2 sm:p-2.5 hover:bg-[#2A2B32]/60 rounded-xl transition-colors border border-transparent hover:border-[#FF7744]/20"
                      title="Copy signal"
                    >
                      <Copy className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 hover:text-[#FF7744]" />
                    </button>
                    <button className="p-2 sm:p-2.5 hover:bg-[#2A2B32]/60 rounded-xl transition-colors border border-transparent hover:border-[#FF7744]/20" title="Expand analysis">
                      <Expand className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 hover:text-[#FF7744]" />
                    </button>
                    <button 
                      onClick={() => toggleBookmark(response.id)}
                      className="p-2 sm:p-2.5 hover:bg-[#2A2B32]/60 rounded-xl transition-colors border border-transparent hover:border-[#FF7744]/20"
                      title="Archive signal"
                    >
                      <Bookmark className={`w-3 h-3 sm:w-4 sm:h-4 transition-colors ${response.bookmarked ? 'text-[#FF7744] fill-current' : 'text-gray-400 hover:text-[#FF7744]'}`} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 font-mono">
                  {response.bullets.map((bullet, index) => (
                    <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                      <span className="text-[#FF7744] mt-1 sm:mt-1.5 text-sm font-bold flex-shrink-0">•</span>
                      <span className="text-gray-200 leading-relaxed text-sm sm:text-base">{bullet}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-[#2A2B32] space-y-3 sm:space-y-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                    {response.sourcesWithLinks && response.sourcesWithLinks.length > 0 && (
                      <>
                        <span className="text-xs text-gray-400 font-medium mb-2 sm:mb-0">Sources:</span>
                        <div className="flex flex-wrap gap-2">
                          {response.sourcesWithLinks.map((source, index) => (
                            <a 
                              key={index} 
                              href={source.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className={`text-xs px-2 sm:px-2.5 py-1 rounded-xl hover:bg-[#2B2417]/80 cursor-pointer transition-colors border flex items-center space-x-1 ${
                                source.name === 'REI Network API' 
                                  ? 'bg-[#33211D]/80 text-[#FF7744] border-[#FF7744]/30 hover:border-[#FF7744]/50' 
                                  : 'bg-[#2B2417]/60 text-[#EBC26E] border-[#EBC26E]/20 hover:border-[#EBC26E]/40'
                              }`}
                            >
                              <span>{source.name}</span>
                              {source.url !== '#' && <ExternalLink className="w-3 h-3" />}
                            </a>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{response.timestamp.toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ))}

            {responses.length === 0 && !isLoading && (
              <div className="text-center py-12 sm:py-20">
                <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-[#FF7744] to-[#EBC26E] rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-2xl">
                  <Brain className="w-8 sm:w-10 h-8 sm:h-10 text-[#121212]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2 sm:mb-3">
                  Traxor Signal Engine Active
                </h3>
                <p className="text-gray-400 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base px-4">
                  Ask about any crypto asset for live trading signals with real-time data synthesis.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto px-4">
                  {['BTC setup', 'ETH momentum', 'SOL breakout', 'HYPE signals'].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setQuery(`What's the ${suggestion} looking like right now?`)}
                      className="bg-[#1D1E22]/60 hover:bg-[#2A2B32]/60 px-3 sm:px-4 py-2 sm:py-3 rounded-2xl transition-colors text-gray-300 hover:text-[#FF7744] border border-[#2A2B32] hover:border-[#FF7744]/20 text-sm font-medium backdrop-blur-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'watchlist':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#FF7744]">Signal Watchlist</h2>
              <div className="flex space-x-2">
                <button className="p-2 sm:p-2.5 bg-[#1D1E22]/60 hover:bg-[#2A2B32]/60 rounded-xl transition-colors border border-[#2A2B32] backdrop-blur-sm">
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                </button>
                <button className="p-2 sm:p-2.5 bg-[#1D1E22]/60 hover:bg-[#2A2B32]/60 rounded-xl transition-colors border border-[#2A2B32] backdrop-blur-sm">
                  <Filter className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="grid gap-3 sm:gap-4">
              {watchlist.map((item) => (
                <div key={item.id} className="bg-[#1D1E22]/80 border border-[#2A2B32] rounded-2xl sm:rounded-3xl p-4 sm:p-5 hover:border-[#FF7744]/30 transition-colors backdrop-blur-md shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-[#FF7744] to-[#EBC26E] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="font-bold text-[#121212] text-xs sm:text-sm">{item.symbol}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-base sm:text-lg">{item.symbol}</h3>
                        <p className="text-xs sm:text-sm text-gray-400">Vol: {item.volume}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg sm:text-xl font-semibold text-white">${item.price.toLocaleString()}</div>
                      <div className={`flex items-center space-x-1 text-xs sm:text-sm font-medium ${item.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {item.change >= 0 ? <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" /> : <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />}
                        <span>{item.change >= 0 ? '+' : ''}{item.change}</span>
                        <span>({item.changePercent >= 0 ? '+' : ''}{item.changePercent}%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'logs':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#FF7744]">Execution Log</h2>
              <div className="flex space-x-2">
                <button className="p-2 sm:p-2.5 bg-[#1D1E22]/60 hover:bg-[#2A2B32]/60 rounded-xl transition-colors border border-[#2A2B32] backdrop-blur-sm">
                  <Download className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                </button>
                <button className="p-2 sm:p-2.5 bg-[#1D1E22]/60 hover:bg-[#2A2B32]/60 rounded-xl transition-colors border border-[#2A2B32] backdrop-blur-sm">
                  <Filter className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              {tradeLogs.map((trade) => (
                <div key={trade.id} className="bg-[#1D1E22]/80 border border-[#2A2B32] rounded-2xl sm:rounded-3xl p-4 sm:p-5 hover:border-[#FF7744]/30 transition-colors backdrop-blur-md shadow-2xl">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl text-xs font-semibold ${
                        trade.type === 'BUY' ? 'bg-green-900/40 text-green-400 border border-green-700/30' : 'bg-red-900/40 text-red-400 border border-red-700/30'
                      }`}>
                        {trade.type}
                      </div>
                      <div>
                        <span className="font-semibold text-white text-base sm:text-lg">{trade.symbol}</span>
                        <span className="text-gray-400 ml-2 sm:ml-3 text-sm">{trade.quantity} @ ${trade.price}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:block sm:text-right">
                      <div className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl text-xs font-medium mb-0 sm:mb-2 ${
                        trade.status === 'FILLED' ? 'bg-green-900/40 text-green-400 border border-green-700/30' :
                        trade.status === 'PENDING' ? 'bg-[#2B2417]/60 text-[#EBC26E] border border-[#EBC26E]/30' :
                        'bg-red-900/40 text-red-400 border border-red-700/30'
                      }`}>
                        {trade.status}
                      </div>
                      {trade.pnl !== undefined && (
                        <div className={`text-sm font-semibold ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {trade.pnl >= 0 ? '+' : ''}${trade.pnl}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#FF7744]">Signal Archive</h2>
              <button className="p-2 sm:p-2.5 bg-[#1D1E22]/60 hover:bg-[#2A2B32]/60 rounded-xl transition-colors border border-[#2A2B32] backdrop-blur-sm">
                <Search className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              {responses.filter(r => r.bookmarked).map((response) => (
                <div key={response.id} className="bg-[#1D1E22]/80 border border-[#2A2B32] rounded-2xl sm:rounded-3xl p-4 sm:p-5 hover:border-[#FF7744]/30 transition-colors backdrop-blur-md shadow-2xl">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#FF7744] mb-2 text-base sm:text-lg font-mono">{response.headline}</h3>
                      <p className="text-xs sm:text-sm text-gray-400 mb-3 bg-[#2B2417]/60 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl inline-block border border-[#EBC26E]/20 break-all">
                        <span className="text-[#FF7744] font-bold">{'>'}</span> {response.query}
                      </p>
                      <div className="text-xs text-gray-500">
                        {response.timestamp.toLocaleDateString()} at {response.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF7744] fill-current ml-2 sm:ml-4 flex-shrink-0" />
                  </div>
                </div>
              ))}
              
              {responses.filter(r => r.bookmarked).length === 0 && (
                <div className="text-center py-12 sm:py-16">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-[#1D1E22]/60 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-[#2A2B32]">
                    <Star className="w-6 sm:w-8 h-6 sm:h-8 text-gray-600" />
                  </div>
                  <p className="text-gray-400 text-sm sm:text-base">No archived signals yet</p>
                  <p className="text-gray-500 text-xs sm:text-sm mt-2">Archive important signals for future reference</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-[#FF7744]">System Configuration</h2>
            
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-[#1D1E22]/80 border border-[#2A2B32] rounded-2xl sm:rounded-3xl p-4 sm:p-6 backdrop-blur-md shadow-2xl">
                <h3 className="font-semibold mb-4 flex items-center space-x-2 text-base sm:text-lg">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF7744]" />
                  <span className="text-white">Terminal Status</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400 text-sm sm:text-base">Traxor Version:</span>
                    <span className="text-white font-medium text-sm sm:text-base">Signal Engine v3.2.1</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400 text-sm sm:text-base">REI API Status:</span>
                    <div className="flex items-center space-x-2">
                      {getApiStatusIcon()}
                      <span className={`font-medium text-sm sm:text-base ${getApiStatusColor()}`}>
                        {apiStatus === 'connected' ? 'Connected' : 
                         apiStatus === 'disconnected' ? 'Disconnected' :
                         apiStatus === 'testing' ? 'Testing...' : 'Unknown'}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400 text-sm sm:text-base">Data Mode:</span>
                    <span className={`font-medium text-sm sm:text-base ${reiService.isUsingMocks() ? 'text-yellow-400' : 'text-green-400'}`}>
                      {reiService.isUsingMocks() ? 'Mock Data' : 'Live API'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400 text-sm sm:text-base">Signals Processed:</span>
                    <span className="text-white font-medium text-sm sm:text-base">{responses.length}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#1D1E22]/80 border border-[#2A2B32] rounded-2xl sm:rounded-3xl p-4 sm:p-6 backdrop-blur-md shadow-2xl">
                <h3 className="font-semibold mb-4 flex items-center space-x-2 text-base sm:text-lg">
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF7744]" />
                  <span className="text-white">Alert Configuration</span>
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-300 text-sm sm:text-base">Audio Feedback</span>
                    <button 
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className={`p-2 sm:p-2.5 rounded-xl transition-colors ${soundEnabled ? 'text-[#FF7744] bg-[#33211D]/60 border border-[#FF7744]/20' : 'text-gray-400 bg-[#2A2B32]/60 border border-[#2A2B32]'}`}
                    >
                      {soundEnabled ? <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" /> : <VolumeX className="w-3 h-3 sm:w-4 sm:h-4" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-300 text-sm sm:text-base">Signal Notifications</span>
                    <div className="relative">
                      <div className="w-10 h-5 sm:w-11 sm:h-6 bg-gradient-to-r from-[#FF7744] to-[#EBC26E] rounded-full relative cursor-pointer shadow-inner">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm transition-transform"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#1D1E22]/80 border border-[#2A2B32] rounded-2xl sm:rounded-3xl p-4 sm:p-6 backdrop-blur-md shadow-2xl">
                <h3 className="font-semibold mb-4 flex items-center space-x-2 text-base sm:text-lg">
                  <Database className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF7744]" />
                  <span className="text-white">Data Sources</span>
                </h3>
                <div className="space-y-3">
                  {['REI Network API', 'Market Data Feeds', 'Technical Indicators', 'On-Chain Metrics', 'Social Sentiment', 'News Analytics'].map((source, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <span className={`text-sm sm:text-base ${source === 'REI Network API' ? 'text-[#FF7744] font-semibold' : 'text-gray-300'}`}>
                        {source}
                        {source === 'REI Network API' && (
                          <span className="ml-2 text-xs bg-[#33211D]/60 px-2 py-0.5 rounded-full border border-[#FF7744]/20">
                            {apiStatus === 'connected' ? 'Live' : 'Mock'}
                          </span>
                        )}
                      </span>
                      <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full shadow-sm ${
                        source === 'REI Network API' ? 
                          (apiStatus === 'connected' ? 'bg-green-400 animate-pulse' : 'bg-yellow-400') :
                          'bg-green-400 animate-pulse'
                      }`}></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#1D1E22]/80 border border-[#2A2B32] rounded-2xl sm:rounded-3xl p-4 sm:p-6 backdrop-blur-md shadow-2xl">
                <h3 className="font-semibold mb-4 flex items-center space-x-2 text-base sm:text-lg">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF7744]" />
                  <span className="text-white">Data Management</span>
                </h3>
                <div className="space-y-2">
                  <button className="w-full text-left p-3 hover:bg-[#2A2B32]/60 rounded-2xl transition-colors text-gray-300 hover:text-[#FF7744] border border-transparent hover:border-[#FF7744]/20 text-sm sm:text-base">
                    Export Signal Archive
                  </button>
                  <button className="w-full text-left p-3 hover:bg-[#2A2B32]/60 rounded-2xl transition-colors text-gray-300 hover:text-[#FF7744] border border-transparent hover:border-[#FF7744]/20 text-sm sm:text-base">
                    Clear Session Data
                  </button>
                  <button 
                    onClick={async () => {
                      const result = await reiService.testConnection();
                      alert(result.message);
                    }}
                    className="w-full text-left p-3 hover:bg-[#2A2B32]/60 rounded-2xl transition-colors text-gray-300 hover:text-[#FF7744] border border-transparent hover:border-[#FF7744]/20 text-sm sm:text-base"
                  >
                    Test REI API Connection
                  </button>
                  <button className="w-full text-left p-3 hover:bg-red-900/20 rounded-2xl transition-colors text-red-400 hover:text-red-300 border border-transparent hover:border-red-700/30 text-sm sm:text-base">
                    Reset Signal Engine
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white font-['Space_Grotesk'] flex overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <div className={`fixed lg:relative w-80 bg-[#1D1E22]/60 border-r border-[#2A2B32] flex flex-col backdrop-blur-xl flex-shrink-0 z-50 h-full transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#2A2B32]">
          <div className="flex items-center justify-between lg:justify-start mb-4 sm:mb-6">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-400 hover:text-[#FF7744] transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm">Exit Terminal</span>
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 text-gray-400 hover:text-[#FF7744] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#FF7744] to-[#EBC26E] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl">
              <TerminalIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#121212]" />
            </div>
            <div>
              <h1 className="font-bold text-lg sm:text-xl text-white">Traxor Signal Engine</h1>
              <p className="text-xs text-gray-400">Engine v3.2.1</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-3 sm:p-4 overflow-y-auto">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 group ${
                  activeTab === item.id 
                    ? 'bg-[#33211D]/60 text-[#FF7744] shadow-2xl border border-[#FF7744]/20 backdrop-blur-sm' 
                    : 'text-gray-400 hover:text-[#FF7744] hover:bg-[#2A2B32]/40 border border-transparent hover:border-[#FF7744]/20 backdrop-blur-sm'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium text-sm sm:text-base">{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="bg-gradient-to-r from-[#FF7744] to-[#EBC26E] text-[#121212] text-xs px-2 sm:px-2.5 py-1 rounded-full font-semibold min-w-[20px] sm:min-w-[24px] text-center shadow-lg">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Status */}
        <div className="p-3 sm:p-4 border-t border-[#2A2B32]">
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            {getApiStatusIcon()}
            <span>
              {apiStatus === 'connected' ? 'REI API Connected' :
               apiStatus === 'disconnected' ? 'Using Mock Data' :
               apiStatus === 'testing' ? 'Testing Connection...' :
               'Signal Engine Active'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-[#1D1E22]/60 border-b border-[#2A2B32] p-4 backdrop-blur-xl flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-400 hover:text-[#FF7744] transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#FF7744] to-[#EBC26E] rounded-xl flex items-center justify-center">
              <TerminalIcon className="w-4 h-4 text-[#121212]" />
            </div>
            <span className="font-bold text-white">Traxor</span>
          </div>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>

        {/* Top Ticker */}
        <div className="bg-[#1D1E22]/40 border-b border-[#2A2B32] py-2 sm:py-3 overflow-hidden backdrop-blur-sm flex-shrink-0">
          <div className="flex animate-scroll">
            {[...tickerData, ...tickerData].map((ticker, index) => (
              <span key={index} className="text-[#EBC26E] text-xs sm:text-sm font-mono px-4 sm:px-8 whitespace-nowrap">
                {ticker.symbol} ${ticker.price.toLocaleString()} {ticker.change >= 0 ? '+' : ''}{ticker.change}% •
              </span>
            ))}
          </div>
        </div>

        {/* Command Bar - Only show for Signal Engine tab */}
        {activeTab === 'ask' && (
          <div className="p-4 sm:p-6 border-b border-[#2A2B32] bg-[#1D1E22]/20 backdrop-blur-sm flex-shrink-0">
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSubmit}>
                <div className="relative">
                  <div className="flex items-center bg-[#1D1E22]/80 border border-[#2A2B32] rounded-2xl sm:rounded-3xl focus-within:border-[#FF7744]/40 transition-colors shadow-2xl backdrop-blur-md">
                    <span className="text-[#FF7744] font-mono px-4 sm:px-6 text-base sm:text-lg font-bold">{'>'}</span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={placeholders[currentPlaceholder]}
                      className="flex-1 bg-transparent px-2 sm:px-3 py-3 sm:py-4 text-white placeholder-gray-400 focus:outline-none font-mono text-sm sm:text-base"
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !query.trim()}
                      className="p-3 sm:p-4 text-[#FF7744] hover:bg-[#33211D]/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-r-2xl sm:rounded-r-3xl"
                    >
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                  {isLoading && (
                    <div className="absolute right-12 sm:right-16 top-1/2 transform -translate-y-1/2">
                      <div className="w-0.5 h-4 sm:h-5 bg-[#FF7744] animate-pulse" />
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-gradient-to-b from-transparent to-[#121212]/50">
          <div className="max-w-4xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminal;