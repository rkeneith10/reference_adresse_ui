"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "../public/images/ref.png";

import { FaUser } from "react-icons/fa";

// import { cn } from "@/lib/utils";

const Header = () => {
  return (
    <div
      className={`sticky inset-x-0 top-0 z-30 w-full transition-all border-b border-gray-200`}
    >
      <div className="flex h-[47px] items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="flex flex-row space-x-3 items-center justify-center md:hidden"
          >
            {/* <span className="h-7 w-7 bg-zinc-300 rounded-lg" /> */}
            <span className="font-bold text-xl flex ">
              <Image src={logo} alt={"logo"} width={100} height={100} />
            </span>
          </Link>
        </div>

        <div className="hidden md:block">
          <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-center">
            <span className="font-semibold text-sm">
              <FaUser className="h-5 w-5 text-gray-200" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
