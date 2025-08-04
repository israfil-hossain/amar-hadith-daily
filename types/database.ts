export type UserRole = 'user' | 'moderator' | 'admin' | 'scholar';
export type HadithStatus = 'pending' | 'verified' | 'rejected';
export type ContributionStatus = 'pending' | 'approved' | 'rejected';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  username?: string;
  avatar_url?: string;
  role: UserRole;
  bio?: string;
  location?: string;
  website?: string;
  is_verified: boolean;
  streak_count: number;
  total_hadith_read: number;
  total_contributions: number;
  points: number;
  level: number;
  preferred_language: string;
  notification_settings: {
    email: boolean;
    push: boolean;
    prayer_reminders: boolean;
  };
  privacy_settings: {
    profile_public: boolean;
    progress_public: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface HadithBook {
  id: string;
  name_arabic: string;
  name_bangla: string;
  name_english?: string;
  name_urdu?: string;
  author_arabic?: string;
  author_bangla?: string;
  author_english?: string;
  description?: string;
  total_hadith: number;
  is_active: boolean;
  created_at: string;
}

export interface HadithCategory {
  id: string;
  name_arabic?: string;
  name_bangla: string;
  name_english?: string;
  name_urdu?: string;
  description?: string;
  icon?: string;
  color?: string;
  parent_id?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Hadith {
  id: string;
  hadith_number?: string;
  book_id?: string;
  category_id?: string;
  chapter_arabic?: string;
  chapter_bangla?: string;
  chapter_english?: string;
  text_arabic: string;
  text_bangla: string;
  text_english?: string;
  text_urdu?: string;
  narrator?: string;
  grade?: string;
  reference?: string;
  explanation?: string;
  keywords?: string[];
  difficulty_level: DifficultyLevel;
  status: HadithStatus;
  audio_url?: string;
  contributed_by?: string;
  verified_by?: string;
  verification_notes?: string;
  view_count: number;
  like_count: number;
  share_count: number;
  is_featured: boolean;
  is_daily_special: boolean;
  created_at: string;
  updated_at: string;
  
  // Relations
  book?: HadithBook;
  category?: HadithCategory;
  contributor?: Profile;
  verifier?: Profile;
}

export interface UserHadithInteraction {
  id: string;
  user_id: string;
  hadith_id: string;
  is_read: boolean;
  is_favorited: boolean;
  is_memorized: boolean;
  rating?: number;
  notes?: string;
  read_at?: string;
  favorited_at?: string;
  memorized_at?: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  user?: Profile;
  hadith?: Hadith;
}

export interface HadithContribution {
  id: string;
  contributor_id: string;
  hadith_data: any; // JSONB
  status: ContributionStatus;
  reviewer_id?: string;
  review_notes?: string;
  reviewed_at?: string;
  created_at: string;
  
  // Relations
  contributor?: Profile;
  reviewer?: Profile;
}

export interface HadithRating {
  id: string;
  user_id: string;
  hadith_id: string;
  translation_quality?: number;
  explanation_quality?: number;
  overall_rating?: number;
  comment?: string;
  created_at: string;
  
  // Relations
  user?: Profile;
  hadith?: Hadith;
}

export interface DailyHadithSchedule {
  id: string;
  date: string;
  hadith_ids: string[];
  theme?: string;
  special_occasion?: string;
  created_by?: string;
  created_at: string;
  
  // Relations
  creator?: Profile;
  hadith_list?: Hadith[];
}

export interface UserProgress {
  id: string;
  user_id: string;
  date: string;
  hadith_read_count: number;
  time_spent_minutes: number;
  streak_maintained: boolean;
  achievements_unlocked: string[];
  created_at: string;
  
  // Relations
  user?: Profile;
}

export interface Achievement {
  id: string;
  name_bangla: string;
  name_english?: string;
  description_bangla?: string;
  description_english?: string;
  icon?: string;
  badge_color?: string;
  criteria: any; // JSONB
  points_reward: number;
  is_active: boolean;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  
  // Relations
  user?: Profile;
  achievement?: Achievement;
}

export interface PrayerReminder {
  id: string;
  user_id: string;
  prayer_name: string;
  reminder_time: string;
  is_active: boolean;
  timezone: string;
  created_at: string;
  
  // Relations
  user?: Profile;
}

export interface UserCollection {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_public: boolean;
  hadith_ids: string[];
  created_at: string;
  updated_at: string;
  
  // Relations
  user?: Profile;
  hadith_list?: Hadith[];
}

export interface UserFollow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
  
  // Relations
  follower?: Profile;
  following?: Profile;
}

export interface Mosque {
  id: string;
  name: string;
  address?: string;
  city?: string;
  country: string;
  latitude?: number;
  longitude?: number;
  imam_name?: string;
  contact_phone?: string;
  contact_email?: string;
  website?: string;
  verified: boolean;
  created_at: string;
}

export interface UserMosqueConnection {
  id: string;
  user_id: string;
  mosque_id: string;
  role: string;
  joined_at: string;
  
  // Relations
  user?: Profile;
  mosque?: Mosque;
}

export interface ScholarQuestion {
  id: string;
  user_id: string;
  scholar_id?: string;
  question: string;
  answer?: string;
  is_public: boolean;
  status: string;
  answered_at?: string;
  created_at: string;
  
  // Relations
  user?: Profile;
  scholar?: Profile;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data?: any; // JSONB
  is_read: boolean;
  created_at: string;
  
  // Relations
  user?: Profile;
}

// Database type for Supabase
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      hadith_books: {
        Row: HadithBook;
        Insert: Omit<HadithBook, 'id' | 'created_at'>;
        Update: Partial<Omit<HadithBook, 'id' | 'created_at'>>;
      };
      hadith_categories: {
        Row: HadithCategory;
        Insert: Omit<HadithCategory, 'id' | 'created_at'>;
        Update: Partial<Omit<HadithCategory, 'id' | 'created_at'>>;
      };
      hadith: {
        Row: Hadith;
        Insert: Omit<Hadith, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Hadith, 'id' | 'created_at'>>;
      };
      user_hadith_interactions: {
        Row: UserHadithInteraction;
        Insert: Omit<UserHadithInteraction, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserHadithInteraction, 'id' | 'created_at'>>;
      };
      hadith_contributions: {
        Row: HadithContribution;
        Insert: Omit<HadithContribution, 'id' | 'created_at'>;
        Update: Partial<Omit<HadithContribution, 'id' | 'created_at'>>;
      };
      hadith_ratings: {
        Row: HadithRating;
        Insert: Omit<HadithRating, 'id' | 'created_at'>;
        Update: Partial<Omit<HadithRating, 'id' | 'created_at'>>;
      };
      daily_hadith_schedule: {
        Row: DailyHadithSchedule;
        Insert: Omit<DailyHadithSchedule, 'id' | 'created_at'>;
        Update: Partial<Omit<DailyHadithSchedule, 'id' | 'created_at'>>;
      };
      user_progress: {
        Row: UserProgress;
        Insert: Omit<UserProgress, 'id' | 'created_at'>;
        Update: Partial<Omit<UserProgress, 'id' | 'created_at'>>;
      };
      achievements: {
        Row: Achievement;
        Insert: Omit<Achievement, 'id' | 'created_at'>;
        Update: Partial<Omit<Achievement, 'id' | 'created_at'>>;
      };
      user_achievements: {
        Row: UserAchievement;
        Insert: Omit<UserAchievement, 'id'>;
        Update: Partial<UserAchievement>;
      };
      prayer_reminders: {
        Row: PrayerReminder;
        Insert: Omit<PrayerReminder, 'id' | 'created_at'>;
        Update: Partial<Omit<PrayerReminder, 'id' | 'created_at'>>;
      };
      user_collections: {
        Row: UserCollection;
        Insert: Omit<UserCollection, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserCollection, 'id' | 'created_at'>>;
      };
      user_follows: {
        Row: UserFollow;
        Insert: Omit<UserFollow, 'id' | 'created_at'>;
        Update: Partial<Omit<UserFollow, 'id' | 'created_at'>>;
      };
      mosques: {
        Row: Mosque;
        Insert: Omit<Mosque, 'id' | 'created_at'>;
        Update: Partial<Omit<Mosque, 'id' | 'created_at'>>;
      };
      user_mosque_connections: {
        Row: UserMosqueConnection;
        Insert: Omit<UserMosqueConnection, 'id'>;
        Update: Partial<UserMosqueConnection>;
      };
      scholar_questions: {
        Row: ScholarQuestion;
        Insert: Omit<ScholarQuestion, 'id' | 'created_at'>;
        Update: Partial<Omit<ScholarQuestion, 'id' | 'created_at'>>;
      };
      notifications: {
        Row: Notification;
        Insert: Omit<Notification, 'id' | 'created_at'>;
        Update: Partial<Omit<Notification, 'id' | 'created_at'>>;
      };
    };
  };
}
