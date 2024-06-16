"use client";
import RootLayout from "@/components/rootLayout";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaRegEye,
  FaRegTrashAlt,
  FaSearch,
} from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { deleteCountry } from "../actions/actionCountry";
import { CountryAttributes } from "../api/models/paysModel";

const Pays: React.FC = () => {
  const [countries, setCountries] = useState<CountryAttributes[]>([]);
  const [itemsperpage, setItemperpage] = useState(10);
  const [page, setPage] = React.useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<Boolean>(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);
  const [adding, setAdding] = useState<Boolean>(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [scrollBehavior, setScrollBehavior] = useState<any>("inside");
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [deleting, setDeleting] = useState<Boolean>(false)
  const [pays, setPays] = useState({
    libelle: "",
    code_pays: "",
    continent: "",
    indicatif_tel: "",
    fuseau_horaire: "",
  });

  const [errors, setErrors] = useState({
    libelle: "",
    code_pays: "",
    continent: "",
    indicatif_tel: "",
    fuseau_horaire: "",
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setPays({ ...pays, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear the error message when the user starts typing
  };
  const handleCloseConfirmation = () => {
    setIsConfirmationOpen(false);
  };
  const validateForm = () => {
    let valid = true;
    const newErrors = { libelle: "", code_pays: "", continent: "", indicatif_tel: "", fuseau_horaire: "" };

    if (!pays.libelle) {
      newErrors.libelle = "Nom du pays est requis";
      valid = false;
    }
    if (!pays.code_pays) {
      newErrors.code_pays = "Code du pays est requis";
      valid = false;
    }
    if (!pays.continent) {
      newErrors.continent = "Continent est requis";
      valid = false;
    }
    if (!pays.indicatif_tel) {
      newErrors.indicatif_tel = "Indicatif Téléphonique est requis";
      valid = false;
    }
    if (!pays.fuseau_horaire) {
      newErrors.fuseau_horaire = "Fuseau horaire est requis";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleDeleteCountry = async (id_pays: number) => {
    setDeleting(true)
    try {
      await deleteCountry(id_pays);
      setCountries(countries.filter((country) => country.id_pays !== id_pays));
      setDeleting(false)
      setDeleteModalOpen(false);
    } catch (error) { }
  };



  const addCountry = async () => {
    if (!validateForm()) {
      return;
    }
    setAdding(true);
    try {
      const response = await axios.post("/api/paysCtrl", pays, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        setAdding(false);
        setPays({
          libelle: "",
          code_pays: "",
          continent: "",
          indicatif_tel: "",
          fuseau_horaire: "",
        });
        onClose(); // Fermer le modal si nécessaire
        setModalMessage("Le pays a été enregistré avec succès.")
        setIsConfirmationOpen(true);
        fetchData();

      }
      // else if (response.status === 400) {
      //   setAdding(false);
      //   onClose();
      //   setModalMessage(response.data.message);
      //   setIsConfirmationOpen(true);
      // } 
      else {
        console.log("Échec de l'ajout du pays");
      }
    } catch (error) {
      console.log("Échec de l'ajout du pays", error);
      setIsConfirmationOpen(true);
      setModalMessage("Ce Pays est déjà  existé");
    } finally {
      setAdding(false); // Assurez-vous que l'état de l'ajout est toujours faux
    }
  };


  const filteredCountries = countries.filter((country) =>
    country.libelle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = currentPage * itemsperpage;
  const endIndex = Math.min(
    (currentPage + 1) * itemsperpage,
    filteredCountries.length
  );

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

  const handleCloseModal = () => {
    setModalOpen(false);
    fetchData(); // Rechargez les données si nécessaire après la fermeture du modal
  };

  useEffect(() => {
    document.title = "Pays";
    fetchData();

    return () => {
      // Nettoyage si nécessaire
    };

  }, []);

  return (
    <RootLayout isAuthenticated={true}>


      <div className="bg-gray-100 ">
        <Modal isOpen={modalOpen} onClose={handleCloseModal}>
          <ModalContent>
            <ModalHeader>Message</ModalHeader>
            <ModalBody>{modalMessage}</ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={handleCloseModal}>
                Fermer
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <div className="font-semibold text-xl mb-4 text-gray-900">
          {loading ? ("") : ("Pays")}
        </div>

        {loading ? (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <Spinner size="lg" color="primary" />
            <div className="loader">Chargement en cours...</div>
          </div>
        ) : (
          <div className="bg-white p-5 shadow-md rounded-md">
            <div className="flex flex-row justify-between mb-4">
              <Input
                isClearable
                className="w-full sm:max-w-[20%] mr-4"
                placeholder="Rechercher un pays"
                startContent={<FaSearch className="text-gray-500" />}
                value={searchTerm}
                onChange={(e: any) => setSearchTerm(e.target.value)}
                onClear={() => setSearchTerm("")}
              />

              {/* Modal pour ajouter d'autres pays */}
              <div>
                <Button
                  color="primary"
                  className="text-white"
                  onPress={onOpen}
                  startContent={<FaPlus />}
                >
                  Ajouter
                </Button>
                <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onClose} scrollBehavior={scrollBehavior}>
                  <ModalContent>
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        Ajouter un pays
                      </ModalHeader>
                      <ModalBody className="overflow-auto max-h-[50vh]">
                        <div className="mb-1 ">
                          <label
                            htmlFor="pays"
                            className="block  text-medium font-normal"
                          >
                            Nom du pays
                          </label>
                          <input
                            type="text"
                            value={pays.libelle}
                            onChange={handleInputChange}
                            placeholder="Entrer le nom du pays"
                            name="libelle"
                            className="border rounded-md w-full p-2"
                          />
                          {errors.libelle && <span className="text-red-500 text-sm">{errors.libelle}</span>}
                        </div>

                        <div className="mb-1">
                          <label
                            htmlFor="codepays"
                            className="block  text-medium font-normal"
                          >
                            Code du pays
                          </label>
                          <input
                            type="text"
                            value={pays.code_pays}
                            onChange={handleInputChange}
                            placeholder="Entrer le code du pays"
                            className="border rounded-md w-full p-2"
                            name="code_pays"
                          />
                          {errors.code_pays && <span className="text-red-500 text-sm">{errors.code_pays}</span>}
                        </div>
                        <div className="mb-1">
                          <label
                            htmlFor="continents"
                            className="block  text-medium font-normal"
                          >
                            Continent
                          </label>
                          <input
                            type="text"
                            value={pays.continent}
                            onChange={handleInputChange}
                            placeholder="Entrer le continent"
                            id="continents"
                            name="continent"
                            className="border rounded-md w-full p-2"
                          />
                          {errors.continent && <span className="text-red-500 text-sm">{errors.continent}</span>}
                        </div>
                        <div className="mb-1">
                          <label
                            htmlFor="indicatif"
                            className="block  text-medium font-normal"
                          >
                            Indicatif Téléphonique
                          </label>
                          <input
                            type="text"
                            value={pays.indicatif_tel}
                            onChange={handleInputChange}
                            placeholder="Entrer l'indicatif téléphonique"
                            className="border rounded-md w-full p-2"
                            name="indicatif_tel"
                          />
                          {errors.indicatif_tel && <span className="text-red-500 text-sm">{errors.indicatif_tel}</span>}
                        </div>

                        <div className="mb-1">
                          <label
                            htmlFor="fuseauhoraire"
                            className="block  text-medium font-normal"
                          >
                            Fuseau horaire
                          </label>
                          <input
                            type="text"
                            value={pays.fuseau_horaire}
                            onChange={handleInputChange}
                            placeholder="Entrer le fuseau horaire"
                            className="border rounded-md w-full p-2"
                            name="fuseau_horaire"
                          />
                          {errors.fuseau_horaire && <span className="text-red-500 text-sm">{errors.fuseau_horaire}</span>}
                        </div>
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="danger"
                          variant="light"
                          onPress={onClose}
                        >
                          Close
                        </Button>
                        <Button color="primary" onPress={addCountry} disabled={adding ? true : false}>
                          {adding ? (
                            <>
                              Enregistrer <Spinner size="sm" color="white" className="ml-2 " />
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

            {/* Table data */}
            <div className="relative overflow-x-scroll">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Pays
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Code pays
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Continent
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Ind. Telephonique
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Fuseau Horaire
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <span className="sr-only">Action</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    loading ? (
                      <div className="min-h-screen flex items-center justify-center bg-gray-100">
                        <div className="loader">Loading...</div>
                      </div>
                    ) :
                      filteredCountries.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-4 font-semibold">
                            Pas de pays
                          </td>
                        </tr>
                      ) : (
                        filteredCountries
                          .slice(startIndex, endIndex)
                          .map((country, index) => (
                            <tr
                              key={country.indicatif_tel}
                              className="bg-white hover:bg-gray-50"
                            >
                              <td className="text-left py-3 px-4 border-b border-gray-200">
                                {country.libelle}
                              </td>
                              <td className="text-left py-3 px-4 border-b border-gray-200">
                                {country.code_pays}
                              </td>
                              <td className="text-left py-3 px-4 border-b border-gray-200">
                                {country.continent}
                              </td>
                              <td className="text-left py-3 px-4 border-b border-gray-200">
                                {country.indicatif_tel}
                              </td>
                              <td className="text-left py-3 px-4 border-b border-gray-200">
                                {country.fuseau_horaire}
                              </td>
                              <td className="text-left py-3 px-4 border-b border-gray-200">
                                <div className="flex ">
                                  <Button isIconOnly size="sm" color="danger" variant="light" onClick={() => {
                                    setSelectedCountryId(country.id_pays);
                                    setDeleteModalOpen(true);
                                  }} >
                                    <FaRegTrashAlt className="text-lg" />
                                  </Button>
                                  <Link href={`/pays/${country.id_pays}`}>
                                    <Button isIconOnly size="sm" color="primary" variant="light">
                                      <FaRegEye className="text-lg" />
                                    </Button>
                                  </Link>

                                </div>
                              </td>
                            </tr>
                          ))
                      )}
                </tbody>
              </table>
            </div>
            {/* Pagination controls */}
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
              {[...Array(Math.ceil(filteredCountries.length / itemsperpage))].map(
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
                  Math.ceil(filteredCountries.length / itemsperpage) - 1
                }
                className="mx-1 py-1 px-3 rounded-full hover:bg-gray-300"
              >
                <FaChevronRight className="text-gray-500 h-2 w-2" />
              </button>
            </div>

            {/* Modal de suppression */}
            <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
              <ModalContent>
                <ModalHeader>Confirmation de suppression</ModalHeader>
                <ModalBody>Voulez-vous vraiment supprimer ce pays ?</ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={() => setDeleteModalOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    color="primary"
                    onPress={() => {
                      if (selectedCountryId !== null) {
                        handleDeleteCountry(selectedCountryId);
                      }
                    }}
                    disabled={deleting ? true : false}
                  >

                    {deleting ? (
                      <>
                        Suppression en cours <Spinner size="sm" color="white" className="ml-2 " />
                      </>
                    ) : (
                      "Supprimer"
                    )}
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        )}
      </div>
      <Modal backdrop="blur" isOpen={isConfirmationOpen} onClose={handleCloseConfirmation}>
        <ModalContent>
          <ModalHeader>Confirmation</ModalHeader>
          <ModalBody>{modalMessage}</ModalBody>
          <ModalFooter>
            <Button onPress={handleCloseConfirmation} color="primary">OK</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </RootLayout>
  );
};

export default Pays;
