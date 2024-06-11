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
import { deleteCountry } from "../actions/actionCountry";
import { CountryAttributes } from "../api/models/paysModel";

const Pays: React.FC = () => {
  const [countries, setCountries] = useState<CountryAttributes[]>([]);
  const [itemsperpage, setItemperpage] = useState(5);
  const [page, setPage] = React.useState(1);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading,setLoading]= useState<Boolean>(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);
  const [adding,setAdding]=useState<Boolean>(false);
  const [pays, setPays] = useState({
    libelle: "",
    code_pays: "",
    continent: "",
    indicatif_tel: "",
    fuseau_horaire: "",
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setPays({ ...pays, [name]: value });
  };

  const handleDeleteCountry = async(id_pays:number)=>{
    try{
      await deleteCountry(id_pays)
      setCountries(countries.filter(country=>country.id_pays!==id_pays))
      setDeleteModalOpen(false)
    }catch(error){}
  }

  const addCountry = async () => {
    setAdding(true);
    try {
      const response = await axios.post("/api/paysCtrl", pays, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        console.log("Pays ajoute avec succes");
        setAdding(false)
        setPays({
          libelle: "",
          code_pays: "",
          continent: "",
          indicatif_tel: "",
          fuseau_horaire: "",
        });
        fetchData();
      } else {
        console.log("Failed to addcountry");
      }
    } catch (error) {
      console.log("Failed to add country");
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
      setLoading(false)
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
      <div className=" bg-gray-100 ">
        <div className="font-semibold text-xl mb-4 text-gray-900">{loading ?(""):("Pays")}</div>

       {loading ? (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
           <Spinner size="lg" color="primary"/>
        <div className="loader">Chargement en cours...</div>

      </div>
       ) : (
        <div className="bg-white p-5 shadow-md rounded-md">
        <div className="flex flex-row justify-between mb-4">
          <Input
            isClearable
            className="w-full sm:max-w-[20%] mr-4 "
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
            <Modal
              backdrop="blur"
              isOpen={isOpen}
              onOpenChange={onOpenChange}
            >
              <ModalContent>
                {(onClose: any) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      Ajouter un pays
                    </ModalHeader>
                    <ModalBody>
                      <div className="mb-1">
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
                      </div>
                      <div className="mb-1">
                        <label
                          htmlFor="indicatif"
                          className="block  text-medium font-normal"
                        >
                          Indicatif Telephonique
                        </label>
                        <input
                          type="text"
                          value={pays.indicatif_tel}
                          onChange={handleInputChange}
                          placeholder="Entrer l'indicatif téléphonique"
                          className="border rounded-md w-full p-2"
                          name="indicatif_tel"
                        />
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
                        {adding ?("Adding"):("Add")}
                      </Button>
                    </ModalFooter>
                  </>
                )}
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
                          <FaRegTrashAlt className="h-3 w-3 cursor-pointer text-red-600 mr-4" onClick={() => {
                                setSelectedCountryId(country.id_pays);
                                setDeleteModalOpen(true);
                              }} />
                          <Link href={`/pays/${country.id_pays}`}>
                            {" "}
                            <FaRegEye className="h-3 w-3 cursor-pointer text-blue-600" />
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
                className={`mx-1 py-1 px-3 rounded-full ${
                  currentPage === index
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
      </div>
       )}
      </div>
      <Modal
        isOpen={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Confirmer la suppression
          </ModalHeader>
          <ModalBody>
            <p>Êtes-vous sûr de vouloir supprimer ce pays ?</p>
          </ModalBody>
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
    </RootLayout>
  );
};

export default Pays;
