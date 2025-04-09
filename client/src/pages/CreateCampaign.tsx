import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import NewCampaignForm from '@/components/NewCampaignForm';

export default function CreateCampaign() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="p-4">
        <p>Please log in to create a campaign.</p>
      </div>
    );
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