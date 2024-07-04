"use client";

import { SIDENAV_ITEMS } from "@/constants";
import { Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, useDisclosure } from '@chakra-ui/react';
import { motion, useCycle } from "framer-motion";
import { signOut, useSession } from 'next-auth/react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useRef } from "react";
import { FaSignOutAlt, FaUser } from 'react-icons/fa';

const sidebar = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 100% 0)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(0px at 100% 0)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

const HeaderMobile = () => {
  const pathname = usePathname();
  const containerRef = useRef(null);
  const { height } = useDimensions(containerRef);
  const [isOpen, toggleOpen] = useCycle(false, true);
  const { data: session } = useSession();
  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();
  const btnRef = useRef(null);

  return (
    <motion.nav
      initial={false}
      animate={isOpen ? "open" : "closed"}
      custom={height}
      className={`fixed inset-0 z-50 w-full md:hidden ${isOpen ? "" : "pointer-events-none"}`}
      ref={containerRef}
    >
      <motion.div
        className="absolute inset-0 right-0 w-full bg-white"
        variants={sidebar}
      />
      <motion.ul
        variants={variants}
        className="absolute grid w-full gap-3 px-10 py-16 max-h-screen overflow-y-auto"
      >
        {SIDENAV_ITEMS.map((item, idx) => {
          const isLastItem = idx === SIDENAV_ITEMS.length - 1;

          return (
            <div key={idx}>
              <MenuItem>
                <Link
                  href={item.path}
                  onClick={() => toggleOpen()}
                  className={`flex w-full text-2xl ${item.path === pathname ? "font-bold" : ""}`}
                >
                  {item.title}
                </Link>
              </MenuItem>
              {!isLastItem && <MenuItem className="my-3 h-px w-full bg-gray-300" />}
            </div>
          );
        })}
      </motion.ul>
      <MenuToggle toggle={toggleOpen} />
      {session && session.user && (
        <>
          <button
            ref={btnRef}
            onClick={onDrawerOpen}
            className="pointer-events-auto absolute right-4 bottom-14 z-30 bg-blue-500 text-white p-2 rounded-full"
          >
            <FaUser />
          </button>
          <Drawer isOpen={isDrawerOpen} placement='right' onClose={onDrawerClose} finalFocusRef={btnRef}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader></DrawerHeader>
              <DrawerBody>
                <p className='text-gray-900 font-bold px-4 py-2 mt-4'>Bienvenue</p>
                <p className="px-4 text-gray-500 font-semibold mb-4">{session.user.name}</p>
                <div className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer border border-gray-200 rounded-md">
                  <FaUser className="h-5 w-5 text-blue-500 mr-2" />
                  <div>
                    <span className="font-bold">Profil</span>
                    <span className="block text-sm text-gray-500">{session.user.email}</span>
                  </div>
                </div>
                <div className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer border border-gray-200 rounded-md mt-5" onClick={() => signOut({ callbackUrl: '/' })}>
                  <FaSignOutAlt className="h-5 w-5 text-blue-500 mr-2" />
                  <div>
                    <span className="font-bold">Se Déconnecter</span>
                    <span className="block text-sm text-gray-500">Fermer votre session</span>
                  </div>
                </div>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      )}
    </motion.nav>
  );
};

export default HeaderMobile;

const MenuToggle = ({ toggle }: { toggle: any }) => (
  <button
    onClick={toggle}
    className="pointer-events-auto absolute right-4 top-[14px] z-30"
  >
    <svg width="23" height="23" viewBox="0 0 23 23">
      <Path
        variants={{
          closed: { d: "M 2 2.5 L 20 2.5" },
          open: { d: "M 3 16.5 L 17 2.5" },
        }}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        variants={{
          closed: { d: "M 2 16.346 L 20 16.346" },
          open: { d: "M 3 2.5 L 17 16.346" },
        }}
      />
    </svg>
  </button>
);

const Path = (props: any) => (
  <motion.path
    fill="transparent"
    strokeWidth="2"
    stroke="hsl(0, 0%, 18%)"
    strokeLinecap="round"
    {...props}
  />
);

const MenuItem = ({ className, children }: { className?: string; children?: ReactNode; }) => (
  <motion.li variants={MenuItemVariants} className={className}>
    {children}
  </motion.li>
);

const MenuItemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
      duration: 0.02,
    },
  },
};

const variants = {
  open: {
    transition: { staggerChildren: 0.02, delayChildren: 0.15 },
  },
  closed: {
    transition: { staggerChildren: 0.01, staggerDirection: -1 },
  },
};

const useDimensions = (ref: any) => {
  const dimensions = useRef({ width: 0, height: 0 });

  useEffect(() => {
    if (ref.current) {
      dimensions.current.width = ref.current.offsetWidth;
      dimensions.current.height = ref.current.offsetHeight;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  return dimensions.current;
};
