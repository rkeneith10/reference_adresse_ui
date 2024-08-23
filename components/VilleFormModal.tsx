import { CommuneAttributes } from "@/app/api/models/communeModel";
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


interface VilleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onFailed: () => void;
  communes: CommuneAttributes[];
}

const VilleFormModal: React.FC<VilleFormModalProps> = ({ isOpen, onClose, onSuccess, onFailed, communes }) => {

  const [adding, setAdding] = useState<boolean>(false)
  const [ville, setVille] = useState({
    id_commune: "",
    libelle_ville: "",
    longitude: "",
    lattitude: ""
  })

  const [errors, setErrors] = useState({

    id_commune: "",
    libelle_ville: "",
    longitude: "",
    lattitude: ""

  })

  const [searchTerm, setSearchTerm] = useState("");
  const handleinputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setVille({ ...ville, [name]: value });
    setErrors({ ...errors, [name]: "" });

    if (name === "libelle") {
      setSearchTerm(value);
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { libelle_ville: "", id_commune: "", longitude: "", lattitude: "" };
    if (!ville.id_commune) {
      newErrors.id_commune = "La commune de reference est requis";
      valid = false;
    }
    if (!ville.libelle_ville) {
      newErrors.libelle_ville = "Nom de la ville est requis";
      valid = false;
    }
    if (!ville.longitude) {
      newErrors.longitude = "Longitude de la commune est requis";
      valid = false;
    }
    if (!ville.lattitude) {
      newErrors.lattitude = "Latitude de la commune est requis";
      valid = false;
    }


    setErrors(newErrors);
    return valid;
  };

  const addVille = async () => {
    if (!validateForm) {
      return
    }
    setAdding(true);
    try {
      const response = await axios.post("/api/villeCtrl", ville, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        setVille({
          id_commune: "",
          libelle_ville: "",
          longitude: "",
          lattitude: ""

        });
        onClose();
        onSuccess();
      }
    } catch (error) {
      onFailed();
      console.error("Échec de l'ajout de la ville", error);
    } finally {
      setAdding(false);
    }
  }
  const CommuneOption = communes.map((com) => (
    {
      value: com.id_commune,
      label: com.libelle_commune
    }
  ))

  const handleSelectChange = (selectedOption: any) => {
    setVille({ ...ville, id_commune: selectedOption.value });
    setErrors({ ...errors, id_commune: "" });
  };

  const fetchLocation = useCallback(() => {
    if (searchTerm) {
      axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${searchTerm}`)
        .then((response) => {
          if (response.data && response.data.length > 0) {
            const { lon, lat } = response.data[0];
            setVille((prevVille) => ({ ...prevVille, longitude: lon.toString(), lattitude: lat.toString() }));
          } else {
            setVille((prevVille) => ({ ...prevVille, longitude: "", lattitude: "" }));
          }
        })
        .catch((error) => {
          console.error("Erreur lors de la recherche de la ville", error);
        });
    } else {
      setVille((prevVille) => ({ ...prevVille, longitude: "", lattitude: "" }));
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
            Ajouter une ville
          </ModalHeader>
          <ModalBody>
            <div className="mb-4">
              <label
                htmlFor="id_commune"
                className="block text-sm font-normal mb-2"
              >
                Choisir une commune
              </label>
              <Select
                placeholder="Choisir une commune"
                name="id_commune"
                onChange={handleSelectChange}
                options={CommuneOption}
                className='w-full'

              />

              {errors.id_commune && <span className="text-red-500 text-sm">{errors.id_commune}</span>}
            </div>
            <div className="mb-4">
              <label
                htmlFor="libelle"
                className="block text-sm font-normal mb-2"
              >
                Ville
              </label>
              <input
                type="text"
                placeholder="Entrer la ville"
                id="libelle_vile"
                name="libelle_ville"
                onChange={handleinputChange}
                value={ville.libelle_ville}
                className="border rounded-md w-full p-2 text-sm"
              />
              {errors.libelle_ville && <span className="text-red-500 text-sm">{errors.libelle_ville}</span>}
            </div>

            {ville.lattitude !== "" && ville.longitude != "" && (
              <div className="flex flex-row items-center justify-between mb-4">
                <div className="mr-2">
                  <label
                    htmlFor="longitude"
                    className="block text-sm font-normal mb-2"
                  >
                    Longitude
                  </label>
                  <input
                    type="text"
                    placeholder="Longitude"
                    id="longitude"
                    name="longitude"
                    readOnly
                    value={ville.longitude}
                    className=" border rounded-md w-full p-2 text-sm"
                  />
                  {errors.longitude && <span className="text-red-500 text-sm">{errors.longitude}</span>}
                </div>
                <div>
                  <label
                    htmlFor="latitude"
                    className="block text-sm font-normal mb-2"
                  >
                    Latitude
                  </label>
                  <input
                    type="text"
                    placeholder="Latitude"
                    id="latitude"
                    name="latitude"
                    readOnly
                    value={ville.lattitude}
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
              onClick={addVille}
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

export default VilleFormModal;