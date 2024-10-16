"use client";

import { Spinner } from '@chakra-ui/react';
import { signIn } from 'next-auth/react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineLock, AiOutlineMail } from "react-icons/ai";
import RootLayout from "../components/rootLayout";
import BackImage1 from "../public/images/téléchargement.jpg";

import {
  useToast
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import validator from 'validator';
import React from 'react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast()
  const router = useRouter();
  const [show, setShow] = useState(false);

  const handleClick = () => setShow(!show);

  useEffect(() => {
    document.title = "Referentiel d'adresse";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email === " " || password === "") {
      toast({
        title: `Veuillez remplir tous les champs`,
        status: 'error',
        isClosable: true,
        position: 'top-right',
      })
    } else if (!validator.isEmail(email)) {
      toast({
        title: `Votre adresse email est incorrect`,
        status: 'error',
        isClosable: true,
        position: 'top-right',
      })
    } else {
      setLoading(true);
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.ok) {
        router.push('/dashboard');
        setLoading(false);
      } else {
        toast({
          title: `Email ou mot de passe incorrect`,
          status: 'error',
          isClosable: true,
          position: 'top-right',
        })

        setLoading(false);
        console.error('Login failed', result?.error);
        //toast.error(`Email ou mot de passe incorrect`);
      }
    }

  };

  return (
    <RootLayout isAuthenticated={false}>
      <div
        className="h-screen w-full sm:mx-auto flex flex-col justify-center items-center bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${BackImage1.src})` }}
      >
        <div className="bg-white rounded-md shadow-md p-10 w-full max-w-screen-sm sm:mx-auto">
          <h2 className="text-2xl font-bold text-center">CONNEXION</h2>

          <form onSubmit={handleSubmit}>
            <div className="mt-6">
              <label className="block text-gray-700">Email</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
                <AiOutlineMail className="absolute top-3 left-3 text-gray-500" />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-gray-700">Mot de passe</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  placeholder="Mot de passe"
                  value={password}
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
                <AiOutlineLock className="absolute top-3 left-3 text-gray-500" />
                <button
                  type="button"
                  onClick={handleClick}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {show ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-indigo-500 py-2 px-4 text-white font-medium hover:bg-indigo-600"
              >
                {loading ? (
                  <>
                    Se Connecter<Spinner size="sm" color="white" className="ml-2 " />
                  </>
                ) : (
                  <div>Se Connecter</div>
                )}
              </button>
            </div>

            {/* <div className="mt-6 text-center">
              <button
                onClick={() => signIn('google')}
                className="w-full flex justify-center items-center rounded-md border border-gray-300 bg-white py-2 px-4 text-gray-500 font-medium hover:bg-gray-50"
              >
                <FcGoogle className="mr-2" /> Connexion avec Google
              </button>
            </div> */}

            <div className="mt-6 text-center">
              <Link href="/forgot-password">Mot de passe oublié?</Link>
            </div>
          </form>
        </div>
      </div>
    </RootLayout>
  );
};

export default LoginPage;
