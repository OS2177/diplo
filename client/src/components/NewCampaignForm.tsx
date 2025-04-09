
import { useState } from 'react';
import { User } from '@supabase/supabase-js';

interface NewCampaignFormProps {
  user: User | null;
}

export default function NewCampaignForm({ user }: NewCampaignFormProps) {
  const [title, setTitle] = useState('');

  if (!user) return <p>Please log in to create a campaign.</p>;

  return (
    <form 
      onSubmit={(e) => { 
        e.preventDefault(); 
        alert('Submitted: ' + title);
      }}
      className="space-y-4"
    >
      <input
        type="text"
        placeholder="Campaign Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button 
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Submit
      </button>
    </form>
  );
}
