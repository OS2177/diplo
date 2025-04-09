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
    console.log('Form submitted:', { title, description });
    // Add your form submission logic here (e.g., API call)
  };

  if (!user) return <p>Please log in to create a campaign.</p>;

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
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Create Campaign
      </button>
    </form>
  );
}