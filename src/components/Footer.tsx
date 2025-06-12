import React from 'react';
import { Terminal, Twitter, FileText, Settings, Trophy } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="py-8 sm:py-16 px-4 sm:px-8 border-t border-[#2A2B32] bg-[#121212]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#FF7744] to-[#EBC26E] rounded-xl flex items-center justify-center">
              <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-[#121212]" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-white">Traxor</span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            <button 
              onClick={() => onNavigate('systemUpdates')}
              className="flex items-center space-x-2 text-gray-400 hover:text-[#FF7744] transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm">System Updates</span>
            </button>
            <button 
              onClick={() => onNavigate('signalDocs')}
              className="flex items-center space-x-2 text-gray-400 hover:text-[#FF7744] transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm">Signal Docs</span>
            </button>
            <button 
              onClick={() => onNavigate('accessLog')}
              className="flex items-center space-x-2 text-gray-400 hover:text-[#FF7744] transition-colors"
            >
              <Trophy className="w-4 h-4" />
              <span className="text-sm">Access Log</span>
            </button>
            <a href="#" className="flex items-center space-x-2 text-gray-400 hover:text-[#FF7744] transition-colors">
              <Twitter className="w-4 h-4" />
              <span className="text-sm">Signal Feed</span>
            </a>
          </div>
        </div>
        
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-[#2A2B32] text-center">
          <p className="text-xs sm:text-sm text-gray-400">
            © 2025 Traxor Intelligence Systems
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;