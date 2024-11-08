"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SIDENAV_ITEMS } from "@/constants";
import { SideNavItem } from "@/types";
import logo from "../public/images/ref.png";

const SideNav = () => {
  return (
    <div className="md:w-60 bg-white h-screen flex-1 fixed border-r border-zinc-200 hidden md:flex">
      <div className="flex flex-col space-y-6 w-full">
        <Link
          href="/"
          className="flex flex-row space-x-3 items-center justify-center md:justify-start md:px-6 border-b border-zinc-200 h-12 w-full"
        >
          {/* <span className="h-7 w-7 bg-zinc-300 rounded-lg" /> */}
          <span className="font-semibold text-md hidden md:flex text-blue-500">
            <Image src={logo} alt={"logo"} width={120} height={120} />
          </span>
        </Link>

        <div className="flex flex-col space-y-2 md:px-6">
          {SIDENAV_ITEMS.map((item, idx) => (
            <>
              <MenuItem key={idx} item={item} />
              {item.title === "Adresses" && (
                <hr key={`divider-${idx}`} className="border-t my-4" />
              )}
            </>
          ))}
        </div>

      </div>
    </div>
  );
};

export default SideNav;

const MenuItem = ({ item }: { item: SideNavItem }) => {
  const pathname = usePathname();
  return (
    <Link
      href={item.path}
      className={`flex flex-row space-x-4 items-center p-2 rounded-lg hover:bg-zinc-100 text-blue-500  ${item.path === pathname ? "bg-zinc-100" : ""
        }`}
    >
      {item.icon}
      <span className="font-semibold text-sm text-gray-700 flex">
        {item.title}
      </span>
    </Link>
  );
};
