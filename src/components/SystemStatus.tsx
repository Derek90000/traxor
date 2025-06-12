import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Activity, 
  Zap, 
  Database, 
  Wifi, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Server, 
  Cpu, 
  HardDrive, 
  Network, 
  Eye, 
  Shield, 
  Radio,
  BarChart3,
  Gauge,
  RefreshCw,
  AlertCircle,
  XCircle,
  Minus,
  ExternalLink,
  Globe,
  DollarSign,
  MessageSquare,
  TrendingDown,
  BarChart,
  Building,
  Newspaper,
  Link
} from 'lucide-react';

interface SystemStatusProps {
  onBack: () => void;
}

interface LayerStatus {
  name: string;
  status: 'Active' | 'Synchronizing' | 'Recalibrating' | 'Offline';
  latency: number;
  throughput: number;
  lastUpdate: Date;
  baseLatency: number;
  baseThroughput: number;
}

interface SystemMetric {
  label: string;
  value: string | number;
  unit?: string;
  status: 'good' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
  baseValue: number;
  variance: number;
}

interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error';
  message: string;
  timestamp: Date;
  resolved?: boolean;
}

interface DataSource {
  name: string;
  provider: string;
  status: 'Connected' | 'Degraded' | 'Offline';
  latency: number;
  freshness: string;
  baseLatency: number;
  icon: React.ComponentType<any>;
  description: string;
  endpoint?: string;
}

