/**
 * Shared type definitions used across all modules.
 */

/** Standard API response envelope */
export interface ApiResponse<T = unknown> {
    success: boolean;
    data: T;
    message?: string;
    errors?: Record<string, string[]>;
}

/** Pagination metadata */
export interface PaginationMeta {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

/** User role for branching onboarding */
export type UserRole = "student" | "government_official" | "guest";

/** Navigation item structure */
export interface NavItem {
    label: string;
    href: string;
    icon?: string;
    requiresAuth?: boolean;
}