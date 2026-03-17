import React, { useEffect } from 'react';
import { useAppState } from './context/AppContext';
import { ACTIONS } from './context/appReducer';
import { useRouting } from './hooks/useRouting';
import { api } from './services/api';
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
import PrivacyView from './components/privacy/PrivacyView';
import LimitBanner from './components/ui/LimitBanner';

function App() {
  const { state, dispatch } = useAppState();

  useRouting();

  // Scroll to top on page refresh
  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  // Fetch usage on mount (works for both anonymous and logged-in users)
  useEffect(() => {
    api.getUsage()
      .then((data) => dispatch({ type: ACTIONS.SET_USAGE, payload: data }))
      .catch(() => {});
  }, []);

  return (
    <div className={`min-h-screen flex flex-col font-sans bg-white text-slate-900 ${state.dir === 'rtl' ? 'rtl' : 'ltr'}`}>
      <Navbar />
      <div className="flex-grow pt-20 relative z-0">
        {state.view !== 'about' && state.view !== 'prompts' && state.view !== 'pricing' && state.view !== 'account' && state.view !== 'contact' && state.view !== 'forum' && state.view !== 'terms' && state.view !== 'privacy' && state.view !== 'compass' && <HomeView />}

        {state.view === 'about' && <AboutView />}

        {state.view === 'prompts' && <PromptEditorView />}

        {state.view === 'pricing' && <PricingView />}

        {state.view === 'account' && <AccountView />}

        {state.view === 'contact' && <ContactView />}

        {state.view === 'forum' && <ForumView />}

        {state.view === 'terms' && <TermsView />}

        {state.view === 'compass' && <CompassView />}

        {state.view === 'privacy' && <PrivacyView />}

        {(state.view === 'discernment' || state.view === 'result') && state.filterCount > 0 && (
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
      <LimitBanner />
    </div>
  );
}

export default App;
