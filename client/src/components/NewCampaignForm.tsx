import { useState } from 'react';

export default function NewCampaignForm({ user }: { user: any }) {
  const [title, setTitle] = useState('');

  if (!user) return <p>Please log in to create a campaign.</p>;

  return (
    <form onSubmit={(e) => { e.preventDefault(); alert('Submitted!'); }}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
}