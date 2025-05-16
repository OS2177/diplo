import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface Campaign {
  id: string;
  title: string;
  description: string;
  scope: string;
  created_at: string;
  image?: string;
}

/**
 * Fetches only approved campaigns sorted by newest first.
 */
export function useCampaigns(): Campaign[] {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('id, title, description, scope, created_at, image')
        .eq('status', 'approved') // ✅ Filter for approved campaigns only
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading campaigns:', error);
      } else {
        setCampaigns(data);
      }
    })();
  }, []);

  return campaigns;
}
