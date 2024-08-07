import { VilleAttributes } from '@/app/api/models/villeModel';
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
import React, { useState } from "react";
import Select from "react-select";

interface SectionCommunalFormModal {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onFailed: () => void;
  villes: VilleAttributes[];
}
const SectionCommunalFormModal: React.FC<SectionCommunalFormModal> = ({ isOpen, onClose, onSuccess, onFailed, villes }) => {
  const [adding, setAdding] = useState<boolean>(false);
  const [sectioncommunale, setSectioncommunale] = useState({
    id_ville: "",
    libelle: "",

  });

  const [errors, setErrors] = useState({
    id_ville: "",
    libelle: "",

  });

  const villeOption = villes.map((vil) => ({
    value: vil.id_ville,
    label: vil.libelle
  }))

  const handleSelectChange = (selectedOption: any) => {
    setSectioncommunale({ ...sectioncommunale, id_ville: selectedOption.value });
    setErrors({ ...errors, id_ville: "" });
  };

  const handleinputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSectioncommunale({ ...sectioncommunale, [name]: value });
    setErrors({ ...errors, [name]: "" });

  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { libelle: "", id_ville: "" };
    if (!sectioncommunale.id_ville) {
      newErrors.id_ville = "La ville de reference est requise";
      valid = false;
    }
    if (!sectioncommunale.libelle) {
      newErrors.libelle = "Nom de la section communale est requis";
      valid = false;
    }


    setErrors(newErrors);
    return valid;
  };

  const addSectionCommunale = async () => {
    if (!validateForm()) {
      return;
    }
    setAdding(true);

    try {
      const response = await axios.post("/api/sectionCommunalCtrl", sectioncommunale, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        setSectioncommunale({
          id_ville: "",
          libelle: "",

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
            Ajouter une section communale
          </ModalHeader>
          <ModalBody>
            <div className="mb-4">
              <label
                htmlFor="id_departement"
                className="block text-sm font-normal mb-2"
              >
                Choisir une ville
              </label>
              <Select
                placeholder="Choisir une ville"
                name="id_ville"
                onChange={handleSelectChange}
                options={villeOption}
                className='w-full'

              />

              {errors.id_ville && <span className="text-red-500 text-sm">{errors.id_ville}</span>}
            </div>
            <div className="mb-4">
              <label
                htmlFor="libelle"
                className="block text-sm font-normal mb-2"
              >
                Section Communale
              </label>
              <input
                type="text"
                placeholder="Entrer la commune"
                id="libelle"
                name="libelle"
                onChange={handleinputChange}
                value={sectioncommunale.libelle}
                className="border rounded-md w-full p-2 text-sm"
              />
              {errors.libelle && <span className="text-red-500 text-sm">{errors.libelle}</span>}
            </div>


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
              onClick={addSectionCommunale}
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

export default SectionCommunalFormModal
