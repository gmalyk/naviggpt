import React, { useEffect } from 'react';
import { useAppState } from './context/AppContext';
import { ACTIONS } from './context/appReducer';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomeView from './components/home/HomeView';
import AboutView from './components/about/AboutView';
import DiscernmentView from './components/discernment/DiscernmentView';
import ResultView from './components/result/ResultView';
import PromptEditorView from './components/prompts/PromptEditorView';
import PricingView from './components/pricing/PricingView';
import AccountView from './components/account/AccountView';
import ContactView from './components/contact/ContactView';
import ForumView from './components/forum/ForumView';
import TermsView from './components/terms/TermsView';
import CompassView from './components/compass/CompassView';

function App() {
  const { state, dispatch } = useAppState();

  // Scroll to top on page refresh
  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (window.location.pathname === '/edit') {
      dispatch({ type: ACTIONS.SET_VIEW, payload: 'prompts' });
    }
  }, [dispatch]);

  return (
    <div className={`min-h-screen flex flex-col font-sans bg-white text-slate-900 ${state.dir === 'rtl' ? 'rtl' : 'ltr'}`}>
      <Navbar />
      <div className="flex-grow pt-20 relative z-0">
        {state.view !== 'about' && state.view !== 'prompts' && state.view !== 'pricing' && state.view !== 'account' && state.view !== 'contact' && state.view !== 'forum' && state.view !== 'terms' && state.view !== 'compass' && <HomeView />}

        {state.view === 'about' && <AboutView />}

        {state.view === 'prompts' && <PromptEditorView />}

        {state.view === 'pricing' && <PricingView />}

        {state.view === 'account' && <AccountView />}

        {state.view === 'contact' && <ContactView />}

        {state.view === 'forum' && <ForumView />}

        {state.view === 'terms' && <TermsView />}

        {state.view === 'compass' && <CompassView />}

        {(state.view === 'discernment' || state.view === 'result') && (
          <div className="border-t border-slate-50">
            <DiscernmentView />
          </div>
        )}

        {state.view === 'result' && (
          <div className="border-t border-slate-50">
            <ResultView />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default App;
