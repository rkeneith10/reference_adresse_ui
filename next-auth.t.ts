
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      status:number;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status:number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    role: string;
    status:number;
  }
}
