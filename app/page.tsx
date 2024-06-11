// pages/login.tsx
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineLock, AiOutlineMail } from "react-icons/ai";
import RootLayout from "../components/rootLayout";
import BackImage1 from "../public/images/téléchargement.jpg";

const LoginPage: React.FC = () => {
  const isAuthenticated = false;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    document.title = "Referentiel d'adresse";
  });

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    router.replace("/dashboard");

    // Simulate login by checking credentials
    // if (email === "user@example.com" && password === "password123") {

    //  localStorage.setItem('isLoggedIn', true);

    //   router.push("/dashboard");
    // } else {
    //   alert("Invalid credentials");
    // }
  };
  return (
    <RootLayout isAuthenticated={isAuthenticated}>
      <div
        className="h-screen w-full sm:mx-auto flex flex-col justify-center items-center bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${BackImage1.src})` }}
      >
        <div className="bg-white rounded-md shadow-md p-10 w-full max-w-screen-sm sm:mx-auto ">
          <h2 className="text-2xl font-bold text-center">CONNEXION</h2>

          <form onSubmit={handleSubmit}>
            <div className="mt-6">
              <label className="block text-gray-700">Email</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email"
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
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
                <AiOutlineLock className="absolute top-3 left-3 text-gray-500" />
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                className="w-full rounded-md bg-indigo-500 py-2 px-4 text-white font-medium hover:bg-indigo-600"
              >
                Se connecter
              </button>
            </div>

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
