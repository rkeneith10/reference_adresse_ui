// Departements.tsx
"use client";
import ConfirmationModal from "@/components/ConfirmationModal";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import DepartementFormModal from "@/components/DepartementFormModal";
import DepartementTable from "@/components/DepartementTable";
import RootLayout from "@/components/rootLayout";
import SearchInput from "@/components/SearchInput";
import {
  Button, Spinner, useDisclosure
} from "@chakra-ui/react";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { DepartementAttributes } from "../api/models/departementModel";
import { CountryAttributes } from "../api/models/paysModel";

const Departements: React.FC = () => {
  const router = useRouter();
  const [countries, setCountries] = useState<CountryAttributes[]>([]);
  const [departments, setDepartments] = useState<DepartementAttributes[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [modalMessage, setModalMessage] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10); // Fixed items per page
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isConfirmationOpen, onOpen: onConfirmationOpen, onClose: onConfirmationClose } = useDisclosure();

  const fetchCountries = async () => {
    try {
      const response = await axios.get("/api/paysCtrl");
      setCountries(response.data.data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/departementCtrl");
      setDepartments(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  useEffect(() => {
    document.title = "Departements";
    fetchCountries();
    fetchDepartments();
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

  const handleDeleteDepartment = async (id: number) => {
    setDeleteLoading(true);
    try {
      await axios.delete(`/api/departementCtrl/${id}`);
      setDepartments(departments.filter((dept) => dept.id_departement !== id));
      setModalMessage("Le département a été supprimé avec succès");
      onConfirmationOpen();
    } catch (error) {
      console.error("Failed to delete department:", error);
    } finally {
      setDeleteLoading(false);
      onDeleteClose();
    }
  };

  const handleAddDepartmentSuccess = () => {
    fetchDepartments();
    setModalMessage("Le département a été enregistré avec succès");
    onConfirmationOpen();
  };

  const handleAddDepartmentFailed = () => {
    setModalMessage("Ce département existe déjà dans la base de données");
    onConfirmationOpen();
  };

  const getCountryNameById = (id: number) => {
    const country = countries.find((c) => c.id_pays === id);
    return country ? country.libelle_pays : "Pays Inconnu";
  };

  return (
    <RootLayout isAuthenticated={true}>
      <div className="bg-gray-100">
        <div className="font-semibold text-xl mb-4 text-gray-900">
          {loading ? "" : "Gestion Départements"}
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
              <Button colorScheme="blue" className="text-white" onClick={onOpen} leftIcon={<FaPlus />}>
                Ajouter
              </Button>
            </div>
            <DepartementTable
              dept={departments}
              searchTerm={searchTerm}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              setCurrentPage={setCurrentPage}
              onDelete={(id) => {
                setSelectedDepartmentId(id);
                onDeleteOpen();
              }}
              getCountryNameById={getCountryNameById}
            />
          </div>
        )}
      </div>
      <DepartementFormModal
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={handleAddDepartmentSuccess}
        onFailed={handleAddDepartmentFailed}
        countries={countries}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onDelete={() => selectedDepartmentId && handleDeleteDepartment(selectedDepartmentId)}
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

export default Departements;
