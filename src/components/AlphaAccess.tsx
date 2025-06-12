import React, { useState } from 'react';
import { ChevronRight, Mail } from 'lucide-react';

const AlphaAccess = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Handle email submission here
  };

  return (
    <section className="py-16 sm:py-32 px-4 sm:px-8 bg-gradient-to-b from-[#121212] via-[#33211D] to-[#121212]">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 sm:mb-8 text-white">
          Terminal Access
        </h2>
        <p className="text-lg sm:text-xl text-gray-300 mb-4">
          Intelligence mesh deployment in progress
        </p>
        
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row rounded-2xl overflow-hidden bg-[#1D1E22] border border-[#2A2B32] focus-within:border-[#FF7744] transition-colors">
              <div className="flex items-center px-4 py-3 sm:py-0">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-transparent px-4 py-3 sm:py-4 text-white placeholder-gray-400 focus:outline-none text-sm sm:text-base"
                required
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-[#FF7744] to-[#EBC26E] text-[#121212] px-4 sm:px-6 py-3 sm:py-4 font-semibold hover:shadow-[0_0_20px_rgba(255,119,68,0.3)] transition-all flex items-center justify-center space-x-2 group text-sm sm:text-base"
              >
                <span className="font-mono">&gt; Request Access</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-[#33211D]/60 border border-[#FF7744]/30 rounded-2xl p-4 sm:p-6 max-w-md mx-auto mb-6 sm:mb-8">
            <p className="text-[#FF7744] font-semibold text-sm sm:text-base">Access Request Logged</p>
            <p className="text-gray-300 text-xs sm:text-sm mt-2">You'll be contacted as the system scales.</p>
          </div>
        )}
        
        <p className="text-xs sm:text-sm text-gray-400">
          Priority access for serious market thinkers. No spam. No demos.
        </p>
      </div>
    </section>
  );
};

export default AlphaAccess;