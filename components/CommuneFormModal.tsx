import { DepartementAttributes } from '@/app/api/models/departementModel';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from "react";
import Select from 'react-select';

interface CommuneFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onFailed: () => void;
  departements: DepartementAttributes[];
}

const CommuneFormModal: React.FC<CommuneFormModalProps> = ({ isOpen, onClose, onSuccess, onFailed, departements }) => {
  const [adding, setAdding] = useState(false);
  const [commune, setCommune] = useState({
    id_departement: "",
    libelle: "",
    longitude: "",
    lattitude: "",
    code_postal: ""
  });

  const [errors, setErrors] = useState({
    id_departement: "",
    libelle: "",
    longitude: "",
    lattitude: "",
    code_postal: ""
  });

  const [searchTerm, setSearchTerm] = useState("");

  const handleinputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCommune({ ...commune, [name]: value });
    setErrors({ ...errors, [name]: "" });

    if (name === "libelle") {
      setSearchTerm(value);
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { libelle: "", longitude: "", lattitude: "", code_postal: "", id_departement: "" };
    if (!commune.id_departement) {
      newErrors.id_departement = "Le departement de reference est requis";
      valid = false;
    }
    if (!commune.libelle) {
      newErrors.libelle = "Nom de la commune est requis";
      valid = false;
    }
    if (!commune.longitude) {
      newErrors.longitude = "Longitude de la commune est requis";
      valid = false;
    }
    if (!commune.lattitude) {
      newErrors.lattitude = "Latitude de la commune est requis";
      valid = false;
    }
    if (!commune.code_postal) {
      newErrors.code_postal = "Le code postal est requis";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const addCommune = async () => {
    if (!validateForm()) {
      return;
    }
    setAdding(true);

    try {
      const response = await axios.post("/api/communeCtrl", commune, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        setCommune({
          id_departement: "",
          libelle: "",
          longitude: "",
          lattitude: "",
          code_postal: "",
        });
        onClose();
        onSuccess();
      }
    } catch (error) {
      onFailed();
      console.error("Échec de l'ajout de la commune", error);
    } finally {
      setAdding(false);
    }
  };

  const DepartementOption = departements.map((dept) => (
    {
      value: dept.id_departement,
      label: dept.libelle
    }
  ))
  const handleSelectChange = (selectedOption: any) => {
    setCommune({ ...commune, id_departement: selectedOption.value });
    setErrors({ ...errors, id_departement: "" });
  };

  const fetchLocation = useCallback(() => {
    if (searchTerm) {
      axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${searchTerm}`)
        .then((response) => {
          if (response.data && response.data.length > 0) {
            const { lon, lat } = response.data[0];
            setCommune((prevCommune) => ({ ...prevCommune, longitude: lon.toString(), lattitude: lat.toString() }));
          } else {
            setCommune((prevCommune) => ({ ...prevCommune, longitude: "", lattitude: "" }));
          }
        })
        .catch((error) => {
          console.error("Erreur lors de la recherche de la ville", error);
        });
    } else {
      setCommune((prevCommune) => ({ ...prevCommune, longitude: "", lattitude: "" }));
    }
  }, [searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLocation();
    }, 1000); // délai de 1 seconde après la saisie

    return () => clearTimeout(timer);
  }, [searchTerm, fetchLocation]);

  return (
    <Modal

      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay
        bg="blackAlpha.600"
        backdropFilter="blur(10px)"
      />
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1">
            Ajouter une commune
          </ModalHeader>
          <ModalBody>
            <div className="mb-1">
              <label
                htmlFor="id_departement"
                className="block text-sm font-normal"
              >
                Choisir un département
              </label>
              <Select
                placeholder="Choisir un département"
                name="id_departement"
                onChange={handleSelectChange}
                options={DepartementOption}
                className='w-full'

              />

              {errors.id_departement && <span className="text-red-500 text-sm">{errors.id_departement}</span>}
            </div>
            <div className="mb-1">
              <label
                htmlFor="libelle"
                className="block text-sm font-normal"
              >
                Commune
              </label>
              <input
                type="text"
                placeholder="Entrer la commune"
                id="libelle"
                name="libelle"
                onChange={handleinputChange}
                value={commune.libelle}
                className="border rounded-md w-full p-2 text-sm"
              />
              {errors.libelle && <span className="text-red-500 text-sm">{errors.libelle}</span>}
            </div>
            <div className="mb-1">
              <label
                htmlFor="code_postal"
                className="block text-sm font-normal"
              >
                Code Postal
              </label>
              <input
                type="text"
                placeholder="Entrer le code postal"
                id="code_postal"
                name="code_postal"
                onChange={handleinputChange}
                value={commune.code_postal}
                className="border rounded-md w-full p-2 text-sm"
              />
              {errors.code_postal && <span className="text-red-500 text-sm">{errors.code_postal}</span>}
            </div>
            {commune.lattitude !== "" && commune.longitude != "" && (
              <div className="flex flex-row items-center justify-between mb-1">
                <div className="mr-2">
                  <label
                    htmlFor="longitude"
                    className="block text-sm font-normal"
                  >
                    Longitude
                  </label>
                  <input
                    type="text"
                    placeholder="Longitude"
                    id="longitude"
                    name="longitude"
                    readOnly
                    value={commune.longitude}
                    className=" border rounded-md w-full p-2 text-sm"
                  />
                  {errors.longitude && <span className="text-red-500 text-sm">{errors.longitude}</span>}
                </div>
                <div>
                  <label
                    htmlFor="latitude"
                    className="block text-sm font-normal"
                  >
                    Latitude
                  </label>
                  <input
                    type="text"
                    placeholder="Latitude"
                    id="latitude"
                    name="latitude"
                    readOnly
                    value={commune.lattitude}
                    className="border rounded-md w-full p-2 text-sm"
                  />
                  {errors.lattitude && <span className="text-red-500 text-sm">{errors.lattitude}</span>}
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme='red'
              mr={3}
              onClick={onClose}
            >
              Fermer
            </Button>
            <Button
              colorScheme='blue'
              onClick={addCommune}
              isLoading={adding}
            >
              Enregistrer
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  )
}

export default CommuneFormModal;
