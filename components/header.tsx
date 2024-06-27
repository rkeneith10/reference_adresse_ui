import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { FaSignOutAlt, FaUser } from 'react-icons/fa';
import logo from '../public/images/ref.png';

import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure
} from '@chakra-ui/react';
import React from 'react';
import { MdPerson } from 'react-icons/md';

const Header = () => {
  const { data: session } = useSession();


  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()


  // const toggleDropdown = () => {
  //   setIsOpen(!isOpen);
  // };

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
              <span onClick={onOpen} className="flex items-center space-x-4,">
                <FaUser className="h-5 w-5 text-blue-500 cursor-pointer" />
              </span>

              <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}
              >
                <DrawerOverlay />
                <DrawerContent>
                  <DrawerCloseButton />
                  <DrawerHeader></DrawerHeader>

                  <DrawerBody>
                    <p className='text-gray-900 font-bold px-4 py-2 mt-4'>Bienvenue</p>
                    <p className="px-4  text-gray-500 font-semibold mb-4">{session.user.name}</p>

                    <div className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer border border-gray-200 rounded-md">
                      <MdPerson className="h-5 w-5 text-blue-500 mr-2" />
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
