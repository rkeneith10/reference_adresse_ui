import { SectionCommuneAttributes } from '@/app/api/models/sectionCommunalModel';
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

interface AdresseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onFailed: () => void;
  sectioncommunales: SectionCommuneAttributes[];
}

const AdresseFormModal: React.FC<AdresseFormModalProps> = ({ isOpen, onClose, onSuccess, onFailed, sectioncommunales }) => {
  const [adding, setAdding] = useState(false);
  const [adresse, setAdresse] = useState({
    id_sectioncommune: "",
    numero_rue: "",
    libelle: "",
    statut: "En creation",

  });

  const [errors, setErrors] = useState({
    numero_rue: "",
    libelle: "",
    id_sectioncommune: ""
  });

  const handleinputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAdresse({ ...adresse, [name]: value });
    setErrors({ ...errors, [name]: "" });

  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { libelle: "", numero_rue: "", id_sectioncommune: "" };
    if (!adresse.id_sectioncommune) {
      newErrors.id_sectioncommune = "La section communale de reference est requise";
      valid = false;
    }
    if (!adresse.libelle) {
      newErrors.libelle = "L'adresse est requise";
      valid = false;
    }

    if (!adresse.numero_rue) {
      newErrors.numero_rue = "Le numero de la rue est requis";
      valid = false;
    }


    setErrors(newErrors);
    return valid;
  };

  const addAdresse = async () => {
    if (!validateForm()) {
      return;
    }
    setAdding(true);

    try {
      const response = await axios.post("/api/adresseCtrl", adresse, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        setAdresse({
          id_sectioncommune: "",
          numero_rue: "",
          libelle: "",
          statut: "En creation",

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

  }

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
            Ajouter une adresse
          </ModalHeader>
          <ModalBody>
            <div className="mb-1">
              <label
                htmlFor="id_departement"
                className="block text-sm font-normal"
              >
                Choisir une section communale
              </label>
              <Select
                placeholder="Choisir une section communale"
                name="id_sectioncommune"
                onChange={handleinputChange}
                value={adresse.id_sectioncommune}
                width="100%"
              >
                {sectioncommunales.map(section => (
                  <option key={section.id_sectioncommune} value={section.id_sectioncommune}>
                    {section.libelle}
                  </option>
                ))}
              </Select>
              {errors.id_sectioncommune && <span className="text-red-500 text-sm">{errors.id_sectioncommune}</span>}
            </div>
            <div className="mb-1">
              <label
                htmlFor="libelle"
                className="block text-sm font-normal"
              >
                Libelle
              </label>
              <input
                type="text"
                placeholder="Entrer l'adresse"
                id="libelle"
                name="libelle"
                onChange={handleinputChange}
                value={adresse.libelle}
                className="border rounded-md w-full p-2 text-sm"
              />
              {errors.libelle && <span className="text-red-500 text-sm">{errors.libelle}</span>}
            </div>

            <div className="mb-1">
              <label
                htmlFor="libelle"
                className="block text-sm font-normal"
              >
                Numero de rue
              </label>
              <input
                type="text"
                placeholder="Entrer le numero de rue"
                id="numero_rue"
                name="numero_rue"
                onChange={handleinputChange}
                value={adresse.numero_rue}
                className="border rounded-md w-full p-2 text-sm"
              />
              {errors.numero_rue && <span className="text-red-500 text-sm">{errors.numero_rue}</span>}
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
              onClick={addAdresse}
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

export default AdresseFormModal




