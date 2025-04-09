
import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import NewCampaignForm from '@/components/NewCampaignForm';
import { User } from '@supabase/supabase-js';

export default function CreateCampaign() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="px-4 py-6 md:p-8">
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-neutral-800">
          Create a Campaign
        </h1>
        <p className="mt-3 text-lg text-neutral-600 max-w-3xl">
          Submit your campaign proposal. All campaigns will be reviewed before going live.
        </p>
      </motion.div>

      <div className="max-w-2xl">
        <NewCampaignForm user={user} />
      </div>
    </div>
  );
}
