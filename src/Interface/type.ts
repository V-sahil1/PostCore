import type { UserRole } from "../const/enum";

export type sortBy = [string, 'ASC' | 'DESC'][];

export type AgeFilter = {
  operator: ">" | ">=" | "<" | "<=" | "=";
  value: number;
};

export type AuthUser = { id: number; role?: UserRole, email?: string;};
export type IdRow = { id: number };
export type IUserAttributes = {
  id: number;
  user_name: string;
  email: string;
  password: string;
  role: UserRole;
  age?: number;
}

export type PostResponse ={
  id: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  UserInfo: {
    user_name: string;
    email: string;
  };
  comments: Comment[];
}
