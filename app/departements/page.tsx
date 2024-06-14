"use client";
import { Input, Select, SelectItem, Spinner } from "@nextui-org/react";

import RootLayout from "@/components/rootLayout";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaPlus, FaRegEye, FaRegTrashAlt, FaSearch } from "react-icons/fa";
import { DepartementAttributes } from "../api/models/departementModel";
import { CountryAttributes } from "../api/models/paysModel";


const Departements: React.FC = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [adding, setAdding] = useState<Boolean>(false);
  const [countries, setCountries] = useState<CountryAttributes[]>([]);
  const [dept, setDept] = useState<DepartementAttributes[]>([])
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsperpage, setItemperpage] = useState(10);
  const [loading, setLoading] = useState<Boolean>(true);
  const [selectedOption, setSelectedOption] = useState("");
  const [departement, setDepartement] = useState({
    libelle: "", code_departement: "", chef_lieux: "", id_pays: ""
  })

  const [errors, setErrors] = useState({
    libelle: "", code_departement: "", chef_lieux: "", id_pays: ""
  });

  const handleChange = (e: any) => {
    setSelectedOption(e.target.value);
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setDepartement({ ...departement, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear the error message when the user starts typing
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
    const country = countries.find((c) => c.id_pays === id)
    return country ? country.libelle : " Pays Inconnu"
  }
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
        setAdding(false);
        setDepartement({
          libelle: "", code_departement: "", chef_lieux: "", id_pays: ""

        });
        onClose(); // Fermer le modal si nécessaire

        fetchData();
        // setModalMessage("Pays ajouté avec succès")
      } else if (response.status === 400) {
        // setModalMessage(response.data.message);
      } else {
        console.log("Échec de l'ajout du pays");
      }
    } catch (error) {
      console.log("Échec de l'ajout du pays", error);
      // setModalMessage("Échec de l'ajout du pays");
    } finally {
      setAdding(false); // Assurez-vous que l'état de l'ajout est toujours faux
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/departementCtrl");
      setDept(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  const fetchDataPays = async () => {
    try {
      const response = await axios.get("/api/paysCtrl");
      setCountries(response.data.data);

    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }
  const filteredDepartements = dept.filter((dp) =>
    dp.libelle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = currentPage * itemsperpage;
  const endIndex = Math.min(
    (currentPage + 1) * itemsperpage,
    filteredDepartements.length
  );

  useEffect(() => {
    fetchDataPays();
    fetchData();
    document.title = "Departement";
  }, []);
  return (
    <RootLayout isAuthenticated={true}>

      <div className="bg-gray-100">
        <div className="font-semibold text-xl mb-4 text-gray-90">

          {loading ? ("") : (<div> D&eacute;partements</div>)}
        </div>
        {loading ? (<div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
          <Spinner size="lg" color="primary" />
          <div className="loader">Chargement en cours...</div>
        </div>) : (
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
                  <ModalContent >

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
                            name="id_pays"
                            onChange={handleInputChange}
                            disableSelectorIconRotation
                          >
                            {countries
                              .sort((a, b) => a.libelle.localeCompare(b.libelle))
                              .map((country) => (
                                <SelectItem
                                  key={country.id_pays}
                                  value={country.id_pays}

                                >
                                  {country.libelle}
                                </SelectItem>
                              ))}
                          </Select>
                          {errors.id_pays && <span className="text-red-500 text-sm">{errors.id_pays}</span>}

                        </div>
                        <div className="mb-1">
                          <label
                            htmlFor="codepays"
                            className="block  text-medium font-normal"
                          >
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
                          {errors.libelle && <span className="text-red-500 text-sm">{errors.libelle}</span>}
                        </div>

                        <div className="mb-1">
                          <label
                            htmlFor="codepays"
                            className="block  text-medium font-normal"
                          >
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
                          {errors.code_departement && <span className="text-red-500 text-sm">{errors.code_departement}</span>}
                        </div>
                        <div className="mb-1">
                          <label
                            htmlFor="codepays"
                            className="block  text-medium font-normal"
                          >
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
                          {errors.chef_lieux && <span className="text-red-500 text-sm">{errors.chef_lieux}</span>}
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
                        <Button color="primary" onClick={addDepartement} disabled={adding ? true : false}>
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
                  {
                    filteredDepartements.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-4 font-semibold">
                          Pas de pays
                        </td>
                      </tr>
                    ) : (
                      filteredDepartements
                        .slice(startIndex, endIndex)
                        .map((dp, index) => (
                          <tr
                            key={dp.id_departement}
                            className="bg-white hover:bg-gray-50"
                          >
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
                              <div className="flex ">
                                <FaRegTrashAlt className="h-3 w-3 cursor-pointer text-red-600 mr-4" />
                                {/* <Link href={`/pays/${country.id_pays}`}>
                                    {" "} */}
                                <FaRegEye className="h-3 w-3 cursor-pointer text-blue-600" />
                                {/* </Link> */}
                              </div>
                            </td>
                          </tr>
                        ))
                    )
                  }

                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

    </RootLayout>
  );
};

export default Departements;


