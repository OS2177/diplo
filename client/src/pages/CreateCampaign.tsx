
import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import NewCampaignForm from '@/components/NewCampaignForm';
import { User } from '@supabase/supabase-js';

export default function CreateCampaign() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="px-4 py-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold">Create New Campaign</h1>
        <p className="text-neutral-600">Start a new campaign and engage with your audience.</p>
      </motion.div>

      <div className="max-w-2xl">
        <NewCampaignForm user={user} />
      </div>
    </div>
  );
}
