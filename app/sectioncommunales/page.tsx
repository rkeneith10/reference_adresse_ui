"use client";

import ConfirmationModal from "@/components/ConfirmationModal";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import RootLayout from "@/components/rootLayout";
import SearchInput from "@/components/SearchInput";
import SectionCommunalTable from "@/components/sectionCommmunalTable";
import SectionCommunalFormModal from "@/components/SectionCommunalFormModal";
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
import { SectionCommuneAttributes } from "../api/models/sectionCommunalModel";

const SectionCommunales: React.FC = () => {
  const router = useRouter()
  const [sectioncommunal, setSectioncommunal] = useState<SectionCommuneAttributes[]>([])
  const [commune, setCommune] = useState<CommuneAttributes[]>([])
  const [searchTerm, setSearchTerm] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedSectionCommuneId, setSelectedSectionommuneId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState<boolean>(true)
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false)
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isConfirmationOpen, onOpen: onConfirmationOpen, onClose: onConfirmationClose } = useDisclosure();

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();

      if (!session) {
        router.push('/'); // Redirection vers la page d'accueil si la session n'est pas active
      }
    };

    checkSession();
  }, [router]);

  useEffect(() => {
    document.title = "Section Communale";
    fetchsection();
    fetchCommune();
  }, []);
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
  const fetchsection = async () => {
    try {
      const response = await axios.get("/api/sectionCommunalCtrl");
      setSectioncommunal(response.data.data);
    } catch (error) {
      console.error("Error fetching departement:", error);
    }
  }
  const handleDeleteSection = async (id: number) => {
    setDeleteLoading(true);
    try {
      await axios.delete(`/api/sectionCommunalCtrl/${id}`);
      setSectioncommunal(sectioncommunal.filter((com) => com.id_sectioncommune !== id));
      setModalMessage("La section communale a été supprimée avec succès");
      onConfirmationOpen();
    } catch (error) {
      console.error("Failed to delete coomune:", error);
    } finally {
      setDeleteLoading(false);
      onDeleteClose();
    }
  };

  const handleAddCommuneuccess = () => {
    fetchsection();
    setModalMessage("La section communale a été enregistrée avec succès");
    onConfirmationOpen();
  };

  const handleAddCommuneFailed = () => {
    setModalMessage("Cette section existe déjà dans la base de données");
    onConfirmationOpen();
  };

  const getCommuneNameById = (id: number) => {
    const comm = commune.find((c) => c.id_commune === id);
    return comm ? comm.libelle : "Commune Inconnue";
  };
  return (
    <RootLayout isAuthenticated={true}>

      <div className="bg-gray-100">
        <div className="font-semibold text-xl mb-4 text-gray-900">
          {loading ? "" : "Gestion Communes"}
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
            <SectionCommunalTable
              comm={sectioncommunal}
              getCommuneNameById={getCommuneNameById}
              searchTerm={searchTerm}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              setCurrentPage={setCurrentPage}
              onDelete={(id) => {
                setSelectedSectionommuneId(id);
                onDeleteOpen();
              }}
            />
          </div>
        )}

      </div>
      <SectionCommunalFormModal
        communes={commune}
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
        onDelete={() => selectedSectionCommuneId && handleDeleteSection(selectedSectionCommuneId)}
        deleteLoading={deleteLoading}
      />
    </RootLayout>
  );
};

export default SectionCommunales;
