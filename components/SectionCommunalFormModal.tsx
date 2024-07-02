import { CommuneAttributes } from '@/app/api/models/communeModel';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select
} from '@chakra-ui/react';

import axios from 'axios';
import React, { useState } from "react";

interface SectionCommunalFormModal {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onFailed: () => void;
  communes: CommuneAttributes[];
}
const SectionCommunalFormModal: React.FC<SectionCommunalFormModal> = ({ isOpen, onClose, onSuccess, onFailed, communes }) => {
  const [adding, setAdding] = useState<boolean>(false);
  const [sectioncommunale, setSectioncommunale] = useState({
    id_commune: "",
    libelle: "",

  });

  const [errors, setErrors] = useState({
    id_commune: "",
    libelle: "",

  });



  const handleinputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSectioncommunale({ ...sectioncommunale, [name]: value });
    setErrors({ ...errors, [name]: "" });

  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { libelle: "", id_commune: "" };
    if (!sectioncommunale.id_commune) {
      newErrors.id_commune = "La commune de reference est requis";
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
          id_commune: "",
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
            Ajouter une commune
          </ModalHeader>
          <ModalBody>
            <div className="mb-1">
              <label
                htmlFor="id_departement"
                className="block text-sm font-normal"
              >
                Choisir un dép
              </label>
              <Select
                placeholder="Choisir une commune"
                name="id_commune"
                onChange={handleinputChange}
                value={sectioncommunale.id_commune}
                width="100%" // Utilisation de la propriété width de Chakra UI
              >
                {communes.map(section => (
                  <option key={section.id_commune} value={section.id_commune}>
                    {section.libelle}
                  </option>
                ))}
              </Select>
              {errors.id_commune && <span className="text-red-500 text-sm">{errors.id_commune}</span>}
            </div>
            <div className="mb-1">
              <label
                htmlFor="libelle"
                className="block text-sm font-normal"
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
