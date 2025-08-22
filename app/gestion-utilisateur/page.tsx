"use client";

import ConfirmationModal from "@/components/ConfirmationModal";
import RootLayout from "@/components/rootLayout";
import SearchInput from "@/components/SearchInput";
import UserFormModal from "@/components/userFormModal";
import UserTable from "@/components/userTable";
import {
  Button,
  Spinner,
  useDisclosure
} from "@chakra-ui/react";
import axios from "axios";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import Unauthorized from "../unauthorized/page";


const GestionUtilisateurs: React.FC = () => {
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const [users, setUsers] = useState<any>()
  const [loading, setLoading] = useState<boolean>(true)
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false)
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isConfirmationOpen, onOpen: onConfirmationOpen, onClose: onConfirmationClose } = useDisclosure();
  const { data: session } = useSession();
  useEffect(() => {
    document.title = "Gestion Utilisateurs";
    fetchUser();
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


  const fetchUser = async () => {
    try {
      const response = await axios.get("/api/userCtrl");
      console.log("users:", response.data.data);
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };



  const handleAddUserSucess = () => {
    fetchUser();
    setModalMessage("L'utilisateur a été crée avec succès");
    onConfirmationOpen();
  };

  const handleAddUserFailed = () => {
    setModalMessage("Cet utlisateur existe déjà dans la base de données");
    onConfirmationOpen();
  };

  if (session && session.user.role !== 'admin') {
    return (
      <Unauthorized />
    )
  }

  return (
    <RootLayout isAuthenticated={true}>

      <div className="bg-gray-100">
        <div className="font-semibold text-xl mb-4 text-gray-900">
          {loading ? "" : "Gestion Utilisateurs"}
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
            <UserTable
              user={users ||[]}

              searchTerm={searchTerm}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              setCurrentPage={setCurrentPage}
              onDelete={(id) => {
                setSelectedUserId(id);
                onDeleteOpen();
              }}
            />
          </div>
        )}

      </div>
      <UserFormModal

        isOpen={isOpen}
        onClose={onClose}
        onSuccess={handleAddUserSucess}
        onFailed={handleAddUserFailed} />

      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={onConfirmationClose}
        message={modalMessage}
      />

    </RootLayout>
  );
};

export default GestionUtilisateurs;
