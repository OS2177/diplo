
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from './lib/supabaseClient';
import NewCampaignForm from './components/NewCampaignForm';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
      } else {
        setUser(data.user);
      }
      setLoading(false);
    };

    getUser();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Diplo Prototype</h1>

      {loading ? (
        <p>Loading user...</p>
      ) : user ? (
        <NewCampaignForm user={user} />
      ) : (
        <p>Please log in to create a campaign.</p>
      )}
    </div>
  );
}

export default App;
