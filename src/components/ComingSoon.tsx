import React from 'react';
import { 
  TrendingUp, 
  BookOpen, 
  Map, 
  Settings, 
  Code, 
  Smartphone 
} from 'lucide-react';

const ComingSoon = () => {
  const features = [
    { icon: TrendingUp, title: "Sector-Specific Agents", desc: "Specialized intelligence layers for crypto, equities, commodities" },
    { icon: BookOpen, title: "Historical Context Triggers", desc: "Pattern recognition across market cycles and regime changes" },
    { icon: Map, title: "Watchlist-Linked Inference", desc: "Your positions become part of the reasoning mesh" },
    { icon: Settings, title: "Custom Signal Layer Presets", desc: "Configure the mesh for your trading style and timeframe" },
    { icon: Code, title: "Group Co-Analysis Modes", desc: "Collaborative intelligence for teams and research groups" },
    { icon: Smartphone, title: "Mobile Signal Interface", desc: "Terminal access optimized for mobile decision-making" }
  ];

  return (
    <section className="py-16 sm:py-32 px-4 sm:px-8 bg-[#121212]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-left text-white">
          System Expansion
        </h2>
        <p className="text-gray-400 mb-8 sm:mb-16 text-left text-sm sm:text-base">Next deployment cycle</p>
        
        <div className="grid gap-4 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} 
                 className="group bg-[#1D1E22]/60 backdrop-blur-sm border border-[#2A2B32] rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-[#FF7744]/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,119,68,0.1)]">
              <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-[#FF7744] mb-3 sm:mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComingSoon;