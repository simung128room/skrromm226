export type RankCategory = 'Bronze' | 'Silver' | 'Crystal' | 'Elite' | 'Master' | 'Legend';

export interface Student {
  id: string;
  no: number;
  name: string;
  points: number;
  rank: RankCategory;
  role: 'Student' | 'Leader' | 'Deputy' | 'Teacher';
  streak: number;
}

export type ActiveTab = 'dashboard' | 'duty' | 'leaderboard' | 'forms';
