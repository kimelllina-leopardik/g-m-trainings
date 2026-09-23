export type BrandType = 'G&M Общий' | 'La Cité' | 'GEOX' | 'Yves Rocher';

export type StoreLocation =
  | 'Душанбе — Сиёма Молл'
  | 'Душанбе — ТЦ Душанбе Молл'
  | 'Душанбе — пр. Рудаки'
  | 'Душанбе — ул. Айни'
  | 'Душанбе — Онлайн-бутик lacite.tj'
  | 'Душанбе — Монобутик Yves Rocher'
  | 'Душанбе — Монобутик GEOX'
  | 'Худжанд — Бутик La Cité';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'employee' | 'super_admin';
  brand: BrandType;
  storeLocation: StoreLocation;
  points: number;
  badges: string[];
  avatar?: string;
  phone?: string;
  joinedDate: string;
}

export interface CourseSlide {
  id: string;
  title: string;
  badge: string;
  contentMarkdown: string;
  keyPoints: string[];
  practicalCase?: {
    scenario: string;
    recommendedAction: string;
    wrongAction?: string;
  };
}

export interface Flashcard {
  id: string;
  category: string;
  front: string;
  back: string;
  proTip?: string;
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctOptionIds: string[]; // Supports multiple choice
  explanation: string;
  isMultipleChoice?: boolean;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  brand: BrandType;
  category: string;
  durationMinutes: number;
  passThresholdPercent: number; // default 85%
  pointsReward: number;
  badgeId: string;
  badgeTitle: string;
  slides: CourseSlide[];
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
}

export interface UserCourseProgress {
  userId: string;
  courseId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed_cooldown';
  completedSlideIds: string[];
  masteredFlashcardIds: string[];
  attemptsCount: number;
  lastScorePercent: number;
  passed: boolean;
  lastAttemptAt?: string;
  nextAttemptAvailableAt?: string; // Cooldown 1 day (24 hours) if failed
  completedAt?: string;
}

export interface Certificate {
  certificateId: string;
  userId: string;
  userName: string;
  userBrand: BrandType;
  storeLocation: StoreLocation;
  courseId: string;
  courseTitle: string;
  courseBrand: BrandType;
  scorePercent: number;
  issuedAt: string;
  qrVerificationCode: string;
}

export interface BadgeInfo {
  id: string;
  title: string;
  description: string;
  brand: BrandType;
  iconName: string;
}
