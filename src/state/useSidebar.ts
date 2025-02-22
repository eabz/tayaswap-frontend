import { create } from 'zustand'

interface ISidebarStore {
  open: boolean
  setOpen: (open: boolean) => void
}

export const useSidebarState = create<ISidebarStore>()((set) => ({
  open: false,
  setOpen: (open: boolean) => set(() => ({ open }))
}))
