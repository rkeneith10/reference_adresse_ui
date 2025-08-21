"use client";

import CommuneFormModal from "@/components/CommuneFormModal";
import CommuneTable from "@/components/CommuneTable";
import ConfirmationModal from "@/components/ConfirmationModal";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import RootLayout from "@/components/rootLayout";
import SearchInput from "@/components/SearchInput";
import {
  Button,
  Spinner,
  useDisclosure
} from "@chakra-ui/react";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { CommuneAttributes } from "../api/models/communeModel";
import { DepartementAttributes } from "../api/models/departementModel";

const Commune: React.FC = () => {
  const router = useRouter()
  const [departements, setDepartements] = useState<DepartementAttributes[]>([])
  const [commune, setCommune] = useState<CommuneAttributes[]>([])
  const [searchTerm, setSearchTerm] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCommuneId, setSelectedCommuneId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState<boolean>(true)
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false)
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isConfirmationOpen, onOpen: onConfirmationOpen, onClose: onConfirmationClose } = useDisclosure();

  useEffect(() => {
    document.title = "Communes";
    fetchDepartement();
    fetchCommune();
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

  const fetchCommune = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/communeCtrl");
      setCommune(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };
  const fetchDepartement = async () => {
    try {
      const response = await axios.get("/api/departementCtrl");
      setDepartements(response.data.data);
    } catch (error) {
      console.error("Error fetching departement:", error);
    }
  }
  const handleDeleteCommune = async (id: number) => {
    setDeleteLoading(true);
    try {
      await axios.delete(`/api/communeCtrl/${id}`);
      setCommune(commune.filter((com) => com.id_commune !== id));
      setModalMessage("La commune a été supprimée avec succès");
      onConfirmationOpen();
    } catch (error) {
      console.error("Failed to delete coomune:", error);
    } finally {
      setDeleteLoading(false);
      onDeleteClose();
    }
  };

  const handleAddCommuneuccess = () => {
    fetchCommune();
    setModalMessage("La ville a été enregistrée avec succès");
    onConfirmationOpen();
  };

  const handleAddCommuneFailed = () => {
    setModalMessage("Cette ville existe déjà dans la base de données");
    onConfirmationOpen();
  };

  const getDepartementNameById = (id: number) => {
    const dept = departements.find((d) => d.id_departement === id);
    return dept ? dept.libelle_departement : "Departement Inconnu";
  };

  return (
    <RootLayout isAuthenticated={true}>

      <div className="bg-gray-100">
        <div className="font-semibold text-xl mb-4 text-gray-900">
          {loading ? "" : "Gestion Villes"}
        </div>

        {loading ? (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <Spinner size="lg" color="primary" />
            <div className="loader">Chargement en cours...</div>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-md p-5">
            <div className="flex flex-row justify-between mb-4">
              <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              <Button colorScheme="blue" className="text-white" onClick={onOpen} leftIcon={<FaPlus />}>
                Ajouter
              </Button>
            </div>
            <CommuneTable
              comm={commune}
              getDepartementNameById={getDepartementNameById}
              searchTerm={searchTerm}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              setCurrentPage={setCurrentPage}
              onDelete={(id) => {
                setSelectedCommuneId(id);
                onDeleteOpen();
              }}
            />
          </div>
        )}

      </div>
      <CommuneFormModal
        departements={departements}
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={handleAddCommuneuccess}
        onFailed={handleAddCommuneFailed} />

      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={onConfirmationClose}
        message={modalMessage}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onDelete={() => selectedCommuneId && handleDeleteCommune(selectedCommuneId)}
        deleteLoading={deleteLoading}
      />
    </RootLayout>
  );
};

export default Commune;
