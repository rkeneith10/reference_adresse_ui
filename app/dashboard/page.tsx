"use client";

import Chart from "@/components/barchart";
import BarChartAdresse from "@/components/BarchatAdresse";
import RootLayout from "@/components/rootLayout";
import { Spinner } from "@chakra-ui/react";
import axios from "axios";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaArrowRight, FaChevronRight, FaMapMarkerAlt, FaMapPin, FaSitemap } from "react-icons/fa";
import { FaRegFlag, FaTreeCity } from "react-icons/fa6";
import { MdListAlt } from "react-icons/md";
import { AdresseAttributes } from "../api/models/adresseModel";
import { CommuneAttributes } from "../api/models/communeModel";
import { CountryAttributes } from "../api/models/paysModel";

const KpiCard = ({
  label,
  value,
  icon,
  href,
  colorClass,
  trend,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  href: string;
  colorClass: string;
  trend?: string;
}) => (
  <Link href={href} className="kpi-card group">
    <div className={`kpi-icon ${colorClass}`}>{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--gray-400)" }}>
        {label}
      </p>
      <p className="text-3xl font-extrabold mt-0.5 tabular-nums" style={{ color: "var(--gray-900)" }}>
        {value.toLocaleString()}
      </p>
      {trend && (
        <p className="text-xs mt-1" style={{ color: "var(--gray-400)" }}>
          {trend}
        </p>
      )}
    </div>
    <div
      className="opacity-0 group-hover:opacity-100 transition-opacity"
      style={{ color: "var(--gray-300)" }}
    >
      <FaArrowRight size={13} />
    </div>
  </Link>
);

const QuickLink = ({
  href,
  icon,
  label,
  description,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
}) => (
  <Link
    href={href}
    className="flex items-center gap-4 p-4 rounded-xl bg-white transition-all hover:shadow-md group"
    style={{ border: "1px solid var(--gray-100)" }}
  >
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg transition-transform group-hover:scale-110"
      style={{ background: color, color: "white" }}
    >
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-sm" style={{ color: "var(--gray-900)" }}>
        {label}
      </p>
      <p className="text-xs truncate" style={{ color: "var(--gray-400)" }}>
        {description}
      </p>
    </div>
    <FaChevronRight
      size={11}
      className="opacity-0 group-hover:opacity-100 transition-opacity"
      style={{ color: "var(--gray-300)" }}
    />
  </Link>
);

const Home: React.FC = () => {
  const [countries, setCountries] = useState<CountryAttributes[]>([]);
  const [commune, setCommune] = useState<CommuneAttributes[]>([]);
  const [adresse, setAdresse] = useState<AdresseAttributes[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    document.title = "Tableau de bord — Référentiel d'Adresses";

    const fetchData = async () => {
      try {
        const [resCountries, resAdresse, resVille] = await Promise.all([
          axios.get("/api/paysCtrl"),
          axios.get("/api/adresseCtrl"),
          axios.get("/api/communeCtrl"),
        ]);
        setCountries(resCountries.data.data);
        setAdresse(resAdresse.data.data);
        setCommune(resVille.data.data);
      } catch (error) {
        console.error("Error fetching:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      const s = await getSession();
      if (!s) router.push("/");
    };
    checkSession();
  }, [router]);

  const greetingTime = () => {
    const h = new Date().getHours();
    if (h < 12) return "Bonjour";
    if (h < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  return (
    <RootLayout isAuthenticated={true}>
      {loading ? (
        <div
          className="min-h-screen flex flex-col items-center justify-center"
          style={{ background: "var(--surface-page)" }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
          >
            <Spinner size="md" color="white" />
          </div>
          <p className="text-sm font-medium" style={{ color: "var(--gray-400)" }}>
            Chargement du tableau de bord...
          </p>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in-up">
          {/* Page Header */}
          <div className="page-header">
            <div>
              <h1 className="page-title">
                {greetingTime()},{" "}
                <span className="gradient-text-brand">
                  {session?.user?.name?.split(" ")[0] ?? "Utilisateur"}
                </span>{" "}
                👋
              </h1>
              <p className="page-subtitle">
                Vue d'ensemble du système de référencement national d'adresses
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/subdivision">
                <button className="btn btn-outline">
                  <FaSitemap size={13} />
                  Subdivision
                </button>
              </Link>
              <Link href="/mapAdresse">
                <button className="btn btn-primary">
                  <FaMapPin size={13} />
                  Carte interactive
                </button>
              </Link>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              label="Pays enregistrés"
              value={countries.length}
              icon={<FaRegFlag />}
              href="/pays"
              colorClass="blue"
              trend="Gestion des pays"
            />
            <KpiCard
              label="Départements"
              value={0}
              icon={<MdListAlt size={22} />}
              href="/departements"
              colorClass="green"
              trend="Toutes subdivisions"
            />
            <KpiCard
              label="Villes & Communes"
              value={commune.length}
              icon={<FaTreeCity size={20} />}
              href="/villes"
              colorClass="violet"
              trend="Communes référencées"
            />
            <KpiCard
              label="Adresses référencées"
              value={adresse.length}
              icon={<FaMapMarkerAlt />}
              href="/adresses"
              colorClass="rose"
              trend="Base nationale"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-0 overflow-hidden">
              <BarChartAdresse />
            </div>
            <div className="card p-0 overflow-hidden">
              <Chart />
            </div>
          </div>

          {/* Quick Access Links */}
          <div>
            <p className="section-title">Accès Rapide</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <QuickLink
                href="/subdivision"
                icon={<FaSitemap />}
                label="Subdivision Géographique"
                description="Explorez la hiérarchie territoriale en cascade"
                color="linear-gradient(135deg, #2563eb, #7c3aed)"
              />
              <QuickLink
                href="/mapAdresse"
                icon={<FaMapMarkerAlt />}
                label="Cartographie des Adresses"
                description="Visualisation interactive sur la carte"
                color="linear-gradient(135deg, #0891b2, #2563eb)"
              />
              <QuickLink
                href="/adresses"
                icon={<FaMapPin size={18} />}
                label="Gestion des Adresses"
                description="Référencer, modifier et valider les adresses"
                color="linear-gradient(135deg, #16a34a, #059669)"
              />
            </div>
          </div>
        </div>
      )}
    </RootLayout>
  );
};

export default Home;
