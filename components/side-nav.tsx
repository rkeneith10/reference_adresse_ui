"use client";

import { SIDENAV_ITEMS } from "@/constants";
import { getVisibleSideNavItems } from "@/lib/helper";
import { SideNavItem } from "@/types";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "../public/images/ref.png";

const SideNav = () => {
  const { data: session } = useSession();
  const userRole = session?.user?.role;
  const statutUser = session?.user?.status;
  const visibleItems = getVisibleSideNavItems(SIDENAV_ITEMS, userRole);

  // Split items: regular + admin (last section)
  const mainItems = visibleItems.filter((i) => i.title !== "Gestion Utilisateurs");
  const adminItems = visibleItems.filter((i) => i.title === "Gestion Utilisateurs");

  return (
    <aside
      className="sidebar fixed top-0 left-0 h-screen z-40 hidden md:flex flex-col"
      style={{ width: "var(--sidebar-width)" }}
    >
      {/* Logo */}
      <div className="sidebar-logo-area flex-shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M7 1L13 4V10L7 13L1 10V4L7 1Z"
                fill="white"
                fillOpacity=".9"
              />
            </svg>
          </div>
          <div>
            <Image
              src={logo}
              alt="logo"
              width={96}
              height={28}
              className="object-contain"
              priority
            />
          </div>
        </Link>
      </div>

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <div className="sidebar-nav-section">
          <p className="sidebar-nav-label mb-3">Navigation</p>
          <nav className="space-y-0.5">
            {mainItems.map((item, idx) => (
              <div key={idx}>
                {statutUser !== 0 && <MenuItem item={item} />}
              </div>
            ))}
          </nav>
        </div>

        {adminItems.length > 0 && (
          <>
            <div className="sidebar-divider my-4" />
            <div className="sidebar-nav-section">
              <p className="sidebar-nav-label mb-3">Administration</p>
              <nav className="space-y-0.5">
                {adminItems.map((item, idx) => (
                  <div key={idx}>
                    {statutUser !== 0 && <MenuItem item={item} />}
                  </div>
                ))}
              </nav>
            </div>
          </>
        )}
      </div>

      {/* Footer info */}
      <div
        className="flex-shrink-0 border-t px-4 py-3"
        style={{ borderColor: "var(--gray-100)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            }}
          >
            {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0">
            <p
              className="text-xs font-semibold truncate"
              style={{ color: "var(--gray-700)" }}
            >
              {session?.user?.name ?? "Utilisateur"}
            </p>
            <p
              className="text-[11px] truncate"
              style={{ color: "var(--gray-400)" }}
            >
              {session?.user?.email ?? ""}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SideNav;

/* ---- Single Nav Item ---- */
const MenuItem = ({ item }: { item: SideNavItem }) => {
  const pathname = usePathname();
  const isActive = pathname === item.path || pathname.startsWith(item.path + "/");

  return (
    <Link
      href={item.path}
      className={`nav-item ${isActive ? "active" : ""}`}
    >
      <span className="nav-icon">
        {item.icon}
      </span>
      <span className="truncate">{item.title}</span>
    </Link>
  );
};
