
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from './lib/supabaseClient';
import NewCampaignForm from './components/NewCampaignForm';

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  return (
    <div>
      <h1>Diplo Prototype</h1>
      {user === null ? (
        <p>Loading...</p>
      ) : (
        <NewCampaignForm user={user} />
      )}
    </div>
  );
}

export default App;
