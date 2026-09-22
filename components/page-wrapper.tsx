import { ReactNode } from "react";

export default function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <main
      className="flex-1 animate-fade-in"
      style={{ background: "var(--surface-page)", padding: "28px 32px 40px" }}
    >
      {children}
    </main>
  );
}