const SystemStatus: React.FC<SystemStatusProps> = ({ onBack }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [heliusStatus, setHeliusStatus] = useState({
    status: 'Connected',
    latency: 45,
    throughput: '2.4K req/s',
    uptime: 99.98
  });

  const [signalLayers, setSignalLayers] = useState<LayerStatus[]>([
    {
      name: 'Narrative Flow Engine',
      status: 'Active',
      latency: 127,
      throughput: 2847,
      lastUpdate: new Date(Date.now() - 2000),
      baseLatency: 120,
      baseThroughput: 2800
    },
    {
      name: 'Volume Shift Scanner',
      status: 'Active',
      latency: 89,
      throughput: 4521,
      lastUpdate: new Date(Date.now() - 1500),
      baseLatency: 85,
      baseThroughput: 4500
    },
    {
      name: 'Macro Thread Sync',
      status: 'Synchronizing',
      latency: 234,
      throughput: 1876,
      lastUpdate: new Date(Date.now() - 8000),
      baseLatency: 200,
      baseThroughput: 1900
    },
    {
      name: 'Sentiment Drift Signal',
      status: 'Active',
      latency: 156,
      throughput: 3294,
      lastUpdate: new Date(Date.now() - 3000),
      baseLatency: 150,
      baseThroughput: 3300
    },
    {
      name: 'Cross-Asset Reaction Map',
      status: 'Active',
      latency: 98,
      throughput: 5103,
      lastUpdate: new Date(Date.now() - 1000),
      baseLatency: 95,
      baseThroughput: 5100
    }
  ]);

  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([
    { label: 'Signals Processed (1H)', value: 18247, status: 'good', trend: 'up', baseValue: 18000, variance: 500 },
    { label: 'Daily Average', value: 312456, status: 'good', trend: 'stable', baseValue: 312000, variance: 1000 },
    { label: 'Agent Load', value: 67, unit: '%', status: 'good', trend: 'down', baseValue: 65, variance: 10 },
    { label: 'Query Queue', value: 12, status: 'good', trend: 'stable', baseValue: 10, variance: 5 },
    { label: 'Memory Usage', value: 4.2, unit: 'GB', status: 'good', trend: 'stable', baseValue: 4.1, variance: 0.3 },
    { label: 'CPU Utilization', value: 34, unit: '%', status: 'good', trend: 'up', baseValue: 32, variance: 8 },
    { label: 'Network I/O', value: 847, unit: 'MB/s', status: 'good', trend: 'up', baseValue: 820, variance: 50 },
    { label: 'Storage Available', value: 2.8, unit: 'TB', status: 'warning', trend: 'down', baseValue: 2.85, variance: 0.1 }
  ]);

  const [dataSourceStatus, setDataSourceStatus] = useState<DataSource[]>([
    { 
      name: 'Real-Time Market Data', 
      provider: 'Bloomberg Terminal API',
      status: 'Connected', 
      latency: 23, 
      freshness: '< 100ms', 
      baseLatency: 25,
      icon: BarChart,
      description: 'Live price feeds, volume, and order book data',
      endpoint: 'api.bloomberg.com/v3'
    },
    { 
      name: 'Options Flow Intelligence', 
      provider: 'CBOE DataShop',
      status: 'Connected', 
      latency: 45, 
      freshness: '< 500ms', 
      baseLatency: 50,
      icon: TrendingUp,
      description: 'Unusual options activity and gamma exposure',
      endpoint: 'datashop.cboe.com/api'
    },
    { 
      name: 'Institutional Flow Tracker', 
      provider: 'Goldman Sachs Marquee',
      status: 'Degraded', 
      latency: 567, 
      freshness: '< 2min', 
      baseLatency: 200,
      icon: Building,
      description: 'Prime brokerage flow and positioning data',
      endpoint: 'marquee.gs.com/v1'
    },
    { 
      name: 'Social Sentiment Engine', 
      provider: 'Twitter API v2 + Reddit',
      status: 'Connected', 
      latency: 89, 
      freshness: '< 30s', 
      baseLatency: 90,
      icon: MessageSquare,
      description: 'Real-time social media sentiment analysis',
      endpoint: 'api.twitter.com/2'
    },
    { 
      name: 'News & Narrative Feed', 
      provider: 'Reuters Eikon + Alpha',
      status: 'Connected', 
      latency: 156, 
      freshness: '< 10s', 
      baseLatency: 150,
      icon: Newspaper,
      description: 'Breaking news and narrative thread analysis',
      endpoint: 'eikon.refinitiv.com/api'
    },
    { 
      name: 'Macro Economic Data', 
      provider: 'Federal Reserve FRED',
      status: 'Connected', 
      latency: 234, 
      freshness: '< 5min', 
      baseLatency: 220,
      icon: Globe,
      description: 'Central bank data and economic indicators',
      endpoint: 'api.stlouisfed.org/fred'
    },
    { 
      name: 'Crypto Market Intelligence', 
      provider: 'Coinbase Advanced Trade',
      status: 'Connected', 
      latency: 67, 
      freshness: '< 200ms', 
      baseLatency: 70,
      icon: DollarSign,
      description: 'Digital asset pricing and on-chain metrics',
      endpoint: 'api.coinbase.com/v2'
    },
    { 
      name: 'Blockchain Infrastructure', 
      provider: 'Helius Labs RPC',
      status: 'Connected', 
      latency: 45, 
      freshness: '< 150ms', 
      baseLatency: 50,
      icon: Link,
      description: 'Solana RPC infrastructure and on-chain data',
      endpoint: 'mainnet.helius-rpc.com'
    },
    { 
      name: 'Alternative Data Signals', 
      provider: 'Quandl + Satellite Imagery',
      status: 'Connected', 
      latency: 445, 
      freshness: '< 1hr', 
      baseLatency: 400,
      icon: Eye,
      description: 'Satellite data, supply chain, and ESG metrics',
      endpoint: 'api.quandl.com/v3'
    }
  ]);

  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([
    {
      id: '1',
      type: 'warning',
      message: 'Goldman Sachs Marquee API experiencing elevated latency due to market volatility',
      timestamp: new Date(Date.now() - 300000),
      resolved: false
    },
    {
      id: '2',
      type: 'info',
      message: 'Scheduled maintenance: Macro Thread Sync recalibration for Fed meeting data',
      timestamp: new Date(Date.now() - 480000),
      resolved: false
    },
    {
      id: '3',
      type: 'info',
      message: 'Helius Labs RPC connection optimized - Solana data latency improved 12%',
      timestamp: new Date(Date.now() - 1200000),
      resolved: true
    },
    {
      id: '4',
      type: 'info',
      message: 'Bloomberg Terminal connection pool optimized - latency improved 15%',
      timestamp: new Date(Date.now() - 1800000),
      resolved: true
    },
    {
      id: '5',
      type: 'warning',
      message: 'Twitter API rate limit approaching - implementing intelligent throttling',
      timestamp: new Date(Date.now() - 2700000),
      resolved: true
    },
    {
      id: '6',
      type: 'info',
      message: 'CBOE DataShop unusual options activity spike detected in tech sector',
      timestamp: new Date(Date.now() - 3600000),
      resolved: true
    }
  ]);

  const [uptimePercentage, setUptimePercentage] = useState(99.97);

  // Generate realistic variations based on time of day and market hours
  const getTimeBasedMultiplier = () => {
    const hour = currentTime.getHours();
    const isMarketHours = (hour >= 9 && hour <= 16); // 9 AM to 4 PM
    const isPreMarket = (hour >= 4 && hour < 9);
    const isAfterHours = (hour >= 16 && hour <= 20);
    
    if (isMarketHours) return 1.0 + Math.sin(Date.now() / 60000) * 0.3; // Higher activity during market hours
    if (isPreMarket || isAfterHours) return 0.7 + Math.sin(Date.now() / 120000) * 0.2; // Moderate activity
    return 0.4 + Math.sin(Date.now() / 180000) * 0.1; // Lower activity overnight
  };

  const getRealisticVariation = (base: number, variance: number, timeMultiplier: number) => {
    const randomFactor = (Math.random() - 0.5) * 2; // -1 to 1
    const timeFactor = Math.sin(Date.now() / 30000) * 0.5; // Slow oscillation
    const variation = base + (randomFactor * variance * 0.3) + (timeFactor * variance * 0.2);
    return Math.max(0, variation * timeMultiplier);
  };

  // Update system data every 2-5 seconds with realistic variations
  useEffect(() => {
    const updateInterval = setInterval(() => {
      const timeMultiplier = getTimeBasedMultiplier();
      
      // Update Helius status
      setHeliusStatus(prev => ({
        ...prev,
        latency: Math.round(getRealisticVariation(45, 10, 1)),
        throughput: `${(getRealisticVariation(2.4, 0.3, timeMultiplier)).toFixed(1)}K req/s`,
        uptime: Math.max(99.95, prev.uptime - Math.random() * 0.001)
      }));
      
      // Update signal layers
      setSignalLayers(prev => prev.map(layer => {
        const latencyVariation = getRealisticVariation(layer.baseLatency, 30, 1);
        const throughputVariation = getRealisticVariation(layer.baseThroughput, 200, timeMultiplier);
        
        // Occasionally change status
        let newStatus = layer.status;
        if (Math.random() < 0.002) { // 0.2% chance per update
          const statuses: LayerStatus['status'][] = ['Active', 'Synchronizing', 'Recalibrating'];
          newStatus = statuses[Math.floor(Math.random() * statuses.length)];
        }
        
        return {
          ...layer,
          latency: Math.round(latencyVariation),
          throughput: Math.round(throughputVariation),
          lastUpdate: Math.random() < 0.3 ? new Date() : layer.lastUpdate, // 30% chance to update timestamp
          status: newStatus
        };
      }));

      // Update system metrics
      setSystemMetrics(prev => prev.map(metric => {
        const newValue = getRealisticVariation(metric.baseValue, metric.variance, timeMultiplier);
        const formattedValue = metric.unit === 'GB' || metric.unit === 'TB' ? 
          Math.round(newValue * 10) / 10 : Math.round(newValue);
        
        // Determine trend based on recent changes
        const trend = newValue > metric.baseValue * 1.05 ? 'up' : 
                     newValue < metric.baseValue * 0.95 ? 'down' : 'stable';
        
        // Determine status based on thresholds
        let status: 'good' | 'warning' | 'critical' = 'good';
        if (metric.label.includes('Load') && newValue > 80) status = 'warning';
        if (metric.label.includes('Load') && newValue > 90) status = 'critical';
        if (metric.label.includes('Queue') && newValue > 20) status = 'warning';
        if (metric.label.includes('Storage') && newValue < 1) status = 'critical';
        if (metric.label.includes('Storage') && newValue < 2) status = 'warning';
        
        return {
          ...metric,
          value: formattedValue,
          trend,
          status
        };
      }));

      // Update data sources
      setDataSourceStatus(prev => prev.map(source => {
        const latencyVariation = getRealisticVariation(source.baseLatency, 50, 1);
        
        // Goldman Sachs Marquee has issues, others are mostly stable
        let newStatus = source.status;
        if (source.provider === 'Goldman Sachs Marquee') {
          newStatus = latencyVariation > 400 ? 'Degraded' : 'Connected';
        } else if (Math.random() < 0.001) { // Very rare status changes for other sources
          newStatus = Math.random() < 0.8 ? 'Connected' : 'Degraded';
        }
        
        return {
          ...source,
          latency: Math.round(latencyVariation),
          status: newStatus
        };
      }));

      // Slowly decrease uptime (very realistic)
      setUptimePercentage(prev => {
        const decrease = Math.random() * 0.001; // Very small random decrease
        return Math.max(99.90, prev - decrease);
      });

    }, Math.random() * 3000 + 2000); // Random interval between 2-5 seconds

    return () => clearInterval(updateInterval);
  }, [currentTime]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Occasionally add new alerts with realistic, branded messages
  useEffect(() => {
    const alertInterval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every 30 seconds
        const alertMessages = [
          'Bloomberg Terminal API: Unusual volume spike detected in SPY options',
          'CBOE DataShop: Gamma exposure threshold exceeded in NVDA',
          'Reuters Eikon: Breaking news narrative thread identified - Fed policy',
          'Twitter API: Sentiment drift acceleration detected in crypto mentions',
          'Goldman Sachs Marquee: Institutional flow pattern anomaly in tech sector',
          'Coinbase Advanced Trade: On-chain metrics showing whale accumulation',
          'FRED API: New economic data release processed - CPI inflation',
          'Helius Labs RPC: Solana network congestion detected - adjusting query patterns',
          'Quandl Satellite: Supply chain disruption signals in energy sector'
        ];
        
        const newAlert: SystemAlert = {
          id: Date.now().toString(),
          type: Math.random() < 0.7 ? 'info' : Math.random() < 0.8 ? 'warning' : 'error',
          message: alertMessages[Math.floor(Math.random() * alertMessages.length)],
          timestamp: new Date(),
          resolved: false
        };
        
        setSystemAlerts(prev => [newAlert, ...prev.slice(0, 9)]); // Keep only 10 most recent
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(alertInterval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const meshStatus = signalLayers.filter(l => l.status === 'Active').length >= 4 ? 'Operational' : 'Degraded';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Connected':
      case 'Operational':
        return 'text-green-400';
      case 'Synchronizing':
      case 'Degraded':
        return 'text-[#EBC26E]';
      case 'Recalibrating':
        return 'text-blue-400';
      case 'Offline':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Connected':
      case 'Operational':
        return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />;
      case 'Synchronizing':
        return <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 text-[#EBC26E] animate-spin" />;
      case 'Degraded':
        return <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-[#EBC26E]" />;
      case 'Recalibrating':
        return <Gauge className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />;
      case 'Offline':
        return <XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />;
      default:
        return <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />;
    }
  };

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-400';
      case 'warning':
        return 'text-[#EBC26E]';
      case 'critical':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-green-400" />;
      case 'down':
        return <TrendingDown className="w-3 h-3 text-red-400" />;
      case 'stable':
        return <Minus className="w-3 h-3 text-gray-400" />;
      default:
        return null;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-[#EBC26E]" />;
      case 'info':
        return <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />;
      default:
        return <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />;
    }
  };

  const totalThroughput = signalLayers.reduce((sum, layer) => sum + layer.throughput, 0);
  const avgLatency = Math.round(signalLayers.reduce((sum, layer) => sum + layer.latency, 0) / signalLayers.length);
  const connectedSources = dataSourceStatus.filter(s => s.status === 'Connected').length;
  const activeAlerts = systemAlerts.filter(a => !a.resolved).length;

  return (
    <div className="min-h-screen bg-[#121212] text-white font-['Space_Grotesk']">
      {/* Header */}
      <div className="border-b border-[#2A2B32] bg-[#1D1E22]/60 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-4 sm:py-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-400 hover:text-[#FF7744] transition-colors mb-4 sm:mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back to Terminal</span>
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#FF7744] to-[#EBC26E] rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl">
              <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-[#121212]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-white">System Status</h1>
              <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">Traxor Signal Engine Operational Dashboard</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Helius Labs RPC Status */}
              <div className="bg-[#1D1E22]/80 border border-[#2A2B32] rounded-xl sm:rounded-2xl p-3 sm:p-4 backdrop-blur-md shadow-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Link className="w-3 h-3 sm:w-4 sm:h-4 text-[#FF7744]" />
                  <span className="text-xs sm:text-sm font-semibold text-white">Helius Labs RPC</span>
                  {getStatusIcon(heliusStatus.status)}
                </div>
                <div className="flex items-center justify-between space-x-3 text-xs">
                  <div className="text-gray-400">
                    <div>{heliusStatus.latency}ms</div>
                    <div>{heliusStatus.throughput}</div>
                  </div>
                  <a 
                    href="https://www.helius.dev/docs" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-[#FF7744] hover:text-[#EBC26E] transition-colors"
                  >
                    <span className="text-xs font-medium">Docs</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end space-x-4 sm:space-x-6">
                <button
                  onClick={handleRefresh}
                  className={`p-2 sm:p-3 bg-[#1D1E22]/60 hover:bg-[#2A2B32]/60 rounded-xl sm:rounded-2xl transition-colors border border-[#2A2B32] backdrop-blur-sm ${refreshing ? 'animate-pulse' : ''}`}
                >
                  <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 ${refreshing ? 'animate-spin' : ''}`} />
                </button>
                <div className="text-right">
                  <div className="text-xs sm:text-sm text-gray-400">System Time</div>
                  <div className="font-mono text-white text-sm sm:text-base">{currentTime.toLocaleTimeString()}</div>
                  <div className="text-xs text-gray-500">{currentTime.toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-16">
        <div className="space-y-8 sm:space-y-12">
          
          {/* Mesh Status Overview */}
          <section>
            <div className="grid gap-4 sm:gap-8 md:grid-cols-3">
              <div className="md:col-span-2">
                <div className="bg-[#1D1E22]/80 border border-[#2A2B32] rounded-2xl sm:rounded-3xl p-4 sm:p-8 backdrop-blur-md shadow-2xl">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <Server className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF7744]" />
                      <h2 className="text-xl sm:text-2xl font-bold text-white">Traxor Signal Engine Status</h2>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(meshStatus)}
                      <span className={`font-semibold text-base sm:text-lg ${getStatusColor(meshStatus)}`}>
                        {meshStatus}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid gap-4 sm:gap-8 md:grid-cols-2">
                    <div>
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-400 text-sm sm:text-base">System Uptime:</span>
                          <span className="text-green-400 font-semibold text-sm sm:text-base">{uptimePercentage.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-400 text-sm sm:text-base">Active Layers:</span>
                          <span className="text-white font-semibold text-sm sm:text-base">
                            {signalLayers.filter(l => l.status === 'Active').length}/{signalLayers.length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-400 text-sm sm:text-base">Total Throughput:</span>
                          <span className="text-white font-semibold text-sm sm:text-base">
                            {totalThroughput.toLocaleString()} sig/min
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-400 text-sm sm:text-base">Avg Response Time:</span>
                          <span className="text-white font-semibold text-sm sm:text-base">{avgLatency}ms</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-400 text-sm sm:text-base">Data Sources:</span>
                          <span className="text-white font-semibold text-sm sm:text-base">
                            {connectedSources}/{dataSourceStatus.length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-400 text-sm sm:text-base">Active Alerts:</span>
                          <span className="text-[#EBC26E] font-semibold text-sm sm:text-base">{activeAlerts}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-[#1D1E22]/80 border border-[#2A2B32] rounded-2xl sm:rounded-3xl p-4 sm:p-6 backdrop-blur-md shadow-2xl">
                  <div className="flex items-center space-x-3 mb-4">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF7744]" />
                    <h3 className="text-base sm:text-lg font-semibold text-white">System Load</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">CPU</span>
                      <span className="text-white font-medium text-sm">
                        {systemMetrics.find(m => m.label.includes('CPU'))?.value}%
                      </span>
                    </div>
                    <div className="w-full bg-[#2A2B32] rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-[#FF7744] to-[#EBC26E] h-2 rounded-full transition-all duration-1000" 
                        style={{ width: `${systemMetrics.find(m => m.label.includes('CPU'))?.value}%` }} 
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Memory</span>
                      <span className="text-white font-medium text-sm">
                        {((Number(systemMetrics.find(m => m.label.includes('Memory'))?.value) / 8) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-[#2A2B32] rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-[#FF7744] to-[#EBC26E] h-2 rounded-full transition-all duration-1000" 
                        style={{ width: `${((Number(systemMetrics.find(m => m.label.includes('Memory'))?.value) / 8) * 100)}%` }} 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#1D1E22]/80 border border-[#2A2B32] rounded-2xl sm:rounded-3xl p-4 sm:p-6 backdrop-blur-md shadow-2xl">
                  <div className="flex items-center space-x-3 mb-4">
                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF7744]" />
                    <h3 className="text-base sm:text-lg font-semibold text-white">Signal Throughput</h3>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-[#FF7744] mb-1">
                      {(Math.round(totalThroughput * 60 / 1000 * 10) / 10)}K
                    </div>
                    <div className="text-gray-400 text-sm">Signals/Hour</div>
                    <div className="flex items-center justify-center space-x-1 mt-2">
                      <TrendingUp className="w-3 h-3 text-green-400" />
                      <span className="text-green-400 text-xs">
                        +{Math.round((totalThroughput - 17500) / 175)}% vs avg
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Signal Layer Activity */}
          <section>
            <div className="flex items-center space-x-3 mb-6 sm:mb-8">
              <Radio className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF7744]" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Signal Layer Activity</h2>
            </div>
            
            <div className="grid gap-3 sm:gap-6">
              {signalLayers.map((layer, index) => (
                <div key={index} className="bg-[#1D1E22]/80 border border-[#2A2B32] rounded-2xl sm:rounded-3xl p-4 sm:p-6 hover:border-[#FF7744]/30 transition-colors backdrop-blur-md shadow-2xl">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(layer.status)}
                        <span className={`font-semibold text-sm sm:text-base ${getStatusColor(layer.status)}`}>
                          {layer.status}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-white">{layer.name}</h3>
                        <p className="text-gray-400 text-xs sm:text-sm">
                          Last update: {Math.floor((Date.now() - layer.lastUpdate.getTime()) / 1000)}s ago
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end space-x-4 sm:space-x-8">
                      <div className="text-center">
                        <div className="text-xs sm:text-sm text-gray-400">Latency</div>
                        <div className="font-semibold text-white text-sm sm:text-base">{layer.latency}ms</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs sm:text-sm text-gray-400">Throughput</div>
                        <div className="font-semibold text-white text-sm sm:text-base">{layer.throughput.toLocaleString()}/min</div>
                      </div>
                      <div className="w-12 h-6 sm:w-16 sm:h-8 bg-[#2A2B32] rounded-lg flex items-center justify-center">
                        <div className="w-8 h-1 sm:w-12 sm:h-1 bg-gradient-to-r from-[#FF7744] to-[#EBC26E] rounded-full animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* System Metrics */}
          <section>
            <div className="flex items-center space-x-3 mb-6 sm:mb-8">
              <Gauge className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF7744]" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white">System Metrics</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-4">
              {systemMetrics.map((metric, index) => (
                <div key={index} className="bg-[#1D1E22]/80 border border-[#2A2B32] rounded-2xl sm:rounded-3xl p-3 sm:p-6 backdrop-blur-md shadow-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-xs sm:text-sm">{metric.label}</span>
                    {getTrendIcon(metric.trend)}
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className={`text-lg sm:text-2xl font-bold ${getMetricStatusColor(metric.status)}`}>
                      {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                    </span>
                    {metric.unit && (
                      <span className="text-gray-400 text-xs sm:text-sm">{metric.unit}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Data Source Integrity */}
          <section>
            <div className="flex items-center space-x-3 mb-6 sm:mb-8">
              <Database className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF7744]" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Data Source Integrity</h2>
            </div>
            
            <div className="grid gap-3 sm:gap-6 md:grid-cols-2">
              {dataSourceStatus.map((source, index) => (
                <div key={index} className="bg-[#1D1E22]/80 border border-[#2A2B32] rounded-2xl sm:rounded-3xl p-4 sm:p-6 hover:border-[#FF7744]/30 transition-colors backdrop-blur-md shadow-2xl">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#2A2B32]/60 rounded-xl sm:rounded-2xl flex items-center justify-center mt-1 flex-shrink-0">
                        <source.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF7744]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          {getStatusIcon(source.status)}
                          <h3 className="font-semibold text-white text-sm sm:text-base truncate">{source.name}</h3>
                        </div>
                        <p className="text-xs sm:text-sm text-[#EBC26E] mb-2 truncate">{source.provider}</p>
                        <p className="text-xs text-gray-400 mb-2 sm:mb-3 line-clamp-2">{source.description}</p>
                        {source.endpoint && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                            <span className="font-mono truncate">{source.endpoint}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right ml-2 sm:ml-4 flex-shrink-0">
                      <span className={`text-xs sm:text-sm font-medium ${getStatusColor(source.status)} mb-1 block`}>
                        {source.status}
                      </span>
                      <div className="text-xs text-gray-400">
                        <div>Latency: {source.latency}ms</div>
                        <div>Freshness: {source.freshness}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* System Alerts */}
          <section>
            <div className="flex items-center space-x-3 mb-6 sm:mb-8">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF7744]" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white">System Alerts</h2>
            </div>
            
            <div className="bg-[#1D1E22]/80 border border-[#2A2B32] rounded-2xl sm:rounded-3xl backdrop-blur-md shadow-2xl overflow-hidden">
              <div className="divide-y divide-[#2A2B32]">
                {systemAlerts.slice(0, 8).map((alert) => (
                  <div key={alert.id} className={`p-4 sm:p-6 ${alert.resolved ? 'opacity-60' : ''}`}>
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="mt-0.5 flex-shrink-0">
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 space-y-2 sm:space-y-0">
                          <p className="text-white font-medium text-sm sm:text-base pr-2">{alert.message}</p>
                          {alert.resolved && (
                            <span className="bg-green-900/40 text-green-400 px-2 py-1 rounded-lg text-xs font-medium border border-green-700/30 self-start sm:self-auto flex-shrink-0">
                              Resolved
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-gray-400 space-y-1 sm:space-y-0">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{alert.timestamp.toLocaleString()}</span>
                          </div>
                          <span className="capitalize">{alert.type}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default SystemStatus;