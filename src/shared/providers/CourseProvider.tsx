"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

/* ------------------------------------------------------------------ */
/*  Course / Board definitions                                         */
/* ------------------------------------------------------------------ */
export const COURSE_CATEGORIES = [
  {
    label: "School Boards",
    courses: [
      { id: "10th-board", name: "10th Board", icon: "📚" },
      { id: "12th-board", name: "12th Board", icon: "🎓" },
    ],
  },
  {
    label: "College Courses",
    courses: [
      { id: "bca", name: "BCA", icon: "💻" },
      { id: "bca-ai-ml", name: "BCA AI-ML", icon: "🤖" },
      { id: "cybersecurity", name: "Cybersecurity", icon: "🔒" },
      { id: "btech-it", name: "BTech IT", icon: "⚡" },
      { id: "cs", name: "Computer Science (CS)", icon: "🖥️" },
      { id: "data-science", name: "Data Science", icon: "📊" },
    ],
  },
] as const;

export type CourseId = (typeof COURSE_CATEGORIES)[number]["courses"][number]["id"];

interface CourseContextType {
  selectedCourse: CourseId | null;
  setCourse: (id: CourseId) => void;
  hasOnboarded: boolean;
  completeOnboarding: (id: CourseId) => void;
}

const CourseContext = createContext<CourseContextType>({
  selectedCourse: null,
  setCourse: () => {},
  hasOnboarded: false,
  completeOnboarding: () => {},
});

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const [selectedCourse, setSelectedCourse] = useState<CourseId | null>(null);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("akashic_course") as CourseId | null;
    const onboarded = localStorage.getItem("akashic_onboarded");
    if (saved) setSelectedCourse(saved);
    if (onboarded === "true") setHasOnboarded(true);
  }, []);

  const setCourse = useCallback((id: CourseId) => {
    setSelectedCourse(id);
    localStorage.setItem("akashic_course", id);
  }, []);

  const completeOnboarding = useCallback((id: CourseId) => {
    setCourse(id);
    setHasOnboarded(true);
    localStorage.setItem("akashic_onboarded", "true");
  }, [setCourse]);

  return (
    <CourseContext.Provider value={{ selectedCourse, setCourse, hasOnboarded, completeOnboarding }}>
      {children}
    </CourseContext.Provider>
  );
}

export function useCourse() {
  return useContext(CourseContext);
}

/** Get a human-readable label for a course ID */
export function getCourseLabel(id: CourseId | null): string {
  if (!id) return "General";
  for (const cat of COURSE_CATEGORIES) {
    for (const c of cat.courses) {
      if (c.id === id) return c.name;
    }
  }
  return "General";
}
