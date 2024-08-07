import { SectionCommuneAttributes } from '@/app/api/models/sectionCommunalModel';
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
import Select from 'react-select';

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
    code_postal: ""

  });

  const [errors, setErrors] = useState({
    numero_rue: "",
    libelle: "",
    id_sectioncommune: "",
    code_postal: ""
  });

  const handleinputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAdresse({ ...adresse, [name]: value });
    setErrors({ ...errors, [name]: "" });

  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { libelle: "", numero_rue: "", id_sectioncommune: "", code_postal: "" };
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

    if (!adresse.code_postal) {
      newErrors.code_postal = "Le code postal est requis";
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
          code_postal: ""

        });
        onClose();
        onSuccess();
      }
    } catch (error) {
      onFailed();
      console.error("Échec de l'ajout de la section communale", error);
    } finally {
      setAdding(false);
    }

  }
  const handleSelectChange = (selectedOption: any) => {
    setAdresse({ ...adresse, id_sectioncommune: selectedOption.value });
    setErrors({ ...errors, id_sectioncommune: "" });
  };

  const adresseOption = sectioncommunales.map((section) => ({
    value: section.id_sectioncommune,
    label: section.libelle
  }))

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
            <div className="mb-4">
              <label
                htmlFor="id_departement"
                className="block text-sm font-normal mb-2"
              >
                Choisir une section communale
              </label>
              <Select
                placeholder="Choisir une section communale"
                name="id_sectioncommune"
                onChange={handleSelectChange}
                options={adresseOption}
                className='w-full'
              />

              {errors.id_sectioncommune && <span className="text-red-500 text-sm">{errors.id_sectioncommune}</span>}
            </div>
            <div className="mb-4">
              <label
                htmlFor="libelle"
                className="block text-sm font-normal mb-2"
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

            <div className="mb-4">
              <label
                htmlFor="libelle"
                className="block text-sm font-normal mb-2"
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

            <div className="mb-4">
              <label
                htmlFor="code_postal"
                className="block text-sm font-normal mb-2"
              >
                Code postal
              </label>
              <input
                type="text"
                placeholder="Entrer le code postal"
                id="code_postal"
                name="code_postal"
                onChange={handleinputChange}
                value={adresse.code_postal}
                className="border rounded-md w-full p-2 text-sm"
              />
              {errors.code_postal && <span className="text-red-500 text-sm">{errors.code_postal}</span>}
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




