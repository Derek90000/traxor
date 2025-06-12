import React from 'react';
import { ArrowLeft, Terminal, Brain, Zap, Database, Shield, Target, Activity, FileText, Code, Settings, AlertTriangle } from 'lucide-react';

interface SignalDocsProps {
  onBack: () => void;
}

const SignalDocs: React.FC<SignalDocsProps> = ({ onBack }) => {
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
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-[#121212]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-white">Signal Documentation</h1>
              <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">Traxor Intelligence Terminal Reference</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-16">
        <div className="space-y-8 sm:space-y-16">
          
          {/* Overview */}
          <section>
            <div className="bg-[#1D1E22]/80 border border-[#FF7744]/20 rounded-2xl sm:rounded-3xl p-4 sm:p-8 backdrop-blur-md shadow-2xl">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <Terminal className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF7744]" />
                <h2 className="text-xl sm:text-2xl font-bold text-white">Terminal Overview</h2>
              </div>
              <div className="space-y-3 sm:space-y-4 text-gray-300 leading-relaxed text-sm sm:text-base">
                <p>
                  Traxor is not a chatbot. Not a dashboard. Not a startup. This is a synthetic market intelligence interface — built around a multi-layer reasoning system that ingests live signals and returns clear understanding.
                </p>
                <p>
                  Every response is built live, from a layered inference mesh that connects dots humans skip. You don't get answers. You get understanding — surfaced from the noise, shaped into Signal Cards.
                </p>
              </div>
            </div>
          </section>

          {/* Intelligence Mesh */}
          <section>
            <div className="flex items-center space-x-3 mb-6 sm:mb-8">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF7744]" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white">The Intelligence Mesh</h2>
            </div>
            
            <div className="grid gap-4 sm:gap-8 md:grid-cols-2">
              {[
                {
                  title: "Narrative Flow Engine",
                  description: "What the crowd believes is happening",
                  details: "Analyzes social sentiment, news flow, and narrative threads across markets. Identifies emerging themes before they become consensus."
                },
                {
                  title: "Volume Shift Scanner", 
                  description: "Where capital is concentrating or leaking",
                  details: "Tracks institutional flow patterns, unusual volume signatures, and capital rotation across asset classes."
                },
                {
                  title: "Macro Thread Sync",
                  description: "How global forces are reshaping behavior", 
                  details: "Synthesizes central bank policy, economic data, and geopolitical events into actionable market context."
                },
                {
                  title: "Sentiment Drift Signal",
                  description: "Where emotions are heading before price does",
                  details: "Measures fear, greed, and positioning changes through options flow, volatility patterns, and behavioral indicators."
                },
                {
                  title: "Cross-Asset Reaction Map",
                  description: "How signals echo between markets",
                  details: "Identifies correlation breakdowns, contagion patterns, and cross-market arbitrage opportunities."
                }
              ].map((layer, index) => (
                <div key={index} className="bg-[#1D1E22]/60 border border-[#2A2B32] rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-[#FF7744]/30 transition-colors backdrop-blur-sm">
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-[#FF7744] to-[#EBC26E] rounded-full mt-2 animate-pulse" />
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-[#FF7744] mb-2">{layer.title}</h3>
                      <p className="text-gray-300 text-sm mb-2 sm:mb-3">{layer.description}</p>
                      <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{layer.details}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Signal Card Anatomy */}
          <section>
            <div className="flex items-center space-x-3 mb-6 sm:mb-8">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF7744]" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Signal Card Anatomy</h2>
            </div>
            
            <div className="bg-[#1D1E22]/80 border border-[#2A2B32] rounded-2xl sm:rounded-3xl p-4 sm:p-8 backdrop-blur-md shadow-2xl">
              <div className="space-y-6">
                <div className="bg-[#2A2B32]/50 border border-[#FF7744]/20 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
                    <h3 className="text-base sm:text-lg font-semibold text-[#FF7744]">Example: Tech Sector Rotation Analysis</h3>
                    <span className="bg-[#33211D]/60 text-[#FF7744] px-2 sm:px-3 py-1 rounded-full text-xs font-medium border border-[#FF7744]/20 self-start sm:self-auto">
                      Macro Repricing
                    </span>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    {[
                      "Fed pivot expectations triggered value rotation out of growth",
                      "Institutional rebalancing detected via unusual volume patterns",
                      "Options flow showing defensive positioning in mega-cap tech",
                      "Cross-asset signals confirm risk-off sentiment acceleration"
                    ].map((bullet, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <span className="text-[#FF7744] mt-1 font-bold text-sm">•</span>
                        <span className="text-gray-300 text-sm sm:text-base">{bullet}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 pt-4 border-t border-[#FF7744]/20 space-y-3 sm:space-y-0">
                    <span className="text-xs text-gray-400">Signal sources:</span>
                    <div className="flex flex-wrap gap-2">
                      {['Flow Scanner', 'Narrative Engine', 'Macro Sync'].map((source, index) => (
                        <span key={index} className="text-xs bg-[#2B2417] px-2 py-1 rounded-lg text-[#EBC26E] border border-[#EBC26E]/20">
                          {source}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="grid gap-4 sm:gap-6 md:grid-cols-3 mt-6 sm:mt-8">
                  {[
                    {
                      component: "Headline",
                      description: "Core takeaway synthesized from all signal layers"
                    },
                    {
                      component: "Context Tag", 
                      description: "Classification of the market regime or event type"
                    },
                    {
                      component: "Signal Bullets",
                      description: "3-5 key insights ranked by conviction and relevance"
                    }
                  ].map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#FF7744] to-[#EBC26E] rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <span className="text-[#121212] font-bold text-sm">{index + 1}</span>
                      </div>
                      <h4 className="font-semibold text-white mb-2 text-sm sm:text-base">{item.component}</h4>
                      <p className="text-gray-400 text-xs sm:text-sm">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Query Protocol */}
          <section>
            <div className="flex items-center space-x-3 mb-6 sm:mb-8">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF7744]" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Query Protocol</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-[#1D1E22]/60 border border-[#2A2B32] rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
                <h3 className="text-base sm:text-lg font-semibold text-[#FF7744] mb-4">Natural Language Interface</h3>
                <p className="text-gray-300 mb-4 text-sm sm:text-base">
                  You don't need commands or syntax. The intelligence mesh interprets natural questions and focuses the analysis accordingly.
                </p>
                
                <div className="space-y-3">
                  <div className="bg-[#2A2B32]/40 rounded-xl p-3 sm:p-4 border border-[#FF7744]/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-[#FF7744] font-mono font-bold">{'>'}</span>
                      <span className="font-mono text-gray-300 text-sm sm:text-base break-all">Why did tech rotate this morning?</span>
                    </div>
                    <p className="text-gray-400 text-xs sm:text-sm">Triggers: Sector analysis, flow patterns, timing context</p>
                  </div>
                  
                  <div className="bg-[#2A2B32]/40 rounded-xl p-3 sm:p-4 border border-[#FF7744]/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-[#FF7744] font-mono font-bold">{'>'}</span>
                      <span className="font-mono text-gray-300 text-sm sm:text-base break-all">What's behind the bid for gold today?</span>
                    </div>
                    <p className="text-gray-400 text-xs sm:text-sm">Triggers: Macro analysis, safe haven flows, currency dynamics</p>
                  </div>
                  
                  <div className="bg-[#2A2B32]/40 rounded-xl p-3 sm:p-4 border border-[#FF7744]/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-[#FF7744] font-mono font-bold">{'>'}</span>
                      <span className="font-mono text-gray-300 text-sm sm:text-base break-all">Where's the momentum shifting this week?</span>
                    </div>
                    <p className="text-gray-400 text-xs sm:text-sm">Triggers: Cross-asset momentum, sentiment drift, positioning changes</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Intelligence Layer Specifications */}
          <section>
            <div className="flex items-center space-x-3 mb-6 sm:mb-8">
              <Database className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF7744]" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Intelligence Layer Specifications</h2>
            </div>
            
            <div className="grid gap-4 sm:gap-8 md:grid-cols-2">
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-[#1D1E22]/60 border border-[#2A2B32] rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
                  <div className="flex items-center space-x-3 mb-4">
                    <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF7744]" />
                    <h3 className="text-base sm:text-lg font-semibold text-white">Processing Speed</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Signal synthesis:</span>
                      <span className="text-white">1.2-2.8 seconds</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cross-layer analysis:</span>
                      <span className="text-white">Real-time</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Context integration:</span>
                      <span className="text-white">Sub-second</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#1D1E22]/60 border border-[#2A2B32] rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
                  <div className="flex items-center space-x-3 mb-4">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF7744]" />
                    <h3 className="text-base sm:text-lg font-semibold text-white">Data Integrity</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Source verification:</span>
                      <span className="text-green-400">Multi-layer</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Signal confidence:</span>
                      <span className="text-green-400">Weighted</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Bias detection:</span>
                      <span className="text-green-400">Active</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-[#1D1E22]/60 border border-[#2A2B32] rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
                  <div className="flex items-center space-x-3 mb-4">
                    <Code className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF7744]" />
                    <h3 className="text-base sm:text-lg font-semibold text-white">Signal Sources</h3>
                  </div>
                  <div className="space-y-2">
                    {['Flow Scanner', 'Narrative Engine', 'Macro Sync', 'Sentiment Drift', 'Volume Analysis'].map((source, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-[#FF7744] rounded-full animate-pulse" />
                        <span className="text-gray-300 text-sm">{source}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-[#1D1E22]/60 border border-[#2A2B32] rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
                  <div className="flex items-center space-x-3 mb-4">
                    <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF7744]" />
                    <h3 className="text-base sm:text-lg font-semibold text-white">System Status</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Mesh status:</span>
                      <span className="text-green-400">Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Layer sync:</span>
                      <span className="text-green-400">Synchronized</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Response quality:</span>
                      <span className="text-green-400">Optimal</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Signal Interpretation Guidelines */}
          <section>
            <div className="flex items-center space-x-3 mb-6 sm:mb-8">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF7744]" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Signal Interpretation Guidelines</h2>
            </div>
            
            <div className="bg-[#1D1E22]/80 border border-[#FF7744]/20 rounded-2xl sm:rounded-3xl p-4 sm:p-8 backdrop-blur-md shadow-2xl">
              <div className="space-y-6">
                <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-[#FF7744] mb-4">Context Tags</h3>
                    <div className="space-y-3">
                      {[
                        { tag: "Macro Repricing", desc: "Central bank policy or economic regime shift" },
                        { tag: "Institutional Flow", desc: "Large capital allocation or positioning change" },
                        { tag: "Sentiment Drift", desc: "Behavioral or emotional market shift" },
                        { tag: "Technical Break", desc: "Key level breach with follow-through" },
                        { tag: "Narrative Shift", desc: "Story or theme change driving action" }
                      ].map((item, index) => (
                        <div key={index} className="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-3">
                          <span className="bg-[#33211D]/60 text-[#FF7744] px-2 py-1 rounded-lg text-xs font-medium border border-[#FF7744]/20 self-start">
                            {item.tag}
                          </span>
                          <span className="text-gray-300 text-sm">{item.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-[#FF7744] mb-4">Signal Confidence</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-400 rounded-full" />
                        <span className="text-gray-300 text-sm">High conviction - Multiple layer confirmation</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-[#EBC26E] rounded-full" />
                        <span className="text-gray-300 text-sm">Medium conviction - Partial layer agreement</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-red-400 rounded-full" />
                        <span className="text-gray-300 text-sm">Low conviction - Single layer signal</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-3 sm:p-4 bg-[#2A2B32]/40 rounded-xl border border-[#FF7744]/10">
                      <p className="text-gray-400 text-xs sm:text-sm">
                        <strong className="text-[#FF7744]">Note:</strong> Signals are synthesized for understanding, not trading advice. Always combine with your own analysis and risk management.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default SignalDocs;