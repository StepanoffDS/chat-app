export interface User {
  email: string;
  fullName: string;
  password: string;
  profilePic: string;
}

export interface SignUpData {
  email: string;
  fullName: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}
