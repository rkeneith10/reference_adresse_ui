"use client";

import ConfirmationModal from "@/components/ConfirmationModal";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import RootLayout from "@/components/rootLayout";
import SearchInput from "@/components/SearchInput";
import VilleFormModal from "@/components/VilleFormModal";
import VilleTable from "@/components/VilleTable";
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
import { VilleAttributes } from "../api/models/villeModel";


const Ville: React.FC = () => {
  const router = useRouter()
  const [ville, setVille] = useState<VilleAttributes[]>([])
  const [commune, setCommune] = useState<CommuneAttributes[]>([])
  const [searchTerm, setSearchTerm] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedVilleId, setSelectedVilleId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState<boolean>(true)
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false)
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isConfirmationOpen, onOpen: onConfirmationOpen, onClose: onConfirmationClose } = useDisclosure();


  useEffect(() => {
    document.title = "Villes";
    fetchCommune();
    fetchVille();
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();

      if (!session) {
        router.push('/');
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

  const fetchVille = async () => {
    try {
      const response = await axios.get("/api/villeCtrl");
      setVille(response.data.data);
    } catch (error) {
      console.error("Error fetching ville:", error);
    }
  }

  const handleDeleteVille = async (id: number) => {
    setDeleteLoading(true);
    try {
      await axios.delete(`/api/villeCtrl/${id}`);
      setVille(ville.filter((v) => v.id_ville !== id));
      setModalMessage("La ville a été supprimée avec succès");
      onConfirmationOpen();
    } catch (error) {
      console.error("Failed to delete ville:", error);
    } finally {
      setDeleteLoading(false);
      onDeleteClose();
    }
  };

  const handleAddVilleSuccess = () => {
    fetchVille();
    setModalMessage("La ville a été enregistrée avec succès");
    onConfirmationOpen();
  };

  const handleAddVilleFailed = () => {
    setModalMessage("Cette ville existe déjà dans la base de données");
    onConfirmationOpen();
  };

  const getCommuneNameById = (id: number) => {
    const com = commune.find((c) => c.id_commune === id);
    return com ? com.libelle : "Commune Inconnu";
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
            <VilleTable
              vil={ville}
              getCommuneNameById={getCommuneNameById}
              searchTerm={searchTerm}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              setCurrentPage={setCurrentPage}
              onDelete={(id) => {
                setSelectedVilleId(id);
                onDeleteOpen();
              }}
            />
          </div>
        )}

      </div>
      <VilleFormModal
        communes={commune}
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={handleAddVilleSuccess}
        onFailed={handleAddVilleFailed} />

      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={onConfirmationClose}
        message={modalMessage}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onDelete={() => selectedVilleId && handleDeleteVille(selectedVilleId)}
        deleteLoading={deleteLoading}
      />
    </RootLayout>
  )
}

export default Ville;