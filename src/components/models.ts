export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export interface Credentials {
  email: string;
  password: string;
  remember: boolean;
}

export interface SignupInterface {
  email: string;
  password: string;
  password_confirmation: string;
  name: string;
}
