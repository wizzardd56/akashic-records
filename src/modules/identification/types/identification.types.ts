/**
 * Type definitions for AI Competency Mapping & India's Official Statistical System indicators.
 */

export type CompetencyCategory =
    | "statistical_core"
    | "mospi_domain"
    | "digital_analytics"
    | "governance_policy";

export type GapSeverity = "low" | "moderate" | "critical";

export interface SkillItem {
    id: string;
    name: string;
    category: CompetencyCategory;
    currentLevel: number; // 0 - 100
    requiredLevel: number; // 0 - 100
    gap: number; // calculated delta
    severity: GapSeverity;
    officialIndicator: string; // e.g. "NSSO / PLFS Survey Standards"
    description: string;
}

export interface LearningMilestone {
    id: string;
    stepNumber: number;
    title: string;
    provider: "iGOT Karmayogi" | "Akashic AI Lab" | "MoSPI Training Unit";
    duration: string;
    level: "Foundation" | "Intermediate" | "Advanced";
    skillsTargeted: string[];
    completed: boolean;
    scoreYield: number; // Proficiency boost (+15%)
    courseUrl?: string;
}

export interface UserCompetencyProfile {
    userName: string;
    role: "Statistical Officer (MoSPI)" | "Data Analyst Trainee" | "Academic Researcher";
    overallReadiness: number; // 0 - 100 percentage
    competenciesAnalyzed: number;
    gapsIdentified: number;
    iGotHoursRecommended: number;
    skills: SkillItem[];
    learningRoadmap: LearningMilestone[];
}