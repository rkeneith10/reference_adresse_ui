"use client";

import { Spinner, useToast } from "@chakra-ui/react";
import axios from "axios";
import { getSession, signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AiOutlineLock, AiOutlineMail } from "react-icons/ai";
import { FaEye, FaEyeSlash, FaMapMarkerAlt } from "react-icons/fa";
import validator from "validator";
import RootLayout from "../components/rootLayout";

const LoginPage: React.FC = () => {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRegisterButton, setShowRegisterButton] = useState(false);
  const [show, setShow] = useState(false);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    document.title = "Connexion — Référentiel d'Adresses";

    const checkAdminExists = async () => {
      try {
        const response = await axios.get("/api/checkAdmin");
        setShowRegisterButton(response.data.adminExists);
      } catch (error) {
        console.error("Erreur lors de la vérification de l'admin :", error);
      }
    };
    checkAdminExists();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Veuillez remplir tous les champs", status: "error", isClosable: true, position: "top-right" });
      return;
    }
    if (!validator.isEmail(email)) {
      toast({ title: "Adresse email invalide", status: "error", isClosable: true, position: "top-right" });
      return;
    }

    setLoading(true);
    const result = await signIn("credentials", { redirect: false, email, password });

    if (result?.ok) {
      const updatedSession = await getSession();
      if (updatedSession?.user.status === 1) {
        router.push("/dashboard");
      } else {
        router.push("/change-password");
      }
    } else {
      toast({ title: "Email ou mot de passe incorrect", status: "error", isClosable: true, position: "top-right" });
      setLoading(false);
    }
  };

  return (
    <RootLayout isAuthenticated={false}>
      {/* Full screen two-column layout */}
      <div className="min-h-screen flex" style={{ background: "var(--surface-page)" }}>

        {/* ---- LEFT PANEL: Branding ---- */}
        <div
          className="hidden lg:flex flex-col justify-between w-5/12 p-12 relative overflow-hidden"
          style={{
            background: "linear-gradient(145deg, #1e3a8a 0%, #2563eb 45%, #7c3aed 100%)",
          }}
        >
          {/* Decorative circles */}
          <div
            className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10"
            style={{ background: "rgba(255,255,255,0.3)" }}
          />
          <div
            className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full opacity-10"
            style={{ background: "rgba(255,255,255,0.2)" }}
          />
          <div
            className="absolute top-1/3 right-0 w-48 h-48 rounded-full opacity-5"
            style={{ background: "white" }}
          />

          {/* Logo zone */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <FaMapMarkerAlt className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg tracking-tight leading-none">
                  Référentiel
                </h1>
                <p className="text-blue-200 text-xs font-medium tracking-widest uppercase">
                  National d'Adresses
                </p>
              </div>
            </div>
          </div>

          {/* Center message */}
          <div className="relative z-10">
            <h2 className="text-white font-extrabold text-4xl leading-tight tracking-tight mb-5">
              Système de<br />référencement<br />géographique
            </h2>
            <p className="text-blue-200 text-base leading-relaxed max-w-xs">
              Gérez, explorez et localisez l'ensemble des adresses et subdivisions administratives du territoire national.
            </p>

            {/* Stats chips */}
            <div className="flex flex-wrap gap-3 mt-8">
              {[
                { label: "Pays", value: "1+" },
                { label: "Dép. couverts", value: "10" },
                { label: "Adresses référencées", value: "∞" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="px-4 py-2 rounded-xl text-center"
                  style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}
                >
                  <p className="text-white font-bold text-lg leading-none">{s.value}</p>
                  <p className="text-blue-200 text-[11px] font-medium mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10">
            <p className="text-blue-300 text-xs">
              © 2025 ISTEAH — Système National de Référencement d'Adresses
            </p>
          </div>
        </div>

        {/* ---- RIGHT PANEL: Login Form ---- */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
            >
              <FaMapMarkerAlt className="text-white text-base" />
            </div>
            <span className="font-extrabold text-lg" style={{ color: "var(--gray-900)" }}>
              Référentiel d'Adresses
            </span>
          </div>

          <div className="w-full max-w-sm">
            {/* Card */}
            <div
              className="bg-white rounded-2xl p-8"
              style={{
                border: "1px solid var(--gray-100)",
                boxShadow: "0 8px 40px -8px rgba(0,0,0,.12), 0 1px 3px rgba(0,0,0,.04)",
              }}
            >
              <div className="mb-7">
                <h2
                  className="font-extrabold text-2xl tracking-tight"
                  style={{ color: "var(--gray-900)" }}
                >
                  Connexion
                </h2>
                <p className="text-sm mt-1" style={{ color: "var(--gray-400)" }}>
                  Accédez à votre espace de gestion
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label
                    className="block text-xs font-semibold mb-1.5"
                    style={{ color: "var(--gray-700)" }}
                    htmlFor="email"
                  >
                    Adresse Email
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      placeholder="vous@exemple.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-modern input-search"
                      autoComplete="email"
                    />
                    <AiOutlineMail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
                      style={{ color: "var(--gray-400)" }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    className="block text-xs font-semibold mb-1.5"
                    style={{ color: "var(--gray-700)" }}
                    htmlFor="password"
                  >
                    Mot de Passe
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={show ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-modern input-search pr-10"
                      autoComplete="current-password"
                    />
                    <AiOutlineLock
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
                      style={{ color: "var(--gray-400)" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShow(!show)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                      style={{ color: "var(--gray-400)" }}
                    >
                      {show ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                    </button>
                  </div>
                </div>

                {/* Forgot password */}
                <div className="flex justify-end">
                  <Link
                    href="#"
                    className="text-xs font-medium transition-colors hover:opacity-80"
                    style={{ color: "var(--brand-600)" }}
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn btn-primary justify-center py-2.5 text-sm rounded-xl"
                  style={{
                    background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                    boxShadow: "0 4px 15px -3px rgba(37,99,235,.45)",
                  }}
                >
                  {loading ? (
                    <>
                      <Spinner size="xs" color="white" />
                      <span>Connexion en cours...</span>
                    </>
                  ) : (
                    "Se Connecter"
                  )}
                </button>
              </form>

              {/* Register link */}
              {!showRegisterButton && (
                <p
                  className="text-xs text-center mt-5"
                  style={{ color: "var(--gray-400)" }}
                >
                  Pas encore de compte ?{" "}
                  <Link
                    href="/register"
                    className="font-semibold transition-colors hover:opacity-80"
                    style={{ color: "var(--brand-600)" }}
                  >
                    Créer un compte
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
};

export default LoginPage;
