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
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
import React, { useEffect } from "react";
import { FaPlus, FaRegEye, FaRegTrashAlt, FaSearch } from "react-icons/fa";

const Arrondissements: React.FC = () => {
  useEffect(() => {
    document.title = "Arrondissement";
  }, []);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <RootLayout isAuthenticated={true}>
      <div className="bg-gray-100">
        <div className="font-semibold text-xl mb-4 text-gray-90">
          Arrondissements
        </div>

        <div className="bg-white shadow-md rounded-md p-5">
          <div className="flex flex-row justify-between mb-4">
            <Input
              isClearable
              className="w-full sm:max-w-[20%] mr-4 "
              placeholder="Rechercher un arrondissement"
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
                        Ajouter un arrondissement
                      </ModalHeader>
                      <ModalBody>
                        <div className="mb-1">
                          <label
                            htmlFor="codepays"
                            className="block  text-medium font-normal"
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
                            className="block  text-medium font-normal"
                          >
                            Arrondissement
                          </label>
                          <input
                            type="text"
                            placeholder="Entrer l'arrondissement"
                            id="arrondissement"
                            name="arrondissement"
                            className="border rounded-md w-full p-2"
                          />
                        </div>{" "}
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
          </div>
        </div>
      </div>
    </RootLayout>
  );
};

export default Arrondissements;
