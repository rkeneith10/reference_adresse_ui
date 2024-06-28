import { CountryAttributes } from "@/app/api/models/paysModel";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner
} from '@chakra-ui/react';
import axios from "axios";
import React, { useState } from "react";

interface DepartementFormModal {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onFailed: () => void;
  countries: CountryAttributes[];
}

const DepartementFormModal: React.FC<DepartementFormModal> = ({ isOpen, onClose, onSuccess, onFailed, countries }) => {
  const [adding, setAdding] = useState(false);
  const [departement, setDepartement] = useState({
    libelle: "",
    code_departement: "",
    chef_lieux: "",
    id_pays: "",
  });

  const [errors, setErrors] = useState({
    libelle: "",
    code_departement: "",
    chef_lieux: "",
    id_pays: "",
  });


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDepartement({ ...departement, [name]: value });
    setErrors({ ...errors, [name]: "" });
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
        setDepartement({
          libelle: "",
          code_departement: "",
          chef_lieux: "",
          id_pays: "",
        });
        onClose();
        onSuccess();
        // setMessageModal("Le département a été enregistré avec succès.")
        // setIsConfirmationOpen(true); // Ouvrir le modal de confirmation
        // fetchData();
      }
    } catch (error) {
      // setMessageModal("Ce département est déjà existé")
      // setIsConfirmationOpen(true);
      onFailed();
      console.error("Échec de l'ajout du département", error);
    } finally {
      setAdding(false);
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
      <ModalOverlay
        bg="blackAlpha.600"
        backdropFilter="blur(10px)"
      />
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1">
            Ajouter un d&eacute;partement
          </ModalHeader>
          <ModalBody>
            <div className="mb-1">
              <label htmlFor="codepays" className="block text-medium font-normal">
                Choisir un pays
              </label>

              <Select
                placeholder="Choisir un pays"
                className="w-full" // Chakra UI utilise souvent des classes utilitaires comme "width" ou "w"
                name="id_pays"
                onChange={handleInputChange}
              >
                {countries
                  .sort((a, b) => a.libelle.localeCompare(b.libelle))
                  .map((country) => (
                    <option key={country.id_pays} value={country.id_pays}>
                      {country.libelle}
                    </option>
                  ))}
              </Select>

              {errors.id_pays && (
                <span className="text-red-500 text-sm">{errors.id_pays}</span>
              )}
            </div>
            <div className="mb-1">
              <label htmlFor="libelle" className="block text-medium font-normal">
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
              {errors.libelle && (
                <span className="text-red-500 text-sm">{errors.libelle}</span>
              )}
            </div>
            <div className="mb-1">
              <label htmlFor="code_departement" className="block text-medium font-normal">
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
              {errors.code_departement && (
                <span className="text-red-500 text-sm">{errors.code_departement}</span>
              )}
            </div>
            <div className="mb-1">
              <label htmlFor="chef_lieux" className="block text-medium font-normal">
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
              {errors.chef_lieux && (
                <span className="text-red-500 text-sm">{errors.chef_lieux}</span>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Fermer
            </Button>
            <Button colorScheme="blue" onClick={addDepartement} disabled={adding}>
              {adding ? (
                <>
                  Enregistrer <Spinner size="sm" color="white" className="ml-2" />
                </>
              ) : (
                "Enregistrer"
              )}
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  )
}

export default DepartementFormModal
