export interface ICreateUserDTO {
  username: string;
  password: string;
  name: string;
  email: string;
  phone?: string;
  roleId: number;
}
