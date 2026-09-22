"use client";

import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import {
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { MdPerson } from "react-icons/md";

const Header = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Derive current page title from pathname
  const pageTitle = (() => {
    const segments = pathname?.split("/").filter(Boolean);
    if (!segments || segments.length === 0) return "Accueil";
    const last = segments[segments.length - 1];
    const map: Record<string, string> = {
      dashboard: "Tableau de bord",
      subdivision: "Subdivision Géographique",
      pays: "Pays",
      departements: "Départements",
      villes: "Villes & Communes",
      adresses: "Adresses",
      mapAdresse: "Cartographie",
      "gestion-utilisateur": "Gestion Utilisateurs",
      aide: "Aide",
    };
    return map[last] ?? last.charAt(0).toUpperCase() + last.slice(1);
  })();

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <>
      <header className="topbar">
        {/* Left: Page Title */}
        <div>
          <h1
            className="font-semibold text-sm"
            style={{ color: "var(--gray-900)" }}
          >
            {pageTitle}
          </h1>
        </div>

        {/* Right: Actions */}
        <div className="topbar-actions">
          {/* Notification bell */}
          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150 hover:bg-gray-100"
            style={{ color: "var(--gray-400)" }}
            aria-label="Notifications"
          >
            <FaBell size={14} />
          </button>

          {/* User avatar → opens profile drawer */}
          {session?.user ? (
            <button
              onClick={onOpen}
              className="topbar-avatar"
              aria-label="Mon profil"
            >
              {initials}
            </button>
          ) : (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "var(--gray-100)", color: "var(--gray-400)" }}
            >
              <FaUser size={13} />
            </div>
          )}
        </div>
      </header>

      {/* Profile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
        <DrawerOverlay backdropFilter="blur(2px)" />
        <DrawerContent
          style={{
            borderLeft: "1px solid var(--gray-100)",
            boxShadow: "var(--shadow-xl)",
          }}
        >
          <DrawerCloseButton style={{ color: "var(--gray-400)" }} />
          <DrawerHeader
            borderBottomWidth="1px"
            borderColor="var(--gray-100)"
            pb={4}
          >
            {/* Avatar + Name */}
            <div className="flex items-center gap-3 mt-1">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  boxShadow: "0 0 0 3px rgba(59,130,246,.15)",
                }}
              >
                {initials}
              </div>
              <div className="min-w-0">
                <p
                  className="font-bold text-sm truncate"
                  style={{ color: "var(--gray-900)" }}
                >
                  {session?.user?.name ?? "Utilisateur"}
                </p>
                <p
                  className="text-xs truncate"
                  style={{ color: "var(--gray-400)" }}
                >
                  {session?.user?.email ?? ""}
                </p>
              </div>
            </div>
          </DrawerHeader>

          <DrawerBody p={4} style={{ background: "var(--gray-50)" }}>
            <div className="space-y-2">
              {/* Profile item */}
              <div
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors"
                style={{
                  background: "white",
                  border: "1px solid var(--gray-100)",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    "var(--brand-50)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = "white")
                }
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "var(--brand-100)", color: "var(--brand-600)" }}
                >
                  <MdPerson size={16} />
                </div>
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--gray-900)" }}
                  >
                    Mon Profil
                  </p>
                  <p className="text-xs" style={{ color: "var(--gray-400)" }}>
                    Gérer mes informations
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: "1px", background: "var(--gray-100)", margin: "8px 0" }} />

              {/* Sign Out */}
              <button
                className="w-full flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors text-left"
                style={{
                  background: "white",
                  border: "1px solid var(--gray-100)",
                  color: "inherit",
                }}
                onClick={() => signOut({ callbackUrl: "/" })}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    "#fff1f2")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = "white")
                }
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "#ffe4e6", color: "#e11d48" }}
                >
                  <FaSignOutAlt size={13} />
                </div>
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "#be123c" }}
                  >
                    Se Déconnecter
                  </p>
                  <p className="text-xs" style={{ color: "var(--gray-400)" }}>
                    Fermer votre session
                  </p>
                </div>
              </button>
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Header;
