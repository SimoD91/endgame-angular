export interface IUserDto {
}

export interface UserRegister{
  nome: string
  cognome: string
  email: string
  username: string
  password: string
}

export interface UserLogin{
  username: string
  password: string
}

export interface UserAvatar{
  avatar: string
}
