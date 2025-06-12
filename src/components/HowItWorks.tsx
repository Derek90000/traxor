import React from 'react';
import { MessageSquare, Zap, FileText } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: MessageSquare,
      title: "Ask Natural Questions",
      description: "You don't need commands or syntax. Just ask: \"Why did tech rotate this morning?\" \"Where's the momentum shifting this week?\" \"What's behind the bid for gold today?\""
    },
    {
      icon: Zap,
      title: "The Agent Scans",
      description: "A multi-layer system activates: Market flow, narrative threads, policy cues, emotional drift, real-time response signatures."
    },
    {
      icon: FileText,
      title: "You Get Signal",
      description: "Your response is a Signal Card: One core takeaway, 3-5 insight bullets, context tag, optional source links. You can ask again. Go deeper. It refocuses the mesh."
    }
  ];

  return (
    <section className="py-16 sm:py-32 px-4 sm:px-8 bg-[#121212]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-16 text-left text-white">
          How the Terminal Works
        </h2>
        
        <div className="grid gap-8 sm:gap-12 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="group">
              <div className="relative">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#FF7744] to-[#EBC26E] rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:shadow-[0_0_30px_rgba(255,119,68,0.3)] transition-all duration-300">
                  <step.icon className="w-6 h-6 sm:w-8 sm:h-8 text-[#121212]" />
                </div>
                
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 sm:top-8 left-16 sm:left-20 w-24 sm:w-32 h-px bg-gradient-to-r from-[#FF7744] to-transparent opacity-30" />
                )}
              </div>
              
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-white">{step.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;