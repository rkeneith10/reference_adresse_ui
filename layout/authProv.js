"use client";

import { SessionProvider } from "next-auth/react";

export const AuthProv = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};