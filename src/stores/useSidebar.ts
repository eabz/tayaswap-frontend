import { create } from 'zustand'

interface ISidebarStore {
  open: boolean
  setOpen: (open: boolean) => void
}

export const useSidebarStore = create<ISidebarStore>()((set) => ({
  open: false,
  setOpen: (open: boolean) => set(() => ({ open }))
}))
