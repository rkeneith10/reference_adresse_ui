// Pays.tsx
"use client";
import RootLayout from "@/components/rootLayout";
import { Button, Spinner, useDisclosure } from "@nextui-org/react";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import ConfirmationModal from "../../components/ConfirmationModal";
import CountryFormModal from "../../components/CountryFormModal";
import CountryTable from "../../components/CountryTable";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import SearchInput from "../../components/SearchInput";
import { CountryAttributes } from "../api/models/paysModel";

const Pays: React.FC = () => {
  const [countries, setCountries] = useState<CountryAttributes[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<Boolean>(true);
  const router = useRouter();
  const [modalMessage, setModalMessage] = useState("");
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10); // Fixed items per page
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isConfirmationOpen, onOpen: onConfirmationOpen, onClose: onConfirmationClose } = useDisclosure();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/paysCtrl");
      setCountries(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    document.title = "Pays";
    fetchData();
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();

      if (!session) {
        router.push('/'); // Redirection vers la page d'accueil si la session n'est pas active
      }
    };

    checkSession();
  }, [router]);

  const handleDeleteCountry = async (id_pays: number) => {
    setDeleteLoading(true);
    try {
      await axios.delete(`/api/paysCtrl/${id_pays}`);
      setCountries(countries.filter((country) => country.id_pays !== id_pays));
      setModalMessage("Le pays a été supprimé avec succès");
      onConfirmationOpen();
    } catch (error) {
      console.error("Failed to delete country:", error);
    } finally {
      setDeleteLoading(false);
      onDeleteClose();
    }
  };

  const handleAddCountrySuccess = () => {
    fetchData();
    setModalMessage("Le pays a été enregistré avec succès");
    onConfirmationOpen();
  };
  const handleAddCountryFailed = () => {
    setModalMessage("Ce pays existe deja dans la base de donnees")
    onConfirmationOpen();
  }

  return (
    <RootLayout isAuthenticated={true}>
      <div className="bg-gray-100 ">
        <div className="font-semibold text-xl mb-4 text-gray-900">
          {loading ? "" : "Gestion Pays"}
        </div>
        {loading ? (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <Spinner size="lg" color="primary" />
            <div className="loader">Chargement en cours...</div>
          </div>
        ) : (
          <div className="bg-white p-5 shadow-md rounded-md">
            <div className="flex flex-row justify-between mb-4">
              <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              <Button color="primary" className="text-white" onPress={onOpen} startContent={<FaPlus />}>
                Ajouter
              </Button>
            </div>
            <CountryTable
              countries={countries}
              searchTerm={searchTerm}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              setCurrentPage={setCurrentPage}
              onDelete={(id) => {
                setSelectedCountryId(id);
                onDeleteOpen();
              }}
            />
          </div>
        )}
      </div>
      <CountryFormModal isOpen={isOpen} onClose={onClose} onSuccess={handleAddCountrySuccess} onFailed={handleAddCountryFailed} />
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onDelete={() => selectedCountryId && handleDeleteCountry(selectedCountryId)}
        deleteLoading={deleteLoading}
      />
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={onConfirmationClose}
        message={modalMessage}
      />
      {deleteLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <Spinner size="lg" color="primary" />
        </div>
      )}
    </RootLayout>
  );
};

export default Pays;
