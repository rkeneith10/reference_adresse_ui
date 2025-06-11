"use client";
import RootLayout from '@/components/rootLayout';
import { Spinner, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AiOutlineLock, AiOutlineMail } from 'react-icons/ai';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [email, setEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast()
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const handleClick = () => setShow(!show);
  const handleClick1 = () => setShow1(!show1);
  const { data: session } = useSession();

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/change-password', {
        email: session?.user.email,
        oldPassword,
        newPassword,
      });

      toast({
        title: "Succès",
        description: response.data.message || "Mot de passe changé avec succès",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setOldPassword("");
      setNewPassword("");


      if (response.status === 200) {
        // Re-sign-in to refresh the session with updated user data
        await signIn("credentials", {
          redirect: false,
          email: session?.user.email,
          password: newPassword, // Utilise le nouveau mot de passe ici
        });

        router.push("/dashboard");
      }


    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message || "Une erreur est survenue";

      if (status === 400 || status === 404) {
        toast({
          title: "Erreur",
          description: message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Erreur serveur",
          description: message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <RootLayout isAuthenticated>
      <div className="h-screen w-full sm:mx-auto flex flex-col justify-center items-center">
        <div className="bg-white rounded-md shadow-md p-10 w-full max-w-screen-sm sm:mx-auto">
          <h2 className="text-xl font-bold text-center">Changez votre mot de passe</h2>
          <form onSubmit={handlePassword}  >

            <div className="mt-6">
              <label className="block text-gray-700">Email</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email"
                  disabled
                  name="email"
                  value={session ? session?.user.email : email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
                <AiOutlineMail className="absolute top-3 left-3 text-gray-500" />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-gray-700">Ancien mot de passe</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  placeholder="Ancien mot de passe"
                  value={oldPassword}
                  required
                  name="password"
                  onChange={(e) => setOldPassword(e.target.value)}
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

            <div className="mt-6">
              <label className="block text-gray-700">Nouveau mot de passe</label>
              <div className="relative">
                <input
                  type={show1 ? 'text' : 'password'}
                  placeholder="Nouveau mot de passe"
                  value={newPassword}
                  required
                  name="password"
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
                <AiOutlineLock className="absolute top-3 left-3 text-gray-500" />
                <button
                  type="button"
                  onClick={handleClick1}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {show1 ? <FaEyeSlash /> : <FaEye />}
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
                    Envoyer<Spinner size="sm" color="white" className="ml-2 " />
                  </>
                ) : (
                  <div>Envoyer</div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </RootLayout>
  )
}

export default ChangePassword
