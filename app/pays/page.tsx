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
import React, { Suspense, useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaRegEye,
  FaRegTrashAlt,
  FaSearch,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { deleteCountry } from "../actions/actionCountry";
import { CountryAttributes } from "../api/models/paysModel";

const Pays: React.FC = () => {
  const [countries, setCountries] = useState<CountryAttributes[]>([]);
  const [itemsperpage, setItemperpage] = useState(5);
  const [page, setPage] = React.useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<Boolean>(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);
  const [adding, setAdding] = useState<Boolean>(false);
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
    try {
      await deleteCountry(id_pays);
      setCountries(countries.filter((country) => country.id_pays !== id_pays));
      setDeleteModalOpen(false);
    } catch (error) {}
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
        console.log("Pays ajouté avec succès");
        setAdding(false);
        setPays({
          libelle: "",
          code_pays: "",
          continent: "",
          indicatif_tel: "",
          fuseau_horaire: "",
        });
        fetchData(); 
        onClose(); // Ferme le modal ici
      } else if(response.status===400){
        toast.error(response.data.message)
      }else {
        console.log("Échec de l'ajout du pays");
      }
    } catch (error) {
      console.log("Échec de l'ajout du pays");
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

  useEffect(() => {
    document.title = "Pays";
    fetchData();
  }, []);

  return (
    <RootLayout isAuthenticated={true}>
      <Suspense fallback={<div>loading...</div>}>
        <div className="bg-gray-100 ">
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
                  <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onClose}>
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
                          <Button color="primary" onPress={addCountry}>
                            {adding ? ("Adding") : ("Add")}
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
                        Ind. Téléphonique
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
                    {filteredCountries.slice(startIndex, endIndex).map((country, index) => (
                      <tr key={country.id_pays} className="bg-white border-b">
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          {country.libelle}
                        </td>
                        <td className="px-6 py-4">{country.code_pays}</td>
                        <td className="px-6 py-4">{country.continent}</td>
                        <td className="px-6 py-4">{country.indicatif_tel}</td>
                        <td className="px-6 py-4">{country.fuseau_horaire}</td>
                        <td className="px-6 py-4 text-right">
                          <Link href={`/view/${country.id_pays}`} passHref>
                            <Button
                              isIconOnly
                              variant="light"
                              color="primary"
                              aria-label="view"
                              className="hover:text-blue-800 focus:ring-2 focus:ring-blue-800"
                            >
                              <FaRegEye />
                            </Button>
                          </Link>
                          <Button
                            isIconOnly
                            variant="light"
                            color="danger"
                            aria-label="delete"
                            className="hover:text-red-800 focus:ring-2 focus:ring-red-800"
                            onPress={() => {
                              setDeleteModalOpen(true);
                              setSelectedCountryId(country.id_pays);
                            }}
                          >
                            <FaRegTrashAlt />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center">
                  <Button
                    variant="light"
                    disabled={currentPage === 0}
                    onPress={() => setCurrentPage(currentPage - 1)}
                  >
                    <FaChevronLeft />
                  </Button>
                  <span className="mx-2">
                    Page {currentPage + 1} sur{" "}
                    {Math.ceil(filteredCountries.length / itemsperpage)}
                  </span>
                  <Button
                    variant="light"
                    disabled={endIndex >= filteredCountries.length}
                    onPress={() => setCurrentPage(currentPage + 1)}
                  >
                    <FaChevronRight />
                  </Button>
                </div>
                <div>
                  <label htmlFor="itemsPerPage" className="mr-2">
                    Items per page:
                  </label>
                  <select
                    id="itemsPerPage"
                    value={itemsperpage}
                    onChange={(e) => setItemperpage(Number(e.target.value))}
                    className="border rounded-md p-1"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>
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
                    >
                      Supprimer
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </div>
          )}
        </div>
      </Suspense>
    </RootLayout>
  );
};

export default Pays;
