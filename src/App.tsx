import React, { useState } from 'react';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import SignalLayers from './components/SignalLayers';
import ComingSoon from './components/ComingSoon';
import TerminalPreview from './components/TerminalPreview';
import WhyTraxor from './components/WhyTraxor';
import AlphaAccess from './components/AlphaAccess';
import Footer from './components/Footer';
import Terminal from './components/Terminal';
import SignalDocs from './components/SignalDocs';
import SystemStatus from './components/SystemStatus';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'terminal':
        return <Terminal onBack={() => setCurrentPage('landing')} />;
      case 'signalDocs':
        return <SignalDocs onBack={() => setCurrentPage('landing')} />;
      case 'systemStatus':
        return <SystemStatus onBack={() => setCurrentPage('landing')} />;
      default:
        return (
          <div className="bg-[#121212] text-white font-['Space_Grotesk'] overflow-x-hidden">
            <Hero onLaunchTerminal={() => setCurrentPage('terminal')} onNavigate={handleNavigate} />
            <HowItWorks />
            <SignalLayers />
            <ComingSoon />
            <TerminalPreview />
            <WhyTraxor />
            <AlphaAccess />
            <Footer onNavigate={handleNavigate} />
          </div>
        );
    }
  };

  return renderPage();
}

export default App;