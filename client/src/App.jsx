import React from 'react';
import { useAppState } from './context/AppContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomeView from './components/home/HomeView';
import DiscernmentView from './components/discernment/DiscernmentView';
import ResultView from './components/result/ResultView';

function App() {
  const { state } = useAppState();

  const renderView = () => {
    switch (state.view) {
      case 'home':
        return <HomeView />;
      case 'discernment':
        return <DiscernmentView />;
      case 'result':
        return <ResultView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans bg-white text-slate-900 ${state.dir === 'rtl' ? 'rtl' : 'ltr'}`}>
      <Navbar />
      <div className="flex-grow">
        {renderView()}
      </div>
      <Footer />
    </div>
  );
}

export default App;
