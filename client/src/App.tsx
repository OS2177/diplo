import { useEffect, useState } from 'react';
import { Route, Switch } from 'wouter';
import { User } from '@supabase/supabase-js';
import { supabase } from './lib/supabaseClient';
import Layout from './components/Layout';
import Home from './pages/Home';
import CreateCampaign from './pages/CreateCampaign';
import CampaignDetail from './pages/CampaignDetail';
import Profile from './pages/Profile';
import { Toaster } from "@/components/ui/toaster";


export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <Layout user={user}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/create" component={CreateCampaign} />
          <Route path="/campaign/:id" component={CampaignDetail} />
          <Route path="/profile" component={Profile} />
        </Switch>
      </Layout>
      <Toaster />
    </>
  );
}