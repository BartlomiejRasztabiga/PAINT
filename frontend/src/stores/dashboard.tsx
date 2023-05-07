import create from "zustand"
import { Conversation } from "../models/conversation"
import { User, UserStatus } from "../models/user"

type DashboardState = {
  selectedConversation: Conversation | null,
  currentUser: User | null,
  currentUserStatus: UserStatus,
}

type DashboardActions = {
  setSelectedConversation: (conversation: Conversation | null) => void,
  setCurrentUser: (user: User | null) => void,
  reset: () => void,
}

const defaultDashboardState: DashboardState = {
  selectedConversation: null,
  currentUser: null,
  currentUserStatus: UserStatus.Offline,
}

const useDashboardStore = create<DashboardState & DashboardActions>((set) => ({
  ...defaultDashboardState,

  setSelectedConversation: (conversation: Conversation | null) => set({ selectedConversation: conversation }),
  setCurrentUser: (user: User | null) => set({ currentUser: user, currentUserStatus: UserStatus.Online }),
  reset: () => set(defaultDashboardState),
}))

export { useDashboardStore }