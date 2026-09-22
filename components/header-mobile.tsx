"use client";

import { SIDENAV_ITEMS } from "@/constants";
import { getVisibleSideNavItems } from "@/lib/helper";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useRef } from "react";
import { FaBars, FaMapMarkerAlt, FaSignOutAlt, FaTimes, FaUser } from "react-icons/fa";
import { MdPerson } from "react-icons/md";

const HeaderMobile = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role;
  const visibleItems = getVisibleSideNavItems(SIDENAV_ITEMS, userRole);
  const {
    isOpen: isMenuOpen,
    onOpen: onMenuOpen,
    onClose: onMenuClose,
  } = useDisclosure();
  const {
    isOpen: isProfileOpen,
    onOpen: onProfileOpen,
    onClose: onProfileClose,
  } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <>
      {/* Mobile Top Bar */}
      <div
        className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14 bg-white"
        style={{
          borderBottom: "1px solid var(--gray-100)",
          boxShadow: "var(--shadow-xs)",
        }}
      >
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
          >
            <FaMapMarkerAlt className="text-white text-xs" />
          </div>
          <span
            className="font-extrabold text-sm"
            style={{ color: "var(--gray-900)" }}
          >
            Référentiel
          </span>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Avatar */}
          {session?.user && (
            <button
              ref={btnRef}
              onClick={onProfileOpen}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                boxShadow: "0 0 0 2px white, 0 0 0 3px var(--gray-200)",
              }}
            >
              {initials}
            </button>
          )}

          {/* Hamburger */}
          <button
            onClick={isMenuOpen ? onMenuClose : onMenuOpen}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
            style={{ background: "var(--gray-100)", color: "var(--gray-700)" }}
          >
            {isMenuOpen ? <FaTimes size={15} /> : <FaBars size={15} />}
          </button>
        </div>
      </div>

      {/* Mobile Side Nav Drawer */}
      <Drawer
        isOpen={isMenuOpen}
        placement="left"
        onClose={onMenuClose}
        size="xs"
      >
        <DrawerOverlay backdropFilter="blur(2px)" />
        <DrawerContent
          style={{
            borderRight: "1px solid var(--gray-100)",
            boxShadow: "var(--shadow-xl)",
          }}
        >
          <DrawerHeader
            borderBottomWidth="1px"
            borderColor="var(--gray-100)"
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
              >
                <FaMapMarkerAlt className="text-white text-sm" />
              </div>
              <span className="font-bold text-base" style={{ color: "var(--gray-900)" }}>
                Navigation
              </span>
            </div>
            <DrawerCloseButton style={{ color: "var(--gray-400)" }} />
          </DrawerHeader>

          <DrawerBody p={3} style={{ background: "var(--gray-50)" }}>
            <nav className="space-y-1">
              {visibleItems.map((item, idx) => {
                if (session?.user?.status === 0) return null;
                const isActive = pathname === item.path || pathname.startsWith(item.path + "/");
                const isAdmin = item.title === "Gestion Utilisateurs";

                return (
                  <div key={idx}>
                    {isAdmin && (
                      <div
                        className="h-px my-3"
                        style={{ background: "var(--gray-200)" }}
                      />
                    )}
                    <Link
                      href={item.path}
                      onClick={onMenuClose}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
                      style={{
                        background: isActive ? "var(--brand-50)" : "transparent",
                        color: isActive ? "var(--brand-600)" : "var(--gray-600)",
                        fontWeight: isActive ? "600" : "500",
                        fontSize: "13.5px",
                      }}
                    >
                      <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          background: isActive ? "var(--brand-100)" : "white",
                          color: isActive ? "var(--brand-600)" : "var(--gray-400)",
                          border: "1px solid var(--gray-100)",
                        }}
                      >
                        {item.icon}
                      </span>
                      {item.title}
                    </Link>
                  </div>
                );
              })}
            </nav>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Profile Drawer */}
      <Drawer
        isOpen={isProfileOpen}
        placement="right"
        onClose={onProfileClose}
        finalFocusRef={btnRef}
        size="xs"
      >
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
            <div className="flex items-center gap-3 mt-1">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  boxShadow: "0 0 0 3px rgba(59,130,246,.15)",
                }}
              >
                {initials}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm truncate" style={{ color: "var(--gray-900)" }}>
                  {session?.user?.name ?? "Utilisateur"}
                </p>
                <p className="text-xs truncate" style={{ color: "var(--gray-400)" }}>
                  {session?.user?.email ?? ""}
                </p>
              </div>
            </div>
          </DrawerHeader>

          <DrawerBody p={4} style={{ background: "var(--gray-50)" }}>
            <div className="space-y-2">
              <div
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer"
                style={{ background: "white", border: "1px solid var(--gray-100)" }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "var(--brand-100)", color: "var(--brand-600)" }}
                >
                  <MdPerson size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--gray-900)" }}>
                    Mon Profil
                  </p>
                  <p className="text-xs" style={{ color: "var(--gray-400)" }}>
                    Gérer mes informations
                  </p>
                </div>
              </div>

              <div style={{ height: "1px", background: "var(--gray-100)", margin: "8px 0" }} />

              <button
                className="w-full flex items-center gap-3 p-3 rounded-xl text-left"
                style={{ background: "white", border: "1px solid var(--gray-100)" }}
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "#ffe4e6", color: "#e11d48" }}
                >
                  <FaSignOutAlt size={13} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#be123c" }}>
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

export default HeaderMobile;
