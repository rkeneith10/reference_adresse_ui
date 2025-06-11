"use client";
import {
  Spinner,
  useToast
} from '@chakra-ui/react';
import axios from 'axios';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { AiOutlineLock, AiOutlineMail } from 'react-icons/ai';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import validator from 'validator';
import RootLayout from "../../components/rootLayout";
//import BackImage1 from "../public/images/téléchargement.jpg";

const Page = () => {

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [loading, setLoading] = useState<boolean>(false);

  const toast = useToast()
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "" || name.trim() === "") {

      toast({
        title: `Veuillez remplir tous les champs`,
        status: 'error',
        isClosable: true,
        position: 'top-right',
      })
    }
    else if (!validator.isEmail(email)) {
      toast({
        title: `Votre adresse email est incorrect`,
        status: 'error',
        isClosable: true,
        position: 'top-right',
      })
    }
    else {
      setLoading(true)
      try {
        const response = await axios.post("/api/userCtrl", {
          name,
          email,
          password,
        });

        if (response.status === 201) {
          // Crée la session automatiquement après inscription
          const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
          });

          if (result?.ok) {
            router.push("/dashboard");
          } else {
            // Erreur lors de la connexion après inscription
            toast({
              title: "Erreur lors de la connexion après l'inscription.",
              status: "error",
              isClosable: true,
              position: "top-right",
            });
          }
        }
      } catch (error: any) {
        toast({
          title: "Erreur d'inscription.",
          description: error.response?.data?.message || error.message,
          status: "error",
          isClosable: true,
          position: "top-right",
        });
      }
    }


  };
  return (
    <RootLayout isAuthenticated={false}>
      <div
        className="h-screen w-full sm:mx-auto flex flex-col justify-center items-center bg-center bg-cover bg-no-repeat"

      >
        <div className="bg-white rounded-md shadow-md p-10 w-full max-w-screen-sm sm:mx-auto">
          <h2 className="text-2xl font-bold text-center">CONNEXION</h2>

          <form onSubmit={handleRegister}>
            <div className="mt-6">
              <label className="block text-gray-700">Nom Complet</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Nom complet"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
                <AiOutlineMail className="absolute top-3 left-3 text-gray-500" />
              </div>
            </div>
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
                    S'inscrire<Spinner size="sm" color="white" className="ml-2 " />
                  </>
                ) : (
                  <div>S'inscrire</div>
                )}
              </button>
            </div>



          </form>
        </div>
      </div>
    </RootLayout>
  )
}

export default Page
