"use client";
import AideTable from "@/components/AideTable";
import RootLayout from "@/components/rootLayout";
import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useMediaQuery } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaFileExcel, FaFileImport } from "react-icons/fa";
import * as XLSX from "xlsx";
import { TooltipAttributes } from "../api/models/tooltipModel";

const Aide = () => {

  const [isSmallScreen] = useMediaQuery("(max-width: 768px)");
  const [loadingExcel, setLoadingExcel] = useState<boolean>(false);
  const [importSuccess, setImportSuccess] = useState<boolean | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const [aide, setAide] = useState<TooltipAttributes[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedAideId, setSelectedAideId] = useState<number | null>(null);
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isConfirmationOpen, onOpen: onConfirmationOpen, onClose: onConfirmationClose } = useDisclosure();


  useEffect(() => {
    document.title = "Aides";
    fetchAide();

  }, []);

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];

    if (file) {
      setLoadingExcel(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target?.result;

        if (data) {
          try {
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const workSheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(workSheet);

            try {
              await axios.post('/api/tooltipCtrl/importExcel', json);
              setImportSuccess(true);
            } catch (error) {
              console.error("Error importing data:", error);
              setImportSuccess(false);
            }
          } catch (error) {
            console.error("Error reading file:", error);
            setImportSuccess(false);
          } finally {
            setLoadingExcel(false);
            onOpen(); // Ouvrir le modal pour afficher le résultat
          }
        } else {
          console.error("No data read from file");
          setLoadingExcel(false);
          setImportSuccess(false);
          onOpen();
        }
      };
      reader.readAsBinaryString(file);
    } else {
      console.error("No file selected");
    }
  };

  const fetchAide = async () => {
    setLoading(true);
    try {
      const nom_application = "Adresse"
      const response = await axios.get(`/api/tooltipCtrl?nom_application=${nom_application}`);
      setAide(response.data.tooltip);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  return (
    <RootLayout isAuthenticated={true}>
      <div className="bg-gray-100">
        <div className="font-semibold text-xl mb-4 text-gray-900">
          {loading ? "" : "Section Aides"}
        </div>

        {loading ? (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <Spinner size="lg" color="primary" />
            <div className="loader">Chargement en cours...</div>
          </div>
        ) : (

          <div className="bg-white p-5 shadow-md rounded-md ">
            <div className="flex flex-col  items-end h-full">
              <Button
                as="label"
                htmlFor="file-upload"
                colorScheme="green"
                className="text-white"
                leftIcon={loadingExcel ? <Spinner size="sm" /> : (isSmallScreen ? <FaFileExcel /> : <FaFileImport />)}
                isLoading={loadingExcel}
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

            <AideTable
              aide={aide}
              searchTerm={searchTerm}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onDelete={(id) => {
                setSelectedAideId(id);
                onDeleteOpen();
              }}
              setCurrentPage={setCurrentPage} />
          </div>)}

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Importation du fichier Excel</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {importSuccess ? "Le fichier a été importé avec succès !" : "Échec de l'importation du fichier."}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={onClose}>
                Fermer
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

      </div>
    </RootLayout>
  );
}

export default Aide;
