type User = {
  id: string,
  nickName: string,
  firstName: string,
  lastName: string,
  status: UserStatus,
}

enum UserStatus {
  Online = "ONLINE",
  Offline = "OFFLINE",
}

export type { User }
export { UserStatus }