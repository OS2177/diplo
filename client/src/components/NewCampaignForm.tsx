
import { useState } from 'react';
import { User } from '@supabase/supabase-js';

interface NewCampaignFormProps {
  user: User | null;
}

export default function NewCampaignForm({ user }: NewCampaignFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
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
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <textarea
          placeholder="Campaign Description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
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
