
export type Vote = {
  id: string;
  campaign_id: string;
  user_id: string;
  choice: string;
  latitude: number;
  longitude: number;
  impact: number;
  created_at: string;
};
