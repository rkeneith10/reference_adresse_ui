"use client";
import AdresseFormModal from "@/components/AdresseFormModal";
import AdresseTable from "@/components/AdresseTable";
import ConfirmationModal from "@/components/ConfirmationModal";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import RootLayout from "@/components/rootLayout";
import SearchInput from "@/components/SearchInput";
import {
  Button, Input, Spinner, useDisclosure,
  useMediaQuery
} from "@chakra-ui/react";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaFileImport, FaPlus } from "react-icons/fa";
import * as XLSX from "xlsx";
import { AdresseAttributes } from "../api/models/adresseModel";
import { SectionCommuneAttributes } from "../api/models/sectionCommunalModel";

const Adresses: React.FC = () => {
  const router = useRouter();
  const [adresse, setAdresse] = useState<AdresseAttributes[]>([]);
  const [file, setFile] = useState<File | null>(null)
  const [section, setSection] = useState<SectionCommuneAttributes[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingExcel, setLoadingExcel] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState("");
  const [selectedAdressetId, setSelectedAdresseId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10); // Fixed items per page
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [isSmallScreen] = useMediaQuery("(max-width: 768px)");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isConfirmationOpen, onOpen: onConfirmationOpen, onClose: onConfirmationClose } = useDisclosure();

  const fetchSection = async () => {
    try {
      const response = await axios.get("/api/sectionCommunalCtrl");
      setSection(response.data.data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }

  };
  const getSectionNameById = (id: number) => {
    const sect = section.find((c) => c.id_sectioncommune === id);
    return sect ? sect.libelle : " Inconnu";
  };

  const handleDeleteAdresse = async (id: number) => {
    setDeleteLoading(true);
    try {
      await axios.delete(`/api/adresseCtrl/${id}`);
      setAdresse(adresse.filter((adr) => adr.id_adresses !== id));
      setModalMessage("L'adresse a été supprimée avec succès");
      onConfirmationOpen();
    } catch (error) {
      console.error("Failed to delete adresse:", error);
    } finally {
      setDeleteLoading(false);
      onDeleteClose();
    }
  };
  const fetchAdresse = async () => {
    setLoading(true)
    try {
      const response = await axios.get("/api/adresseCtrl")
      setAdresse(response.data.data)
      setLoading(false);
    } catch (error) { console.error('Error fetching adresse') }
  }

  const handleAddAdressSuccess = () => {
    fetchAdresse();
    setModalMessage("L'adresse a été enregistré avec succès");
    onConfirmationOpen();
  };

  const handleAddAdresseFailed = () => {
    setModalMessage("Cette adresse existe déjà dans la base de données");
    onConfirmationOpen();
  };
  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    console.log("File selected:", event.target.files[0]);

    if (file) {
      setLoadingExcel(true);
      console.log("File selected:", file);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target?.result;
        console.log("File data:", data); // Log the file data
        if (data) {
          try {
            const workbook = XLSX.read(data, { type: 'binary' });
            console.log("Workbook:", workbook);
            const sheetName = workbook.SheetNames[0];
            const workSheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(workSheet);
            console.log("Converted JSON:", json);

            try {
              await axios.post('/api/adresseCtrl/importExcel', json);
              console.log("Data successfully imported");
              fetchAdresse();
            } catch (error) {
              console.error("Error importing data:", error);
            }
          } catch (error) {
            console.error("Error reading file:", error);
          } finally {
            setLoadingExcel(false);
          }
        } else {
          console.error("No data read from file");
          setLoadingExcel(false);
        }
      };
      reader.readAsBinaryString(file);
    } else {
      console.error("No file selected");
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();

      if (!session) {
        router.push('/');
      }
    };

    checkSession();
  }, [router]);

  useEffect(() => {
    document.title = "Adresses";
    fetchSection();
    fetchAdresse();
  }, []);
  return (
    <RootLayout isAuthenticated={true}>

      <div className="bg-gray-100">
        <div className="font-semibold text-xl mb-4 text-gray-900">
          {loading ? "" : "Gestion Adresses"}
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

              <div className="flex space-x-2">
                <Button colorScheme="blue" className="text-white" onClick={onOpen} leftIcon={<FaPlus />}>
                  Ajouter
                </Button>
                <Button
                  as="label"
                  htmlFor="file-upload"
                  colorScheme="green"
                  className="text-white"
                  leftIcon={loadingExcel ? undefined : (isSmallScreen ? <FaFileExcel /> : <FaFileImport />)}
                >
                  {loadingExcel ? "Téléchargement..." : (isSmallScreen ? "" : "Importer Excel")}
                </Button>
                <Input
                  type="file"
                  id="file-upload"
                  accept=".xlsx, .xls"
                  hidden
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <AdresseTable
              adresse={adresse}
              searchTerm={searchTerm}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              setCurrentPage={setCurrentPage}
              onDelete={(id) => {
                setSelectedAdresseId(id);
                onDeleteOpen();
              }}
              getSectionNameById={getSectionNameById}
            />
          </div>
        )}
      </div>
      <AdresseFormModal
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={handleAddAdressSuccess}
        onFailed={handleAddAdresseFailed}
        sectioncommunales={section}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onDelete={() => selectedAdressetId && handleDeleteAdresse(selectedAdressetId)}
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

export default Adresses;
