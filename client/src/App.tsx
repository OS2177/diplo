import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from './lib/supabaseClient';
import AuthButton from './components/AuthButton';
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import CampaignPage from "@/pages/CampaignPage";
import CreateCampaign from "@/pages/CreateCampaign";
import IntegrityVote from "@/pages/IntegrityVote";
import ResultsPage from "@/pages/ResultsPage";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/not-found";

import NavBar from "./components/NavBar";

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      console.log('Initial user state:', user);
      setUser(user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <>
      <NavBar>
        <AuthButton user={user} setUser={setUser} />
      </NavBar>
      <Layout>
        <Switch>
          {/* Note: More specific routes should come before general routes */}
          <Route path="/campaign/:id" component={CampaignPage} />
          <Route path="/integrity-vote/:id" component={IntegrityVote} />
          <Route path="/results/:id" component={ResultsPage} />
          
          {/* More general routes come after specific ones */}
          <Route path="/campaigns" component={Home} />
          <Route path="/create-campaign" component={CreateCampaign} />
          <Route path="/results" component={ResultsPage} />
          <Route path="/dashboard" component={Dashboard} />
          
          {/* Home route should be last for proper wildcard matching */}
          <Route path="/" component={Home} />
          
          {/* Not found page as fallback */}
          <Route component={NotFound} />
        </Switch>
      </Layout>
      <Toaster />
    </>
  );
}

export default App;
