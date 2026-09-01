"use client";

import React, { useState } from "react";
import { GraduationCap, ChevronRight, Sparkles, BookOpen, Shield, Cpu, BarChart3, BrainCircuit, Check } from "lucide-react";
import { COURSE_CATEGORIES, CourseId } from "../providers/CourseProvider";

interface OnboardingCourseModalProps {
  isOpen: boolean;
  onComplete: (courseId: CourseId) => void;
}

export function OnboardingCourseModal({ isOpen, onComplete }: OnboardingCourseModalProps) {
  const [selected, setSelected] = useState<CourseId | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fadeIn">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      {/* Modal */}
      <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0c0c18]/95 p-8 shadow-2xl backdrop-blur-2xl z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center rounded-2xl bg-cyan-400/15 p-4 mb-4">
            <GraduationCap size={32} className="text-cyan-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Choose Your Course
          </h2>
          <p className="text-sm text-white/40 mt-2 max-w-md mx-auto">
            Select your board or course so we can tailor quizzes, assessments, and AI recommendations to your curriculum.
          </p>
        </div>

        {/* Course Categories */}
        <div className="space-y-6">
          {COURSE_CATEGORIES.map((category) => (
            <div key={category.label}>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-white/30 mb-3 flex items-center gap-2">
                {category.label === "School Boards" ? <BookOpen size={12} /> : <BrainCircuit size={12} />}
                {category.label}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {category.courses.map((course) => (
                  <button
                    key={course.id}
                    type="button"
                    onClick={() => setSelected(course.id)}
                    className={`group relative flex flex-col items-center gap-2 rounded-2xl border p-4 sm:p-5 text-center transition-all duration-200 cursor-pointer ${
                      selected === course.id
                        ? "border-cyan-400/60 bg-cyan-400/15 shadow-lg shadow-cyan-400/10"
                        : "border-white/10 bg-white/3 hover:border-white/25 hover:bg-white/6"
                    }`}
                  >
                    {/* Selection check */}
                    {selected === course.id && (
                      <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400 text-[#05050f]">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                    <span className="text-2xl">{course.icon}</span>
                    <span className={`text-xs sm:text-sm font-semibold ${selected === course.id ? "text-cyan-400" : "text-white/70 group-hover:text-white"}`}>
                      {course.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => selected && onComplete(selected)}
            disabled={!selected}
            className="flex items-center gap-2 rounded-2xl bg-cyan-400 px-8 py-3.5 text-sm font-bold text-[#05050f] transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-400/30 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
          >
            <Sparkles size={16} />
            <span>Continue to Dashboard</span>
            <ChevronRight size={16} />
          </button>
        </div>

        <p className="text-center text-[10px] text-white/20 mt-4">
          You can change this later from your profile settings.
        </p>
      </div>
    </div>
  );
}
