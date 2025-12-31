import { create } from 'zustand'

export const useDashboardStore = create((set) => ({
  currentModule: 'profile',
  setCurrentModule: (module) => set({ currentModule: module }),
}))
