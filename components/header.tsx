import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import logo from '../public/images/ref.png';

const Header = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false); // État pour gérer l'affichage du nom d'utilisateur

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="sticky inset-x-0 top-0 z-30 w-full transition-all border-b border-gray-200">
      <div className="flex h-[47px] items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex flex-row space-x-3 items-center justify-center md:hidden">
            <span className="font-bold text-xl flex ">
              <Image src={logo} alt={'logo'} width={100} height={100} />
            </span>
          </Link>
        </div>

        <div className="hidden md:block">
          {session && session.user && session.user.name ? (
            <div className="relative">
              <button onClick={toggleDropdown} className="flex items-center space-x-2">
                <FaUser className="h-5 w-5 text-gray-200 cursor-pointer" />
              </button>
              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md py-2">
                  <p className="px-4 py-2 text-gray-800">{session.user.name}</p>
                </div>
              )}
            </div>
          ) : (
            <FaUser className="h-5 w-5 text-gray-200" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
