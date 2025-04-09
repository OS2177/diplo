import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '../lib/supabaseClient';
import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  image: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  scope: z.enum(["personal", "social", "local", "global", "ecological"]),
  region: z.string().min(3, "Region must be at least 3 characters"),
});

type FormValues = z.infer<typeof formSchema>;

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