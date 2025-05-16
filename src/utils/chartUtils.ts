// src/utils/chartUtils.ts

export type VoteData = {
  created_at: string; // used by Supabase
  choice: 'yes' | 'no';
  impact?: number;
  integrity?: number;
  proximity?: number;
};

export type ChartPoint = {
  time: string;
  yesCount: number;
  noCount: number;
};

export function groupVotesByTime(votes: VoteData[], interval: 'hour' | 'day' = 'hour'): ChartPoint[] {
  const buckets: { [key: string]: { yesCount: number; noCount: number } } = {};

  votes.forEach((vote) => {
    const date = new Date(vote.created_at);
    const bucketKey =
      interval === 'day'
        ? date.toISOString().slice(0, 10) // YYYY-MM-DD
        : `${String(date.getHours()).padStart(2, '0')}:00 ${date.toISOString().slice(0, 10)}`;

    if (!buckets[bucketKey]) {
      buckets[bucketKey] = { yesCount: 0, noCount: 0 };
    }

    if (vote.choice === 'yes') {
      buckets[bucketKey].yesCount += 1;
    } else {
      buckets[bucketKey].noCount += 1;
    }
  });

  return Object.entries(buckets).map(([time, counts]) => ({
    time,
    ...counts,
  }));
}

export function calculateAverageImpact(votes: VoteData[]): number {
  if (votes.length === 0) return 0;
  const total = votes.reduce((sum, vote) => sum + (vote.impact || 0), 0);
  return parseFloat((total / votes.length).toFixed(2));
}

export function formatTimestamp(ts: string): string {
  const date = new Date(ts);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}
