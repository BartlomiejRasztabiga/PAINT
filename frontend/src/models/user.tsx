type User = {
  id: string,
  username: string,
  status: UserStatus,
}

enum UserStatus {
  Online = "ONLINE",
  Offline = "OFFLINE",
}

export type { User }
export { UserStatus }
