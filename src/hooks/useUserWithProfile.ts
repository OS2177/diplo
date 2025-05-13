import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

interface Profile {
  id: string;
  name?: string;
  email?: string;
  city?: string;
  country?: string;
  age?: string;
  gender?: string;
  bio?: string;
  location_permission?: boolean;
  two_factor_enabled?: boolean;
  blockchain_id?: string;
  community_verified?: boolean;
}

interface UseUserWithProfileResult {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
}

export function useUserWithProfile(): UseUserWithProfileResult {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAndCreateProfileIfNeeded = async (currentUser: User) => {
    console.log('🔍 Fetching profile for user:', currentUser.id);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', currentUser.id)
      .single();

    if (error) {
      console.warn('⚠️ Profile fetch error:', error);
      if (error.code === 'PGRST116') {
        console.log('🆕 No profile found. Creating new one...');
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{ id: currentUser.id, email: currentUser.email }]);

        if (insertError) {
          console.error('❌ Failed to auto-create profile:', insertError);
        } else {
          console.log('✅ Auto-created profile for user:', currentUser.id);
        }

        return { id: currentUser.id, email: currentUser.email };
      } else {
        console.error('❌ Unexpected profile fetch error:', error);
        return null;
      }
    }

    console.log('✅ Profile found:', data);
    return data ?? null;
  };

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const currentUser = data.session?.user ?? null;
      console.log('🔐 Supabase session result:', currentUser);
      setUser(currentUser);

      if (currentUser) {
        const profile = await fetchAndCreateProfileIfNeeded(currentUser);
        setProfile(profile);
      }

      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      console.log('🔁 Auth state changed. New user:', currentUser);
      setUser(currentUser);

      if (currentUser) {
        const profile = await fetchAndCreateProfileIfNeeded(currentUser);
        setProfile(profile);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return { user, profile, loading };
}
