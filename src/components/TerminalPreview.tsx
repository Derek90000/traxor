import React from 'react';
import { Terminal, ExternalLink, Clock } from 'lucide-react';

const TerminalPreview = () => {
  return (
    <section className="py-16 sm:py-32 px-4 sm:px-8 bg-gradient-to-b from-[#121212] via-[#2B2417] to-[#121212]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-16 text-left text-white">
          Signal Interface Preview
        </h2>
        
        <div className="bg-[#1D1E22] border border-[#FF7744]/30 rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(255,119,68,0.1)]">
          {/* Terminal Header */}
          <div className="bg-[#2A2B32] px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-[#FF7744]/20">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF7744]" />
              <span className="text-xs sm:text-sm font-mono text-white">Traxor Intelligence Terminal</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#FF7744] rounded-full animate-pulse" />
                <span className="text-xs text-gray-400 font-mono hidden sm:inline">MESH ACTIVE</span>
              </div>
              <div className="flex space-x-1 sm:space-x-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full" />
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full" />
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full" />
              </div>
            </div>
          </div>
          
          {/* Terminal Content */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Command Input */}
            <div className="flex items-center space-x-2">
              <span className="text-[#FF7744] font-mono font-bold">{'>'}</span>
              <span className="font-mono text-gray-300 text-sm sm:text-base">Why did tech rotate this morning?</span>
              <div className="w-1 h-4 sm:w-2 sm:h-5 bg-[#FF7744] animate-pulse" />
            </div>
            
            {/* Response Card */}
            <div className="bg-[#2A2B32]/50 border border-[#FF7744]/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <h3 className="text-base sm:text-lg font-semibold text-[#FF7744]">Tech Sector Rotation Analysis</h3>
                  <span className="bg-[#33211D]/60 text-[#FF7744] px-2 sm:px-3 py-1 rounded-full text-xs font-medium border border-[#FF7744]/20 self-start sm:self-auto">
                    Macro Repricing
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Live synthesis</span>
                </div>
              </div>
              
              <div className="space-y-2 text-gray-300">
                <div className="flex items-start space-x-2">
                  <span className="text-[#FF7744] mt-1 font-bold text-sm">•</span>
                  <span className="text-sm sm:text-base">Fed pivot expectations triggered value rotation out of growth</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-[#FF7744] mt-1 font-bold text-sm">•</span>
                  <span className="text-sm sm:text-base">Institutional rebalancing detected via unusual volume patterns</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-[#FF7744] mt-1 font-bold text-sm">•</span>
                  <span className="text-sm sm:text-base">Options flow showing defensive positioning in mega-cap tech</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-[#FF7744] mt-1 font-bold text-sm">•</span>
                  <span className="text-sm sm:text-base">Cross-asset signals confirm risk-off sentiment acceleration</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 pt-3 sm:pt-4 border-t border-[#FF7744]/20 space-y-2 sm:space-y-0">
                <span className="text-xs text-gray-400">Signal sources:</span>
                <div className="flex flex-wrap gap-2">
                  {['Flow Scanner', 'Narrative Engine', 'Macro Sync'].map((source, index) => (
                    <span key={index} className="text-xs bg-[#2B2417] px-2 py-1 rounded-lg flex items-center space-x-1 text-[#EBC26E] border border-[#EBC26E]/20">
                      <span>{source}</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TerminalPreview;