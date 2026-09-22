import { ReactNode } from "react";

export default function MarginWidthWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ marginLeft: "var(--sidebar-width)" }}
    >
      {children}
    </div>
  );
}
