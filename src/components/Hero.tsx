import React, { useState } from 'react';
import { Terminal, ChevronRight, Menu, X } from 'lucide-react';

interface HeroProps {
  onLaunchTerminal: () => void;
  onNavigate: (page: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onLaunchTerminal, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'signalDocs', label: 'Signal Docs' },
    { id: 'systemStatus', label: 'System Status' },
    { id: 'accessLog', label: 'Access Log' }
  ];

  const handleNavClick = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF7744]/8 via-transparent to-[#EBC26E]/8" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23FF7744%22 fill-opacity=%220.02%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse" />
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-4 sm:px-8 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#FF7744] to-[#EBC26E] rounded-xl flex items-center justify-center shadow-2xl">
              <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-[#121212]" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-white">Traxor</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 text-sm">
            {navItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="text-gray-300 hover:text-[#FF7744] transition-colors font-medium"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-[#FF7744] transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#1D1E22]/95 backdrop-blur-xl border-b border-[#2A2B32] shadow-2xl">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="space-y-4">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className="block w-full text-left px-4 py-3 text-gray-300 hover:text-[#FF7744] hover:bg-[#2A2B32]/40 rounded-xl transition-all duration-300 font-medium border border-transparent hover:border-[#FF7744]/20"
                  >
                    {item.label}
                  </button>
                ))}
                
                {/* Mobile Terminal Launch Button */}
                <div className="pt-4 border-t border-[#2A2B32]">
                  <button 
                    onClick={() => {
                      onLaunchTerminal();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-[#FF7744] to-[#EBC26E] text-[#121212] px-6 py-3 rounded-xl font-semibold hover:shadow-[0_0_20px_rgba(255,119,68,0.3)] transition-all duration-300 flex items-center justify-center space-x-2 group"
                  >
                    <span className="font-mono text-sm">&gt; Launch Terminal</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 z-10 grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* Left Side - Main Content */}
        <div className="text-center lg:text-left">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white via-[#FF7744] to-[#EBC26E] bg-clip-text text-transparent leading-tight">
            All Assets.<br />One Mind.
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Traxor decodes narrative, flow, and context — and gives you clarity when others chase headlines.
          </p>
          
          <button 
            onClick={onLaunchTerminal}
            className="group bg-gradient-to-r from-[#FF7744] to-[#EBC26E] text-[#121212] px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg hover:shadow-[0_0_40px_rgba(255,119,68,0.4)] transition-all duration-300 mb-4 sm:mb-6 flex items-center mx-auto lg:mx-0"
          >
            <span className="mr-2 font-mono text-sm sm:text-base">&gt; Launch Terminal</span>
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <p className="text-xs sm:text-sm text-gray-400 font-mono">
            Signal engine active. Data layers synchronized.
          </p>
        </div>

        {/* Right Side - Terminal Preview Card */}
        <div className="hidden lg:block relative">
          {/* Glassmorphic Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF7744]/10 via-[#EBC26E]/5 to-[#FF7744]/10 rounded-3xl blur-3xl transform rotate-3 scale-105" />
          <div className="absolute inset-0 bg-gradient-to-tl from-[#EBC26E]/8 via-transparent to-[#FF7744]/8 rounded-3xl blur-2xl transform -rotate-2 scale-110" />
          
          {/* Main Card */}
          <div className="relative bg-[#1D1E22]/40 backdrop-blur-xl border border-[#FF7744]/20 rounded-3xl p-6 shadow-[0_0_50px_rgba(255,119,68,0.15)] hover:shadow-[0_0_80px_rgba(255,119,68,0.25)] transition-all duration-500 group">
            {/* Card Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-[#FF7744] to-[#EBC26E] rounded-xl flex items-center justify-center shadow-lg">
                  <Terminal className="w-4 h-4 text-[#121212]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Terminal Preview</h3>
                  <p className="text-gray-400 text-sm">Live Signal Interface</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full opacity-60" />
                <div className="w-3 h-3 bg-yellow-500 rounded-full opacity-60" />
                <div className="w-3 h-3 bg-green-500 rounded-full opacity-60" />
              </div>
            </div>

            {/* Terminal Image Container */}
            <div className="relative overflow-hidden rounded-2xl border border-[#2A2B32]/50 bg-[#121212]/60 backdrop-blur-sm">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF7744]/5 to-[#EBC26E]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Image */}
              <img 
                src="/herobanner.png" 
                alt="Traxor Terminal Interface"
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/20 via-transparent to-transparent" />
            </div>

            {/* Card Footer */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#FF7744] rounded-full animate-pulse" />
                <span className="text-gray-400 text-sm font-mono">Live Data Feed</span>
              </div>
              <button 
                onClick={onLaunchTerminal}
                className="text-[#FF7744] hover:text-[#EBC26E] transition-colors text-sm font-medium flex items-center space-x-1 group/btn"
              >
                <span>Try Now</span>
                <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-[#FF7744]/20 to-[#EBC26E]/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-[#EBC26E]/15 to-[#FF7744]/15 rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Mobile Terminal Preview */}
        <div className="lg:hidden mt-8">
          <div className="relative bg-[#1D1E22]/60 backdrop-blur-xl border border-[#FF7744]/20 rounded-2xl p-4 shadow-[0_0_30px_rgba(255,119,68,0.1)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-[#FF7744]" />
                <span className="text-white font-medium text-sm">Terminal Preview</span>
              </div>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full opacity-60" />
                <div className="w-2 h-2 bg-yellow-500 rounded-full opacity-60" />
                <div className="w-2 h-2 bg-green-500 rounded-full opacity-60" />
              </div>
            </div>
            <div className="relative overflow-hidden rounded-xl border border-[#2A2B32]/50">
              <img 
                src="/herobanner.png" 
                alt="Traxor Terminal Interface"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-px h-16 bg-gradient-to-b from-[#FF7744] to-transparent" />
      </div>
    </section>
  );
};

export default Hero;