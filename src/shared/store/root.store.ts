/**
 * Root Zustand Store — Foundation
 *
 * Uses the slice pattern so each module can add its own slice
 * without modifying this file. For now, only the UI slice exists.
 *
 * To add a module slice later (e.g., auth):
 *   1. Create `src/modules/auth/store/auth.store.ts` exporting `createAuthSlice`
 *   2. Import and spread it into `useBoundStore` below
 */

import { create } from "zustand";

// ---------------------------------------------------------------------------
// UI Slice — global UI state (sidebar, modals, etc.)
// ---------------------------------------------------------------------------
interface UISlice {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
}

const createUISlice = (
    set: (partial: Partial<UISlice> | ((state: UISlice) => Partial<UISlice>)) => void
): UISlice => ({
    isSidebarOpen: false,
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    setSidebarOpen: (open) => set({ isSidebarOpen: open }),
});

// ---------------------------------------------------------------------------
// Bound Store — combines all slices
// ---------------------------------------------------------------------------
export type BoundStore = UISlice;
// Future: export type BoundStore = UISlice & AuthSlice & PersonaSlice;

export const useBoundStore = create<BoundStore>()((...a) => ({
    ...createUISlice(a[0]),
    // ...createAuthSlice(...a),    ← plug in later
    // ...createPersonaSlice(...a),  ← plug in later
}));