"use client";
import { Input, Select, SelectItem } from "@nextui-org/react";

import RootLayout from "@/components/rootLayout";
import countries from "@/data/pays";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { FaPlus, FaRegEye, FaRegTrashAlt, FaSearch } from "react-icons/fa";

const Departements: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedOption, setSelectedOption] = useState("");

  const handleChange = (e: any) => {
    setSelectedOption(e.target.value);
  };

  useEffect(() => {
    document.title = "Departement";
  }, []);
  return (
    <RootLayout isAuthenticated={true}>
      <div className="bg-gray-100">
        <div className="font-semibold text-xl mb-4 text-gray-90">
          D&eacute;partements
        </div>
        <div className="bg-white shadow-md rounded-md p-5">
          <div className="flex flex-row justify-between mb-4">
            <Input
              isClearable
              className="w-full sm:max-w-[20%] mr-4 "
              placeholder="Rechercher un departement"
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
                        Ajouter un d&eacute;partement
                      </ModalHeader>
                      <ModalBody>
                        <div className="mb-1">
                          <label
                            htmlFor="codepays"
                            className="block  text-medium font-normal"
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
                            className="block  text-medium font-normal"
                          >
                            Code du pays
                          </label>
                          <input
                            type="text"
                            placeholder="Entrer le code du pays"
                            id="codepays"
                            name="codepays"
                            className="border rounded-md w-full p-2"
                          />
                        </div>{" "}
                        <div className="mb-1">
                          <label
                            htmlFor="codepays"
                            className="block  text-medium font-normal"
                          >
                            Code du pays
                          </label>
                          <input
                            type="text"
                            placeholder="Entrer le code du pays"
                            id="codepays"
                            name="codepays"
                            className="border rounded-md w-full p-2"
                          />
                        </div>{" "}
                        <div className="mb-1">
                          <label
                            htmlFor="codepays"
                            className="block  text-medium font-normal"
                          >
                            Code du pays
                          </label>
                          <input
                            type="text"
                            placeholder="Entrer le code du pays"
                            id="codepays"
                            name="codepays"
                            className="border rounded-md w-full p-2"
                          />
                        </div>{" "}
                        <div className="mb-1">
                          <label
                            htmlFor="codepays"
                            className="block  text-medium font-normal"
                          >
                            Code du pays
                          </label>
                          <input
                            type="text"
                            placeholder="Entrer le code du pays"
                            id="codepays"
                            name="codepays"
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

          <div className="relative overflow-x-scroll">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
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
                    <span className="sr-only">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white hover:bg-gray-50">
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    Nord
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    NR
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    Cap-haitien
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    Haiti
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
          </div>
        </div>
      </div>
    </RootLayout>
  );
};

export default Departements;
