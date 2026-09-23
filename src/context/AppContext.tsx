import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  Course,
  UserCourseProgress,
  Certificate,
  BrandType,
  StoreLocation,
} from '../types';
import { COURSES_DATA } from '../data/coursesData';
import { INITIAL_USERS, INITIAL_PROGRESS, INITIAL_CERTIFICATES } from '../data/initialUsers';

interface AppContextType {
  currentUser: User;
  allUsers: User[];
  courses: Course[];
  progress: Record<string, UserCourseProgress>;
  certificates: Certificate[];
  theme: 'light' | 'dark';
  activeTab: 'courses' | 'certificates' | 'leaderboard' | 'admin';
  selectedCourseId: string | null;
  toggleTheme: () => void;
  setActiveTab: (tab: 'courses' | 'certificates' | 'leaderboard' | 'admin') => void;
  setSelectedCourseId: (id: string | null) => void;
  loginUser: (email: string) => boolean;
  registerUser: (data: {
    fullName: string;
    email: string;
    brand: BrandType;
    storeLocation: StoreLocation;
    phone?: string;
  }) => User;
  switchUser: (userId: string) => void;
  markSlideCompleted: (courseId: string, slideId: string) => void;
  toggleFlashcardMastered: (courseId: string, cardId: string) => void;
  submitQuiz: (
    courseId: string,
    answers: Record<string, string[]>
  ) => {
    scorePercent: number;
    passed: boolean;
    certificate?: Certificate;
    nextAttemptAvailableAt?: string;
  };
  getCourseProgress: (courseId: string, userId?: string) => UserCourseProgress | undefined;
  getUserCertificates: (userId?: string) => Certificate[];
  findCertificate: (certId: string) => Certificate | undefined;
  resetCourseCooldown: (userId: string, courseId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_USER = 'gm_lms_active_user';
const STORAGE_KEY_ALL_USERS = 'gm_lms_all_users';
const STORAGE_KEY_PROGRESS = 'gm_lms_progress';
const STORAGE_KEY_CERTS = 'gm_lms_certificates';
const STORAGE_KEY_THEME = 'gm_lms_theme';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme initialization
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light'; // Default clean corporate light theme
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Users State
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ALL_USERS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse users', e);
      }
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedId = localStorage.getItem(STORAGE_KEY_USER);
    if (savedId) {
      const found = allUsers.find((u) => u.id === savedId);
      if (found) return found;
    }
    // Default to Super Admin for immediate rich view, or first employee
    return allUsers[0];
  });

  // Progress State
  const [progress, setProgress] = useState<Record<string, UserCourseProgress>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PROGRESS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse progress', e);
      }
    }
    return INITIAL_PROGRESS;
  });

  // Certificates State
  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CERTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse certs', e);
      }
    }
    return INITIAL_CERTIFICATES;
  });

  const [activeTab, setActiveTab] = useState<'courses' | 'certificates' | 'leaderboard' | 'admin'>('courses');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ALL_USERS, JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USER, currentUser.id);
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CERTS, JSON.stringify(certificates));
  }, [certificates]);

  const switchUser = (userId: string) => {
    const target = allUsers.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
      setSelectedCourseId(null);
    }
  };

  const loginUser = (email: string): boolean => {
    const target = allUsers.find((u) => u.email.trim().toLowerCase() === email.trim().toLowerCase());
    if (target) {
      setCurrentUser(target);
      return true;
    }
    return false;
  };

  const registerUser = (data: {
    fullName: string;
    email: string;
    brand: BrandType;
    storeLocation: StoreLocation;
    phone?: string;
  }): User => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      fullName: data.fullName,
      email: data.email,
      role: 'employee',
      brand: data.brand,
      storeLocation: data.storeLocation,
      points: 0,
      badges: [],
      phone: data.phone || '',
      joinedDate: new Date().toISOString().split('T')[0],
    };

    setAllUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    return newUser;
  };

  const getProgressKey = (userId: string, courseId: string) => `${userId}_${courseId}`;

  const getCourseProgress = (courseId: string, userId?: string) => {
    const uid = userId || currentUser.id;
    return progress[getProgressKey(uid, courseId)];
  };

  const markSlideCompleted = (courseId: string, slideId: string) => {
    const key = getProgressKey(currentUser.id, courseId);
    setProgress((prev) => {
      const current = prev[key] || {
        userId: currentUser.id,
        courseId,
        status: 'in_progress',
        completedSlideIds: [],
        masteredFlashcardIds: [],
        attemptsCount: 0,
        lastScorePercent: 0,
        passed: false,
      };

      if (!current.completedSlideIds.includes(slideId)) {
        const updatedSlides = [...current.completedSlideIds, slideId];
        return {
          ...prev,
          [key]: {
            ...current,
            status: current.passed ? 'completed' : 'in_progress',
            completedSlideIds: updatedSlides,
          },
        };
      }
      return prev;
    });
  };

  const toggleFlashcardMastered = (courseId: string, cardId: string) => {
    const key = getProgressKey(currentUser.id, courseId);
    setProgress((prev) => {
      const current = prev[key] || {
        userId: currentUser.id,
        courseId,
        status: 'in_progress',
        completedSlideIds: [],
        masteredFlashcardIds: [],
        attemptsCount: 0,
        lastScorePercent: 0,
        passed: false,
      };

      const exists = current.masteredFlashcardIds.includes(cardId);
      const updated = exists
        ? current.masteredFlashcardIds.filter((id) => id !== cardId)
        : [...current.masteredFlashcardIds, cardId];

      return {
        ...prev,
        [key]: {
          ...current,
          masteredFlashcardIds: updated,
        },
      };
    });
  };

  const submitQuiz = (
    courseId: string,
    answers: Record<string, string[]>
  ): {
    scorePercent: number;
    passed: boolean;
    certificate?: Certificate;
    nextAttemptAvailableAt?: string;
  } => {
    const course = COURSES_DATA.find((c) => c.id === courseId);
    if (!course) return { scorePercent: 0, passed: false };

    let totalScore = 0;
    course.quiz.forEach((q) => {
      const userSelected = (answers[q.id] || []).sort();
      const correct = [...q.correctOptionIds].sort();
      // Exact array match for multiple choice
      if (
        userSelected.length === correct.length &&
        userSelected.every((val, idx) => val === correct[idx])
      ) {
        totalScore += 1;
      }
    });

    const scorePercent = Math.round((totalScore / course.quiz.length) * 100);
    const passed = scorePercent >= course.passThresholdPercent;
    const key = getProgressKey(currentUser.id, courseId);
    const existing = progress[key];
    const attemptsCount = (existing?.attemptsCount || 0) + 1;

    let newCertificate: Certificate | undefined = undefined;
    let nextAttemptAvailableAt: string | undefined = undefined;

    if (passed) {
      // Confetti celebration
      try {
        confetti({
          particleCount: 110,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#10B981', '#1E3A8A', '#F59E0B'],
        });
      } catch (e) {
        console.error('Confetti error', e);
      }

      // Generate certificate if not already created
      const existingCert = certificates.find(
        (c) => c.userId === currentUser.id && c.courseId === courseId
      );

      if (!existingCert) {
        const brandCode =
          course.brand === 'La Cité'
            ? 'LC'
            : course.brand === 'GEOX'
            ? 'GX'
            : course.brand === 'Yves Rocher'
            ? 'YR'
            : 'GM';
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const certId = `GM-${brandCode}-2026-${randomNum}`;

        newCertificate = {
          certificateId: certId,
          userId: currentUser.id,
          userName: currentUser.fullName,
          userBrand: currentUser.brand,
          storeLocation: currentUser.storeLocation,
          courseId: course.id,
          courseTitle: course.title,
          courseBrand: course.brand,
          scorePercent,
          issuedAt: new Date().toISOString().split('T')[0],
          qrVerificationCode: certId,
        };

        setCertificates((prev) => [newCertificate!, ...prev]);

        // Award points and badge to user
        setAllUsers((prev) =>
          prev.map((u) => {
            if (u.id === currentUser.id) {
              const updatedBadges = u.badges.includes(course.badgeId)
                ? u.badges
                : [...u.badges, course.badgeId];
              return {
                ...u,
                points: u.points + course.pointsReward,
                badges: updatedBadges,
              };
            }
            return u;
          })
        );

        setCurrentUser((prev) => ({
          ...prev,
          points: prev.points + course.pointsReward,
          badges: prev.badges.includes(course.badgeId)
            ? prev.badges
            : [...prev.badges, course.badgeId],
        }));
      } else {
        newCertificate = existingCert;
      }
    } else {
      // Failed - set 1 day (24h) cooldown
      const cooldownDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      nextAttemptAvailableAt = cooldownDate.toISOString();
    }

    setProgress((prev) => ({
      ...prev,
      [key]: {
        userId: currentUser.id,
        courseId,
        status: passed ? 'completed' : 'failed_cooldown',
        completedSlideIds: existing?.completedSlideIds || [],
        masteredFlashcardIds: existing?.masteredFlashcardIds || [],
        attemptsCount,
        lastScorePercent: scorePercent,
        passed,
        lastAttemptAt: new Date().toISOString(),
        completedAt: passed ? new Date().toISOString() : existing?.completedAt,
        nextAttemptAvailableAt: passed ? undefined : nextAttemptAvailableAt,
      },
    }));

    return {
      scorePercent,
      passed,
      certificate: newCertificate,
      nextAttemptAvailableAt,
    };
  };

  const getUserCertificates = (userId?: string) => {
    const uid = userId || currentUser.id;
    return certificates.filter((c) => c.userId === uid);
  };

  const findCertificate = (certId: string) => {
    const cleaned = certId.trim().toUpperCase();
    return certificates.find(
      (c) => c.certificateId.toUpperCase() === cleaned || c.qrVerificationCode.toUpperCase() === cleaned
    );
  };

  const resetCourseCooldown = (userId: string, courseId: string) => {
    const key = getProgressKey(userId, courseId);
    setProgress((prev) => {
      const cur = prev[key];
      if (!cur) return prev;
      return {
        ...prev,
        [key]: {
          ...cur,
          status: 'in_progress',
          nextAttemptAvailableAt: undefined,
        },
      };
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers,
        courses: COURSES_DATA,
        progress,
        certificates,
        theme,
        activeTab,
        selectedCourseId,
        toggleTheme,
        setActiveTab,
        setSelectedCourseId,
        loginUser,
        registerUser,
        switchUser,
        markSlideCompleted,
        toggleFlashcardMastered,
        submitQuiz,
        getCourseProgress,
        getUserCertificates,
        findCertificate,
        resetCourseCooldown,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
