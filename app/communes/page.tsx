"use client";

import RootLayout from "@/components/rootLayout";
import countries from "@/data/pays";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";

const Commune: React.FC = () => {
  const [commune, setCommune] = useState("");
  const [long, setLong] = useState<string>("");
  const [lat, setLat] = useState<string>("");

  useEffect(() => {
    document.title = "Communes";
  }, []);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleCommune = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommune(e.target.value);
  };

  useEffect(() => {
    if (commune) {
      handleSearch();
    } else {
      setLat("");
      setLong("");
    }
  }, [commune]);

  const handleSearch = () => {
    axios
      .get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${commune}`
      )
      .then((response) => {
        if (response.data && response.data.length > 0) {
          const { lon, lat } = response.data[0];
          setLong(lon.toString());
          setLat(lat.toString());
        } else {
          console.log("Aucune ville correspondante trouvée");
          setLong("");
          setLat("");
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la recherche de la ville", error);
      });
  };

  return (
    <RootLayout isAuthenticated={true}>
      <div className="bg-gray-100">
        <div className="font-semibold text-xl mb-4 text-gray-90">
          Communes / Villes
        </div>

        <div className="bg-white shadow-md rounded-md p-5">
          <div className="flex flex-row justify-between mb-4">
            <Input
              isClearable
              className="w-full sm:max-w-[20%] mr-4 "
              placeholder="Rechercher une commune"
              startContent={<FaSearch className="text-gray-500" />}
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
              <Modal
                backdrop="blur"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        Ajouter une commune
                      </ModalHeader>
                      <ModalBody>
                        <div className="mb-1">
                          <label
                            htmlFor="codepays"
                            className="block text-sm font-normal"
                          >
                            Choisir un pays
                          </label>
                          <Select
                            placeholder="Choisir un pays"
                            className="w-full"
                            disableSelectorIconRotation
                          >
                            {countries
                              .sort((a, b) => a.name.localeCompare(b.name))
                              .map((country) => (
                                <SelectItem
                                  key={country.dialCode}
                                  value={country.name}
                                >
                                  {country.name}
                                </SelectItem>
                              ))}
                          </Select>
                        </div>
                        <div className="mb-1">
                          <label
                            htmlFor="codepays"
                            className="block text-sm font-normal"
                          >
                            Choisir un d&eacute;partement
                          </label>
                          <Select
                            placeholder="Choisir un departement"
                            className="w-full"
                            disableSelectorIconRotation
                          >
                            <SelectItem key={1} value="Nord">
                              Nord
                            </SelectItem>
                            <SelectItem key={2} value="Sud">
                              Sud
                            </SelectItem>
                            <SelectItem key={3} value="Ouest">
                              Ouest
                            </SelectItem>
                          </Select>
                        </div>
                        <div className="mb-1">
                          <label
                            htmlFor="codepays"
                            className="block text-sm font-normal"
                          >
                            Choisir un arrondissement
                          </label>
                          <Select
                            placeholder="Choisir un departement"
                            className="w-full"
                            disableSelectorIconRotation
                          >
                            <SelectItem key={1} value="Nord">
                              Cap-haitien
                            </SelectItem>
                            <SelectItem key={2} value="Sud">
                              Limonade
                            </SelectItem>
                            <SelectItem key={3} value="Ouest">
                              Quartier-Morin
                            </SelectItem>
                          </Select>
                        </div>
                        <div className="flex flex-row justify-between mb-1">
                          <div className="mr-2">
                            <label
                              htmlFor="commune"
                              className="block text-sm font-normal"
                            >
                              Commune
                            </label>
                            <input
                              type="text"
                              placeholder="Entrer la commune"
                              id="commune"
                              name="commune"
                              onChange={handleCommune}
                              className="border rounded-md w-full p-2 text-sm"
                            />
                          </div>
                          <div className="">
                            <label
                              htmlFor="codepostal"
                              className="block text-sm font-normal"
                            >
                              Code Postal
                            </label>
                            <input
                              type="text"
                              placeholder="Entrer le code postal"
                              id="codepostal"
                              name="codepostal"
                              className="border rounded-md w-full p-2 text-sm"
                            />
                          </div>
                        </div>
                        <div className="mb-1">
                          <div className="flex flex-row items-center justify-between">
                            <div className="mr-2">
                              {" "}
                              <label
                                htmlFor="long"
                                className="block text-sm font-normal"
                              >
                                Longitude
                              </label>
                              <input
                                type="text"
                                placeholder="Longitude"
                                readOnly
                                id="long"
                                name="long"
                                value={long}
                                className="border rounded-md w-full p-2 text-sm"
                              />
                            </div>
                            <div>
                              {" "}
                              <label
                                htmlFor="lat"
                                className="block text-sm font-normal"
                              >
                                Latitude
                              </label>
                              <input
                                type="text"
                                placeholder="Latitude"
                                readOnly
                                id="lat"
                                name="lat"
                                value={lat}
                                className="border rounded-md w-full p-2 text-sm"
                              />
                            </div>
                            {/* <div>
                              <FaSearch
                                size={20}
                                className="text-gray-500 cursor-pointer"
                                onClick={handleSearch}
                              />
                            </div> */}
                          </div>
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
                        <Button color="primary" onPress={onClose}>
                          Enregistrer
                        </Button>
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>
            </div>
          </div>
          {/* <div className="relative overflow-x-scroll">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Arrondissement
                  </th>
                  <th scope="col" className="px-6 py-3">
                    D&eacute;partement Reference
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <span className="sr-only">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white hover:bg-gray-50">
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    Cap-Haitien
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    Nord
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    <div className="flex ">
                      <FaRegTrashAlt className="h-3 w-3 cursor-pointer text-red-600 mr-4" />
                      <FaRegEye className="h-3 w-3 cursor-pointer text-blue-600" />
                    </div>
                  </td>
                </tr>
                <tr className="bg-white hover:bg-gray-50">
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    Quartier-Morin
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    Nord
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    <div className="flex ">
                      <FaRegTrashAlt className="h-3 w-3 cursor-pointer text-red-600 mr-4" />
                      <FaRegEye className="h-3 w-3 cursor-pointer text-blue-600" />
                    </div>
                  </td>
                </tr>{" "}
                <tr className="bg-white hover:bg-gray-50">
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    Limonade
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    Nord
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    <div className="flex ">
                      <FaRegTrashAlt className="h-3 w-3 cursor-pointer text-red-600 mr-4" />
                      <FaRegEye className="h-3 w-3 cursor-pointer text-blue-600" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div> */}
        </div>
      </div>
    </RootLayout>
  );
};

export default Commune;
