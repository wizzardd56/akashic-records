import { create } from "zustand";
import { UserCompetencyProfile, CompetencyCategory } from "../types/identification.types";

interface IdentificationState {
    profile: UserCompetencyProfile;
    selectedCategory: "all" | CompetencyCategory;
    setSelectedCategory: (category: "all" | CompetencyCategory) => void;
    toggleMilestoneComplete: (milestoneId: string) => void;
    reassessCompetencies: () => void;
}

const initialProfile: UserCompetencyProfile = {
    userName: "Govt. Officer / Analyst",
    role: "Statistical Officer (MoSPI)",
    overallReadiness: 68,
    competenciesAnalyzed: 14,
    gapsIdentified: 4,
    iGotHoursRecommended: 28,
    skills: [
        {
            id: "stat-1",
            name: "Sample Survey Design & Stratification",
            category: "statistical_core",
            currentLevel: 82,
            requiredLevel: 90,
            gap: 8,
            severity: "low",
            officialIndicator: "NSSO Round Protocols & Multi-stage Sampling",
            description: "Application of sampling weights, cluster allocation, and sampling variance computation.",
        },
        {
            id: "stat-2",
            name: "Macroeconomic Price Indices (CPI / IIP)",
            category: "mospi_domain",
            currentLevel: 54,
            requiredLevel: 85,
            gap: 31,
            severity: "critical",
            officialIndicator: "Consumer Price Index & Index of Industrial Production Revision Series",
            description: "Basket weighting revisions, geometric mean aggregation, and handling missing item imputations.",
        },
        {
            id: "stat-3",
            name: "National Accounts Statistics & GVA Estimation",
            category: "mospi_domain",
            currentLevel: 62,
            requiredLevel: 88,
            gap: 26,
            severity: "moderate",
            officialIndicator: "System of National Accounts (SNA 2008 / NAS Guidelines)",
            description: "Gross Value Added (GVA) compilation, supply-use tables, and informal sector estimation models.",
        },
        {
            id: "stat-4",
            name: "Automated Data Pipelines in R / Python",
            category: "digital_analytics",
            currentLevel: 45,
            requiredLevel: 80,
            gap: 35,
            severity: "critical",
            officialIndicator: "Big Data & High-frequency Indicators Integration",
            description: "Scraping, automated data harmonization, and real-time validation checks for official releases.",
        },
        {
            id: "stat-5",
            name: "Statistical Governance & Data Quality Ethics",
            category: "governance_policy",
            currentLevel: 78,
            requiredLevel: 85,
            gap: 7,
            severity: "low",
            officialIndicator: "UN Fundamental Principles of Official Statistics & National Data Sharing Policy",
            description: "Data privacy protocols, institutional disclosure control, and dissemination metadata compliance.",
        },
    ],
    learningRoadmap: [
        {
            id: "mile-1",
            stepNumber: 1,
            title: "Advanced IIP & Price Index Computation Protocols",
            provider: "iGOT Karmayogi",
            duration: "6 Hours",
            level: "Intermediate",
            skillsTargeted: ["Macroeconomic Price Indices (CPI / IIP)"],
            completed: true,
            scoreYield: 15,
        },
        {
            id: "mile-2",
            stepNumber: 2,
            title: "Automated Data Cleaning & Imputation with Python",
            provider: "Akashic AI Lab",
            duration: "8 Hours",
            level: "Intermediate",
            skillsTargeted: ["Automated Data Pipelines in R / Python"],
            completed: false,
            scoreYield: 20,
        },
        {
            id: "mile-3",
            stepNumber: 3,
            title: "GVA Modeling & Informal Economy Estimation Frameworks",
            provider: "MoSPI Training Unit",
            duration: "10 Hours",
            level: "Advanced",
            skillsTargeted: ["National Accounts Statistics & GVA Estimation"],
            completed: false,
            scoreYield: 25,
        },
        {
            id: "mile-4",
            stepNumber: 4,
            title: "Data Confidentiality, Metadata Standards & Public Dissemination",
            provider: "iGOT Karmayogi",
            duration: "4 Hours",
            level: "Foundation",
            skillsTargeted: ["Statistical Governance & Data Quality Ethics"],
            completed: false,
            scoreYield: 10,
        },
    ],
};

export const useIdentificationStore = create<IdentificationState>((set) => ({
    profile: initialProfile,
    selectedCategory: "all",
    setSelectedCategory: (category) => set({ selectedCategory: category }),
    toggleMilestoneComplete: (milestoneId) =>
        set((state) => {
            const updatedRoadmap = state.profile.learningRoadmap.map((m) =>
                m.id === milestoneId ? { ...m, completed: !m.completed } : m
            );
            const completedCount = updatedRoadmap.filter((m) => m.completed).length;
            const newReadiness = Math.min(
                100,
                Math.round(60 + (completedCount / updatedRoadmap.length) * 40)
            );

            return {
                profile: {
                    ...state.profile,
                    overallReadiness: newReadiness,
                    learningRoadmap: updatedRoadmap,
                },
            };
        }),
    reassessCompetencies: () =>
        set((state) => ({
            profile: {
                ...state.profile,
                overallReadiness: Math.min(100, state.profile.overallReadiness + 5),
            },
        })),
}));