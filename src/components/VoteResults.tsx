import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function VoteResults({ campaignId }) {
  const [yesCount, setYesCount] = useState(0);
  const [noCount, setNoCount] = useState(0);

  useEffect(() => {
    const fetchVotes = async () => {
      const { data, error } = await supabase
        .from('votes')
        .select('choice')
        .eq('campaign_id', campaignId);

      if (error) {
        console.error('Vote fetch error:', error);
        return;
      }

      const yesVotes = data.filter((v) => v.choice === 'yes').length;
      const noVotes = data.filter((v) => v.choice === 'no').length;

      setYesCount(yesVotes);
      setNoCount(noVotes);
    };

    fetchVotes();

    const voteSubscription = supabase
      .channel('public:votes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'votes' },
        (payload) => {
          if (payload.new.campaign_id === campaignId) {
            if (payload.new.choice === 'yes') setYesCount((c) => c + 1);
            else if (payload.new.choice === 'no') setNoCount((c) => c + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(voteSubscription);
    };
  }, [campaignId]);

  return (
    <div className="mt-8 p-4 border rounded shadow-sm">
      <h3 className="text-xl font-semibold mb-2">Live Vote Results</h3>
      <div className="flex gap-6">
        <div className="text-green-600 font-bold">YES: {yesCount}</div>
        <div className="text-red-600 font-bold">NO: {noCount}</div>
      </div>
    </div>
  );
}
