import React from 'react';

const WhyTraxor = () => {
  return (
    <section className="py-16 sm:py-32 px-4 sm:px-8 bg-[#121212]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-16 text-left text-white">
          Who Traxor Is For
        </h2>
        
        <div className="grid gap-4 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            "Traders who don't chase Twitter feeds",
            "Analysts who think at 1AM", 
            "Builders who want the \"why,\" not the chart",
            "People who get the market is more psychology than math",
            "Those who can think across timeframes",
            "Market thinkers who need understanding, not answers"
          ].map((persona, index) => (
            <div key={index} className="bg-[#1D1E22]/60 backdrop-blur-sm border border-[#2A2B32] rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-[#FF7744]/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,119,68,0.1)]">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-[#FF7744] rounded-full mt-2 sm:mt-3 flex-shrink-0" />
                <p className="text-gray-200 leading-relaxed text-sm sm:text-base">{persona}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 sm:mt-16 text-center">
          <p className="text-gray-400 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            This is not a chatbot. Not a dashboard. Not a startup. Traxor is a synthetic market intelligence interface — built around a multi-layer reasoning system that ingests live signals and returns clear understanding.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyTraxor;