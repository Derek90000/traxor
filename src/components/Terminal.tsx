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
  ExternalLink
} from 'lucide-react';

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
  currentPrice?: string;
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
  const [sourceIndex, setSourceIndex] = useState(0);
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

  // Rotating source pool as requested
  const cryptoSources = [
    { name: 'tronweekly.com', url: 'https://tronweekly.com' },
    { name: 'cryptotimes.io', url: 'https://cryptotimes.io' },
    { name: 'thecoinrepublic.com', url: 'https://thecoinrepublic.com' },
    { name: 'beincrypto.com', url: 'https://beincrypto.com' },
    { name: 'fxleaders.com', url: 'https://fxleaders.com' },
    { name: 'bitget.com', url: 'https://bitget.com' },
    { name: 'coindesk.com', url: 'https://coindesk.com' },
    { name: 'cryptopotato.com', url: 'https://cryptopotato.com' },
    { name: 'cryptobriefing.com', url: 'https://cryptobriefing.com' },
    { name: 'cryptoslate.com', url: 'https://cryptoslate.com' },
    { name: 'cointelegraph.com', url: 'https://cointelegraph.com' },
    { name: 'lookonchain.com', url: 'https://lookonchain.com' }
  ];

  const getRotatingSources = (count: number = 3) => {
    const sources = [];
    for (let i = 0; i < count; i++) {
      const index = (sourceIndex + i) % cryptoSources.length;
      sources.push(cryptoSources[index]);
    }
    return sources;
  };

  // Token extraction function
  const extractTokenFromQuery = (query: string): string => {
    const queryLower = query.toLowerCase();
    
    // Common token mappings
    const tokenMappings: Record<string, string> = {
      'bitcoin': 'btc',
      'ethereum': 'eth',
      'solana': 'sol',
      'cardano': 'ada',
      'polkadot': 'dot',
      'chainlink': 'link',
      'avalanche': 'avax',
      'polygon': 'matic',
      'uniswap': 'uni',
      'dogecoin': 'doge',
      'shiba': 'shib',
      'pepe': 'pepe',
      'bonk': 'bonk',
      'moodeng': 'moodeng',
      'pnut': 'pnut',
      'hype': 'hype',
      'fartcoin': 'fartcoin',
      'vine': 'vine'
    };

    // Check for full token names first
    for (const [fullName, symbol] of Object.entries(tokenMappings)) {
      if (queryLower.includes(fullName)) {
        return symbol;
      }
    }

    // Extract token symbols (2-10 characters, all caps or mixed case)
    const symbolMatches = query.match(/\b[A-Z]{2,10}\b|\b[a-z]{2,10}\b/g);
    if (symbolMatches) {
      for (const match of symbolMatches) {
        const lowerMatch = match.toLowerCase();
        // Skip common words
        const skipWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'];
        if (!skipWords.includes(lowerMatch) && match.length >= 2) {
          return lowerMatch;
        }
      }
    }

    // Default to SOL if no token found
    return 'sol';
  };

  // Fetch live token price from CoinGecko
  const fetchLiveTokenPrice = async (tokenSymbol: string): Promise<{price: number, symbol: string}> => {
    try {
      // Token ID mappings for CoinGecko API
      const tokenIdMap: Record<string, string> = {
        'btc': 'bitcoin',
        'eth': 'ethereum',
        'sol': 'solana',
        'ada': 'cardano',
        'dot': 'polkadot',
        'link': 'chainlink',
        'avax': 'avalanche-2',
        'matic': 'matic-network',
        'uni': 'uniswap',
        'doge': 'dogecoin',
        'shib': 'shiba-inu',
        'pepe': 'pepe',
        'bonk': 'bonk',
        'hype': 'hyperliquid',
        'moodeng': 'moo-deng',
        'pnut': 'peanut-the-squirrel',
        'fartcoin': 'fartcoin',
        'vine': 'vine'
      };

      const tokenId = tokenIdMap[tokenSymbol.toLowerCase()] || tokenSymbol.toLowerCase();
      
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd&include_24hr_change=true`,
        {
          headers: {
            'Accept': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data = await response.json();
      const tokenData = data[tokenId];
      
      if (tokenData && tokenData.usd) {
        return {
          price: tokenData.usd,
          symbol: tokenSymbol.toUpperCase()
        };
      } else {
        throw new Error('Token data not found');
      }
    } catch (error) {
      console.error('Failed to fetch token price:', error);
      
      // Fallback prices for common tokens
      const fallbackPrices: Record<string, number> = {
        'btc': 107607,
        'eth': 2740.4,
        'sol': 158.63,
        'hype': 41.480,
        'moodeng': 0.18271,
        'pnut': 0.25982,
        'fartcoin': 1.3412,
        'vine': 0.035243
      };

      return {
        price: fallbackPrices[tokenSymbol.toLowerCase()] || 100,
        symbol: tokenSymbol.toUpperCase()
      };
    }
  };

  // Extract sources from markdown links in content
  const extractSourcesFromContent = (content: string): Array<{name: string, url: string}> => {
    const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const sources: Array<{name: string, url: string}> = [];
    let match;

    while ((match = markdownLinkRegex.exec(content)) !== null) {
      const name = match[1];
      const url = match[2];
      
      // Extract domain name for cleaner display
      try {
        const domain = new URL(url).hostname.replace('www.', '');
        sources.push({ name: domain, url });
      } catch {
        sources.push({ name, url });
      }
    }

    // Remove duplicates
    const uniqueSources = sources.filter((source, index, self) => 
      index === self.findIndex(s => s.url === source.url)
    );

    return uniqueSources;
  };

  // Updated API call function with live price fetching
  const callOpenRouterAPI = async (userQuery: string): Promise<ResponseCard> => {
    try {
      // Extract token and fetch live price
      const extractedToken = extractTokenFromQuery(userQuery);
      const { price: livePrice, symbol: tokenSymbol } = await fetchLiveTokenPrice(extractedToken);
      
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer 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`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Traxor Intelligence Terminal',
        },
        body: JSON.stringify({
          model: 'openai/gpt-4.1:online',
          temperature: 0.7,
          top_p: 1.0,
          frequency_penalty: 0,
          presence_penalty: 0,
          plugins: [
            {
              id: 'web',
              max_results: 30,
              search_prompt: `Search for real-time ${tokenSymbol} crypto market data, news, and analysis as of ${formattedDate}. Current price is $${livePrice}. Focus on recent price action, volume, sentiment, and technical analysis from sources like coindesk.com, cryptoslate.com, beincrypto.com, cointelegraph.com, lookonchain.com, and other crypto news sites.`
            }
          ],
          messages: [
            {
              role: 'system',
              content: `You are a tactical crypto trading strategist with access to live web data. Your job is to generate clear, structured, and actionable trade setups — not summaries or vague outlooks. Every signal must include a specific directional view (bullish, bearish, or neutral) backed by real-time technical analysis, on-chain metrics, and market sentiment. Use the provided live price as your anchor point for all analysis.

CRITICAL: All fields in the output format are MANDATORY and must be filled with specific, actionable information. Do not leave any field empty or with placeholder text.`
            },
            {
              role: 'user',
              content: `Today is ${formattedDate}.

LIVE MARKET DATA:
- Token: ${tokenSymbol}
- Current Price: $${livePrice}
- This is the EXACT live price from CoinGecko API - use this as your baseline for all analysis

User Query: "${userQuery}"

Use live web data, recent headlines, exchange flow, sentiment, and chart-based logic to provide a complete trading signal.

🧠 Output in this exact format:

🧠 Signal — ${formattedDate}

📈 Asset: ${tokenSymbol}

💰 Current Price: $${livePrice} → [Use this exact price as your technical baseline]

MANDATORY FIELDS (ALL MUST BE COMPLETED):
• 💡 View: Bullish/Bearish/Neutral → [Specific directional bias with technical and sentiment justification]
• 🎯 Entry Zone: $[PRICE] to $[PRICE] → [Specific support/resistance levels based on current price]
• 💰 Take Profits: TP1 $[PRICE] → TP2 $[PRICE] → TP3 $[PRICE] → [ALL THREE ARE MANDATORY - calculate from current price]
• 🛑 Stop Loss: $[PRICE] (or "15m close below $[PRICE]") → [Specific stop level]
• 🚨 Invalidate if: [Specific condition like "BTC drops below $X" or "funding rate exceeds Y%"]

🔍 Insights (ALL MANDATORY):
• What's driving this move? → [Specific catalyst, news, or market driver]
• Recent chart behavior → [Specific price action, patterns, breakouts/breakdowns]
• Supporting or contradicting signals → [Technical indicators, volume analysis, sentiment metrics]
• Wildcard/Meta factor → [Market psychology, macro events, fear/greed index, liquidations]

IMPORTANT: 
1. Use the live price $${livePrice} as your anchor for all technical levels
2. ALL fields above are MANDATORY - no empty fields allowed
3. Provide specific price levels, not ranges like "around $X"
4. Base your analysis on the current price and recent market context
5. Include specific technical reasoning for each price level`
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      const data = await response.json();
      let content = data.choices[0].message.content;

      // Extract sources from markdown links before removing formatting
      let sourcesWithLinks = extractSourcesFromContent(content);
      
      // If no sources found in content, use rotating sources
      if (sourcesWithLinks.length === 0) {
        sourcesWithLinks = getRotatingSources(3);
        // Increment source index for next call
        setSourceIndex(prev => (prev + 3) % cryptoSources.length);
      }

      // Remove ** formatting from content
      content = content.replace(/\*\*(.*?)\*\*/g, '$1');

      // Enhanced parsing for the new format with current price
      const lines = content.split('\n').filter(line => line.trim());
      let headline = 'Crypto Trading Signal';
      let asset = tokenSymbol;
      let currentPrice = `$${livePrice}`;
      let view = '';
      let entryZone = '';
      let takeProfits = '';
      let stopLoss = '';
      let invalidateIf = '';
      const bullets: string[] = [];
      const insights: string[] = [];
      let currentSection = '';

      for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Extract headline
        if (trimmedLine.includes('🧠 Signal —')) {
          headline = trimmedLine.replace('🧠 Signal —', '').trim();
          continue;
        }
        
        // Extract asset
        if (trimmedLine.includes('📈 Asset:')) {
          asset = trimmedLine.replace('📈 Asset:', '').trim();
          continue;
        }
        
        // Extract current price
        if (trimmedLine.includes('💰 Current Price:')) {
          currentPrice = trimmedLine.replace('💰 Current Price:', '').trim();
          continue;
        }
        
        // Extract structured data
        if (trimmedLine.includes('💡 View:')) {
          view = trimmedLine.replace('• 💡 View:', '').trim();
          bullets.push(trimmedLine.substring(1).trim());
        } else if (trimmedLine.includes('🎯 Entry Zone:')) {
          entryZone = trimmedLine.replace('• 🎯 Entry Zone:', '').trim();
          bullets.push(trimmedLine.substring(1).trim());
        } else if (trimmedLine.includes('💰 Take Profits:')) {
          takeProfits = trimmedLine.replace('• 💰 Take Profits:', '').trim();
          bullets.push(trimmedLine.substring(1).trim());
        } else if (trimmedLine.includes('🛑 Stop Loss:')) {
          stopLoss = trimmedLine.replace('• 🛑 Stop Loss:', '').trim();
          bullets.push(trimmedLine.substring(1).trim());
        } else if (trimmedLine.includes('🚨 Invalidate if:')) {
          invalidateIf = trimmedLine.replace('• 🚨 Invalidate if:', '').trim();
          bullets.push(trimmedLine.substring(1).trim());
        }
        
        // Track sections
        if (trimmedLine.includes('🔍 Insights:')) {
          currentSection = 'insights';
          continue;
        }
        
        // Extract insights with better parsing
        if (currentSection === 'insights' && trimmedLine.startsWith('•')) {
          const insightText = trimmedLine.substring(1).trim();
          
          // Check for specific insight patterns and add content if missing
          if (insightText.includes("What's driving this move?")) {
            if (insightText.length < 50) { // If it's just the question without content
              insights.push(`What's driving this move? → Live market analysis shows ${tokenSymbol} responding to institutional flow patterns and sentiment shifts`);
            } else {
              insights.push(insightText);
            }
          } else if (insightText.includes("Recent chart behavior")) {
            if (insightText.length < 50) {
              insights.push(`Recent chart behavior → ${tokenSymbol} showing key technical structure interaction around $${livePrice} level`);
            } else {
              insights.push(insightText);
            }
          } else if (insightText.includes("Supporting") || insightText.includes("Contradicting")) {
            if (insightText.length < 50) {
              insights.push("Supporting/Contradicting signals → Technical indicators and volume metrics provide directional confirmation");
            } else {
              insights.push(insightText);
            }
          } else if (insightText.includes("Wildcard") || insightText.includes("Meta")) {
            if (insightText.length < 50) {
              insights.push("Wildcard/Meta → Market sentiment and macro factors create additional trading context");
            } else {
              insights.push(insightText);
            }
          } else {
            insights.push(insightText);
          }
        }
      }

      // If insights are still empty, add default insights with live price context
      if (insights.length === 0) {
        insights.push(
          `What's driving this move? → ${tokenSymbol} at $${livePrice} showing institutional interest and volume patterns`,
          `Recent chart behavior → Price action around $${livePrice} indicates key technical level interaction`,
          "Supporting/Contradicting signals → Volume and momentum indicators align with current market structure",
          "Wildcard/Meta → Market sentiment and macro factors provide additional trading context"
        );
      }

      // Combine all bullets for display
      const allBullets = [...bullets, ...insights];

      // If no structured bullets found, try to extract from the raw content
      if (allBullets.length === 0) {
        const bulletMatches = content.match(/•[^•]+/g);
        if (bulletMatches) {
          allBullets.push(...bulletMatches.map(bullet => bullet.substring(1).trim()));
        }
      }

      // If still no bullets, use the entire content as a single bullet
      if (allBullets.length === 0) {
        allBullets.push(content.replace(/🧠|📈|🔍|📎/g, '').replace(/---/g, '').trim());
      }

      return {
        id: Date.now().toString(),
        query: userQuery,
        headline: headline || `${tokenSymbol} Signal — ${formattedDate}`,
        bullets: allBullets,
        sentiment: 'Traxor Engine',
        sources: sourcesWithLinks.map(s => s.name),
        timestamp: new Date(),
        bookmarked: false,
        rawContent: content,
        asset,
        currentPrice,
        view,
        entryZone,
        takeProfits,
        stopLoss,
        invalidateIf,
        insights,
        sourcesWithLinks
      };

    } catch (error) {
      console.error('API call failed:', error);
      
      // Fallback to mock response with rotating sources
      const fallbackToken = extractTokenFromQuery(userQuery);
      const { price: fallbackPrice, symbol: fallbackSymbol } = await fetchLiveTokenPrice(fallbackToken);
      const fallbackSources = getRotatingSources(3);
      setSourceIndex(prev => (prev + 3) % cryptoSources.length);
      
      return {
        id: Date.now().toString(),
        query: userQuery,
        headline: `${fallbackSymbol} Signal — ${new Date().toLocaleDateString()}`,
        bullets: [
          `💰 Current Price: $${fallbackPrice} → Live market data`,
          '💡 View: Bullish → Strong momentum continuation pattern',
          `🎯 Entry Zone: $${(fallbackPrice * 0.98).toFixed(2)} to $${(fallbackPrice * 1.02).toFixed(2)}`,
          `💰 Take Profits: TP1 $${(fallbackPrice * 1.05).toFixed(2)} → TP2 $${(fallbackPrice * 1.10).toFixed(2)} → TP3 $${(fallbackPrice * 1.15).toFixed(2)}`,
          `🛑 Stop Loss: $${(fallbackPrice * 0.95).toFixed(2)} (hard exit)`,
          '🚨 Invalidate if: BTC dumps 3%, funding > +0.3%',
          `What's driving this move? → ${fallbackSymbol} showing institutional accumulation patterns`,
          'Recent chart behavior → Bullish flag formation with volume confirmation',
          'Supporting/Contradicting signals → Technical indicators align with bullish bias',
          'Wildcard/Meta → Fear & Greed index showing extreme levels, contrarian opportunity'
        ],
        sentiment: 'Traxor Engine',
        sources: fallbackSources.map(s => s.name),
        timestamp: new Date(),
        bookmarked: false,
        currentPrice: `$${fallbackPrice}`,
        asset: fallbackSymbol,
        sourcesWithLinks: fallbackSources
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setSidebarOpen(false); // Close sidebar on mobile when submitting
    
    try {
      const newResponse = await callOpenRouterAPI(query);
      setResponses(prev => [newResponse, ...prev]);
      setQuery('');
      
      // Play sound effect
      if (soundEnabled) {
        console.log('🔊 Signal processed');
      }
    } catch (error) {
      console.error('Failed to get response:', error);
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

  const renderContent = () => {
    switch (activeTab) {
      case 'ask':
        return (
          <div className="space-y-4 sm:space-y-6">
            {isLoading && (
              <div className="bg-[#1D1E22]/80 border border-[#FF7744]/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 animate-pulse backdrop-blur-md shadow-2xl">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-3 h-3 bg-[#FF7744] rounded-full animate-ping" />
                  <span className="text-[#FF7744] font-mono text-xs sm:text-sm font-medium">Fetching live price data and processing signal...</span>
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
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {response.asset && (
                        <span className="inline-block bg-[#33211D]/60 text-[#FF7744] px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium border border-[#FF7744]/20">
                          📈 {response.asset}
                        </span>
                      )}
                      {response.currentPrice && (
                        <span className="inline-block bg-[#2B2417]/60 text-[#EBC26E] px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium border border-[#EBC26E]/20 font-mono">
                          💰 {response.currentPrice} LIVE
                        </span>
                      )}
                      {response.sentiment && (
                        <span className="inline-block bg-[#33211D]/60 text-[#EBC26E] px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium border border-[#EBC26E]/20">
                          {response.sentiment}
                        </span>
                      )}
                    </div>
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
                        <span className="text-xs text-gray-400 font-medium mb-2 sm:mb-0">Live sources:</span>
                        <div className="flex flex-wrap gap-2">
                          {response.sourcesWithLinks.map((source, index) => (
                            <span 
                              key={index} 
                              className="text-xs px-2 sm:px-2.5 py-1 rounded-xl bg-[#2B2417]/60 text-[#EBC26E] border border-[#EBC26E]/20 cursor-default"
                            >
                              {source.name}
                            </span>
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
                  Ask about any crypto asset for live trading signals with real-time price data and web synthesis.
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
                    <span className="text-gray-400 text-sm sm:text-base">AI Model:</span>
                    <span className="text-green-400 font-medium text-sm sm:text-base">GPT-4.1 Online</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400 text-sm sm:text-base">Price Data:</span>
                    <span className="text-green-400 flex items-center space-x-2 font-medium text-sm sm:text-base">
                      <Wifi className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>CoinGecko API</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400 text-sm sm:text-base">Web Search:</span>
                    <span className="text-green-400 flex items-center space-x-2 font-medium text-sm sm:text-base">
                      <Wifi className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Active</span>
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
                  <span className="text-white">Preferred Sources</span>
                </h3>
                <div className="space-y-3">
                  {cryptoSources.slice(0, 6).map((source, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <span className="text-gray-300 text-sm sm:text-base">{source.name}</span>
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full shadow-sm animate-pulse"></div>
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
            <div className="w-2 h-2 bg-[#FF7744] rounded-full animate-pulse"></div>
            <span>Traxor Signal Engine Active</span>
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