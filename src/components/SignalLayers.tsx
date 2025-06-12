import React from 'react';

const SignalLayers = () => {
  return (
    <section className="py-16 sm:py-32 px-4 sm:px-8 bg-gradient-to-b from-[#121212] via-[#33211D] to-[#121212]">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-8 sm:gap-16 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 text-white">
              The Intelligence Mesh
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-4 sm:mb-6">
              Every response is built live, from a layered inference system that connects dots humans skip.
            </p>
            <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
              You could build a wrapper. But you'd miss the mesh. You'd miss the flow interpreters. You'd miss the agent logic that surfaces clean answers at this clarity, this fast.
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF7744]/20 to-[#EBC26E]/20 rounded-2xl sm:rounded-3xl blur-3xl" />
            <div className="relative bg-[#1D1E22]/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-[#FF7744]/20">
              <div className="space-y-3 sm:space-y-4">
                {[
                  { layer: "Narrative Flow Engine", desc: "What the crowd believes is happening", color: "from-[#FF7744] to-[#EBC26E]" },
                  { layer: "Volume Shift Scanner", desc: "Where capital is concentrating or leaking", color: "from-[#EBC26E] to-[#F7E3AC]" },
                  { layer: "Macro Thread Sync", desc: "How global forces are reshaping behavior", color: "from-[#F7E3AC] to-[#FF7744]" },
                  { layer: "Sentiment Drift Signal", desc: "Where emotions are heading before price does", color: "from-[#FFB398] to-[#EBC26E]" },
                  { layer: "Cross-Asset Reaction Map", desc: "How signals echo between markets", color: "from-[#FF7744] to-[#FFB398]" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 sm:space-x-4">
                    <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-r ${item.color} animate-pulse mt-1 flex-shrink-0`} 
                         style={{ animationDelay: `${index * 0.2}s` }} />
                    <div>
                      <span className="text-gray-200 font-medium text-sm sm:text-base">{item.layer}</span>
                      <p className="text-gray-400 text-xs sm:text-sm mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignalLayers;