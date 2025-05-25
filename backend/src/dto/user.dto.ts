interface CreateUserDTO {
  email: string;
  fullName: string;
  password: string;
}

interface LoginUserDTO {
  email: string;
  password: string;
}

export { CreateUserDTO, LoginUserDTO };
