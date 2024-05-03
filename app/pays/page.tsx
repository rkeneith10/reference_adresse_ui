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
  useDisclosure,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaRegEye,
  FaRegTrashAlt,
  FaSearch,
} from "react-icons/fa";
import countriesData from "../../data/pays";

const Pays: React.FC = () => {
  const [countries, setCountries] = useState(countriesData);
  const [itemsperpage, setItemperpage] = useState(5);
  const [page, setPage] = React.useState(1);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [pays, setPays] = useState("");
  const [codepays, setCodePays] = useState("");
  const [continent, setContinent] = useState("");
  const [telephone, setTelephone] = useState("");
  const [fuseauhoraire, setFuseauHoraire] = useState("");

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = currentPage * itemsperpage;
  const endIndex = Math.min(
    (currentPage + 1) * itemsperpage,
    filteredCountries.length
  );

  const handleajouter = () => {
    const newCountry = {
      name: pays,
      isoCode: codepays,
      continent: continent,
      dialCode: telephone,
      timeZone: fuseauhoraire,
    };

    setCountries([...countries, newCountry]);
  };
  useEffect(() => {
    document.title = "Pays";
  }, []);

  return (
    <RootLayout isAuthenticated={true}>
      <div className=" bg-gray-100 ">
        <div className="font-semibold text-xl mb-4 text-gray-900">Pays</div>

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
                            value={pays}
                            onChange={(e) => setPays(e.target.value)}
                            placeholder="Entrer le nom du pays"
                            id="pays"
                            name="pays"
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
                            value={codepays}
                            onChange={(e) => setCodePays(e.target.value)}
                            placeholder="Entrer le code du pays"
                            id="codepays"
                            name="codepays"
                            className="border rounded-md w-full p-2"
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
                            value={continent}
                            onChange={(e) => setContinent(e.target.value)}
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
                            value={telephone}
                            onChange={(e) => setTelephone(e.target.value)}
                            placeholder="Entrer l'indicatif téléphonique"
                            id="indicatif"
                            name="indicatif"
                            className="border rounded-md w-full p-2"
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
                            value={fuseauhoraire}
                            onChange={(e) => setFuseauHoraire(e.target.value)}
                            placeholder="Entrer le fuseau horaire"
                            id="fuseauhoraire"
                            name="fuseauhoraire"
                            className="border rounded-md w-full p-2"
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
                        <Button
                          color="primary"
                          onClick={handleajouter}
                          onPress={onClose}
                        >
                          Enregistrer
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
                {filteredCountries.length === 0 ? (
                  <div className="text-center py-4 font-semibold justify-center items-center">
                    Pas de pays trouvés
                  </div>
                ) : (
                  filteredCountries
                    .slice(startIndex, endIndex)
                    .map((country, index) => (
                      <tr
                        key={country.dialCode}
                        className="bg-white hover:bg-gray-50"
                      >
                        <td className="text-left py-3 px-4 border-b border-gray-200">
                          {country.name}
                        </td>
                        <td className="text-left py-3 px-4 border-b border-gray-200">
                          {country.isoCode}
                        </td>
                        <td className="text-left py-3 px-4 border-b border-gray-200">
                          {country.continent}
                        </td>
                        <td className="text-left py-3 px-4 border-b border-gray-200">
                          {country.dialCode}
                        </td>
                        <td className="text-left py-3 px-4 border-b border-gray-200">
                          {country.timeZone}
                        </td>
                        <td className="text-left py-3 px-4 border-b border-gray-200">
                          <div className="flex ">
                            <FaRegTrashAlt className="h-3 w-3 cursor-pointer text-red-600 mr-4" />
                            <FaRegEye className="h-3 w-3 cursor-pointer text-blue-600" />
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
      </div>
    </RootLayout>
  );
};

export default Pays;
