export interface IPreLogin {
  username: string
}

export interface ILogin extends IPreLogin {
  password: string
}

export interface ILoginPayload {
  userId: number
  userLoginId: number
  username: string
}
