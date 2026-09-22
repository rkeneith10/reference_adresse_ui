"use client";

import RootLayout from "@/components/rootLayout";
import SubdivisionGeographique from "@/components/SubdivisionGeographique";
import { Button, IconButton, Spinner, Tooltip } from "@chakra-ui/react";
import axios from "axios";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaMapPin, FaPlus, FaRedoAlt } from "react-icons/fa";

const Subdivision = () => {
  const router = useRouter();
  const [dataSubdivision, setDataSubdivision] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchDataSubdivision = async () => {
    try {
      const response = await axios.get("/api/subdivision");
      setDataSubdivision(response.data || []);
    } catch (error) {
      console.error("Erreur lors du chargement de la subdivision:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    document.title = "Subdivision Géographique | Système National de Référencement d'Adresses";
    fetchDataSubdivision();
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (!session) {
        router.push("/");
      }
    };
    checkSession();
  }, [router]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDataSubdivision();
  };

  return (
    <RootLayout isAuthenticated={true}>
      <div className="space-y-6 pb-12">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
          <div>
            <h1 className="font-bold text-2xl text-gray-900 tracking-tight">
              Subdivision Géographique & Administrative
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Explorez la hiérarchie territoriale en cascade : Pays &rarr; Départements &rarr; Communes / Villes &rarr; Adresses
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Tooltip label="Rafraîchir les données territoriales">
              <IconButton
                aria-label="Rafraîchir"
                icon={<FaRedoAlt className={refreshing ? "animate-spin" : ""} />}
                size="sm"
                variant="outline"
                colorScheme="blue"
                onClick={handleRefresh}
                isLoading={refreshing}
              />
            </Tooltip>

            <Link href="/mapAdresse">
              <Button size="sm" variant="outline" colorScheme="blue" leftIcon={<FaMapPin />}>
                Carte globale
              </Button>
            </Link>

            <Link href="/adresses">
              <Button size="sm" colorScheme="blue" leftIcon={<FaPlus />}>
                Nouvelle adresse
              </Button>
            </Link>
          </div>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="min-h-[450px] flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-200 shadow-sm p-10">
            <Spinner size="xl" color="blue.500" thickness="3.5px" />
            <p className="mt-4 text-gray-600 font-medium text-sm">
              Chargement de la hiérarchie géographique...
            </p>
          </div>
        ) : (
          <SubdivisionGeographique data={dataSubdivision} onRefresh={fetchDataSubdivision} />
        )}
      </div>
    </RootLayout>
  );
};

export default Subdivision;
