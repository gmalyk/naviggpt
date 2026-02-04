import React, { useEffect, useRef } from 'react';
import { useAppState } from './context/AppContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomeView from './components/home/HomeView';
import AboutView from './components/about/AboutView';
import DiscernmentView from './components/discernment/DiscernmentView';
import ResultView from './components/result/ResultView';
import PromptEditorView from './components/prompts/PromptEditorView';

function App() {
  const { state } = useAppState();
  const discernmentRef = useRef(null);
  const resultRef = useRef(null);

  useEffect(() => {
    if (state.view === 'discernment' && discernmentRef.current) {
      setTimeout(() => {
        discernmentRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'end'
        });
      }, 100);
    } else if (state.view === 'result' && resultRef.current) {
      setTimeout(() => {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = resultRef.current.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }, 100);
    }
  }, [state.view]);

  return (
    <div className={`min-h-screen flex flex-col font-sans bg-white text-slate-900 ${state.dir === 'rtl' ? 'rtl' : 'ltr'}`}>
      <Navbar />
      <div className="flex-grow pt-20 relative z-0">
        {state.view !== 'about' && state.view !== 'prompts' && <HomeView />}

        {state.view === 'about' && <AboutView />}

        {state.view === 'prompts' && <PromptEditorView />}

        {(state.view === 'discernment' || state.view === 'result') && (
          <div ref={discernmentRef} className="border-t border-slate-50">
            <DiscernmentView />
          </div>
        )}

        {state.view === 'result' && (
          <div ref={resultRef} className="border-t border-slate-50">
            <ResultView />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default App;
