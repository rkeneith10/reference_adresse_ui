"use client";
import RootLayout from "@/components/rootLayout";
import {
  Button, Input, Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader, Select, SelectItem, Spinner, useDisclosure
} from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaPlus, FaRegEye, FaRegTrashAlt, FaSearch } from "react-icons/fa";
import { DepartementAttributes } from "../api/models/departementModel";
import { CountryAttributes } from "../api/models/paysModel";

const Departements: React.FC = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [adding, setAdding] = useState(false);
  const [countries, setCountries] = useState<CountryAttributes[]>([]);
  const [dept, setDept] = useState<DepartementAttributes[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [modalMessge, setMessageModal] = useState("");
  const [departement, setDepartement] = useState({
    libelle: "",
    code_departement: "",
    chef_lieux: "",
    id_pays: "",
  });

  const [errors, setErrors] = useState({
    libelle: "",
    code_departement: "",
    chef_lieux: "",
    id_pays: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDepartement({ ...departement, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };
  const handleCloseConfirmation = () => {
    setIsConfirmationOpen(false);
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { libelle: "", code_departement: "", chef_lieux: "", id_pays: "" };

    if (!departement.libelle) {
      newErrors.libelle = "Nom du departement est requis";
      valid = false;
    }
    if (!departement.code_departement) {
      newErrors.code_departement = "Code du departement est requis";
      valid = false;
    }
    if (!departement.chef_lieux) {
      newErrors.chef_lieux = "Chef-lieux est requis";
      valid = false;
    }
    if (!departement.id_pays) {
      newErrors.id_pays = "Le pays de reference est requis";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const getCountryNameById = (id: number) => {
    const country = countries.find((c) => c.id_pays === id);
    return country ? country.libelle : "Pays Inconnu";
  };

  const addDepartement = async () => {
    if (!validateForm()) {
      return;
    }
    setAdding(true);
    try {
      const response = await axios.post("/api/departementCtrl", departement, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        setDepartement({
          libelle: "",
          code_departement: "",
          chef_lieux: "",
          id_pays: "",
        });
        onClose();
        setMessageModal("Le département a été enregistré avec succès.")
        setIsConfirmationOpen(true); // Ouvrir le modal de confirmation
        fetchData();
      }
    } catch (error) {
      setMessageModal("Ce département est déjà existé")
      setIsConfirmationOpen(true);
      console.error("Échec de l'ajout du département", error);
    } finally {
      setAdding(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/departementCtrl");
      setDept(response.data.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataPays = async () => {
    try {
      const response = await axios.get("/api/paysCtrl");
      setCountries(response.data.data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  useEffect(() => {
    fetchDataPays();
    fetchData();
    document.title = "Departement";
  }, []);

  const filteredDepartements = dept.filter((dp) =>
    dp.libelle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = currentPage * itemsPerPage;
  const endIndex = Math.min((currentPage + 1) * itemsPerPage, filteredDepartements.length);

  return (
    <RootLayout isAuthenticated={true}>
      <div className="bg-gray-100">
        <div className="font-semibold text-xl mb-4 text-gray-90">
          {loading ? "" : <div>D&eacute;partements</div>}
        </div>
        {loading ? (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <Spinner size="lg" color="primary" />
            <div className="loader">Chargement en cours...</div>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-md p-5">
            <div className="flex flex-row justify-between mb-4">
              <Input
                isClearable
                className="w-full sm:max-w-[20%] mr-4"
                placeholder="Rechercher un departement"
                startContent={<FaSearch className="text-gray-500" />}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div>
                <Button
                  color="primary"
                  className="text-white"
                  onPress={onOpen}
                  startContent={<FaPlus />}
                >
                  Ajouter
                </Button>
                <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="outside">
                  <ModalContent>
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        Ajouter un d&eacute;partement
                      </ModalHeader>
                      <ModalBody>
                        <div className="mb-1">
                          <label htmlFor="codepays" className="block text-medium font-normal">
                            Choisir un pays
                          </label>
                          <Select
                            placeholder="Choisir un pays"
                            className="w-full"
                            name="id_pays"
                            onChange={handleInputChange}
                            disableSelectorIconRotation
                          >
                            {countries
                              .sort((a, b) => a.libelle.localeCompare(b.libelle))
                              .map((country) => (
                                <SelectItem key={country.id_pays} value={country.id_pays}>
                                  {country.libelle}
                                </SelectItem>
                              ))}
                          </Select>
                          {errors.id_pays && (
                            <span className="text-red-500 text-sm">{errors.id_pays}</span>
                          )}
                        </div>
                        <div className="mb-1">
                          <label htmlFor="libelle" className="block text-medium font-normal">
                            Nom du departement
                          </label>
                          <input
                            type="text"
                            placeholder="Entrer le nom du departement"
                            onChange={handleInputChange}
                            id="libelle"
                            name="libelle"
                            className="border rounded-md w-full p-2"
                          />
                          {errors.libelle && (
                            <span className="text-red-500 text-sm">{errors.libelle}</span>
                          )}
                        </div>
                        <div className="mb-1">
                          <label htmlFor="code_departement" className="block text-medium font-normal">
                            Code du departement
                          </label>
                          <input
                            type="text"
                            placeholder="Entrer le code du departement"
                            onChange={handleInputChange}
                            id="code_departement"
                            name="code_departement"
                            className="border rounded-md w-full p-2"
                          />
                          {errors.code_departement && (
                            <span className="text-red-500 text-sm">{errors.code_departement}</span>
                          )}
                        </div>
                        <div className="mb-1">
                          <label htmlFor="chef_lieux" className="block text-medium font-normal">
                            Chef Lieux
                          </label>
                          <input
                            type="text"
                            placeholder="Entrer le chef-lieux"
                            onChange={handleInputChange}
                            id="chef_lieux"
                            name="chef_lieux"
                            className="border rounded-md w-full p-2"
                          />
                          {errors.chef_lieux && (
                            <span className="text-red-500 text-sm">{errors.chef_lieux}</span>
                          )}
                        </div>
                      </ModalBody>
                      <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>
                          Fermer
                        </Button>
                        <Button color="primary" onClick={addDepartement} disabled={adding}>
                          {adding ? (
                            <>
                              Enregistrer <Spinner size="sm" color="white" className="ml-2" />
                            </>
                          ) : (
                            "Enregistrer"
                          )}
                        </Button>
                      </ModalFooter>
                    </>
                  </ModalContent>
                </Modal>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      #
                    </th>
                    <th scope="col" className="px-6 py-3">
                      D&eacute;partement
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Code d&eacute;partement
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Chef-Lieux
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Pays Reference
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDepartements.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-4">
                        Aucun departement trouv&eacute;
                      </td>
                    </tr>
                  ) : (
                    filteredDepartements.slice(startIndex, endIndex).map((dp, index) => (
                      <tr key={dp.id_departement}>
                        <td className="text-left py-3 px-4 border-b border-gray-200">
                          {index + 1}
                        </td>
                        <td className="text-left py-3 px-4 border-b border-gray-200">
                          {dp.libelle}
                        </td>
                        <td className="text-left py-3 px-4 border-b border-gray-200">
                          {dp.code_departement}
                        </td>
                        <td className="text-left py-3 px-4 border-b border-gray-200">
                          {dp.chef_lieux}
                        </td>
                        <td className="text-left py-3 px-4 border-b border-gray-200">
                          {getCountryNameById(dp.id_pays)}
                        </td>
                        <td className="text-left py-3 px-4 border-b border-gray-200">
                          <div className="flex space-x-2">
                            <Button isIconOnly size="sm" color="danger" variant="light">
                              <FaRegTrashAlt className="text-lg" />
                            </Button>
                            <Button isIconOnly size="sm" color="primary" variant="light">
                              <FaRegEye className="text-lg" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center my-4">
              {/* Flèche gauche */}
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 0}
                className="mx-1 py-1 px-3 rounded-full hover:bg-gray-300"
              >
                <FaChevronLeft className="text-gray-500 h-2 w-2" />
              </button>
              {/* Boutons de pagination */}
              {[...Array(Math.ceil(filteredDepartements.length / itemsPerPage))].map(
                (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`mx-1 py-1 px-3 rounded-full ${currentPage === index
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                      }`}
                  >
                    {index + 1}
                  </button>
                )
              )}
              {/* Flèche droite */}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={
                  currentPage ===
                  Math.ceil(filteredDepartements.length / itemsPerPage) - 1
                }
                className="mx-1 py-1 px-3 rounded-full hover:bg-gray-300"
              >
                <FaChevronRight className="text-gray-500 h-2 w-2" />
              </button>
            </div>
          </div>
        )}
      </div>
      <Modal backdrop="blur" isOpen={isConfirmationOpen} onClose={handleCloseConfirmation}>
        <ModalContent>
          <ModalHeader>Confirmation</ModalHeader>
          <ModalBody>{modalMessge}</ModalBody>
          <ModalFooter>
            <Button onPress={handleCloseConfirmation} color="primary">OK</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </RootLayout>
  );
};

export default Departements;
