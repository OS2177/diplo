
import { useState } from 'react';
import { User } from '@supabase/supabase-js';

interface NewCampaignFormProps {
  user: User | null;
}

export default function NewCampaignForm({ user }: NewCampaignFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Submitted: ${title}`);
  };

  if (!user) {
    return <p className="text-neutral-600">Please log in to create a campaign.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Campaign Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <textarea
          placeholder="Campaign Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded h-32"
        />
      </div>
      <button 
        type="submit"
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
      >
        Create Campaign
      </button>
    </form>
  );
}
