// CountryFormModal.tsx
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import axios from "axios";
import React, { useState } from "react";

interface CountryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onFailed: () => void;
}

const CountryFormModal: React.FC<CountryFormModalProps> = ({ isOpen, onClose, onSuccess, onFailed }) => {
  const [pays, setPays] = useState({
    libelle: "",
    code_pays: "",
    continent: "",
    indicatif_tel: "",
    fuseau_horaire: "",
  });
  const [errors, setErrors] = useState({
    libelle: "",
    code_pays: "",
    continent: "",
    indicatif_tel: "",
    fuseau_horaire: "",
  });
  const [adding, setAdding] = useState(false);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setPays({ ...pays, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { libelle: "", code_pays: "", continent: "", indicatif_tel: "", fuseau_horaire: "" };

    if (!pays.libelle) {
      newErrors.libelle = "Nom du pays est requis";
      valid = false;
    }
    if (!pays.code_pays) {
      newErrors.code_pays = "Code du pays est requis";
      valid = false;
    }
    if (!pays.continent) {
      newErrors.continent = "Continent est requis";
      valid = false;
    }
    if (!pays.indicatif_tel) {
      newErrors.indicatif_tel = "Indicatif Téléphonique est requis";
      valid = false;
    }
    if (!pays.fuseau_horaire) {
      newErrors.fuseau_horaire = "Fuseau horaire est requis";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const addCountry = async () => {
    if (!validateForm()) {
      return;
    }
    setAdding(true);
    try {
      const response = await axios.post("/api/paysCtrl", pays, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        setAdding(false);
        setPays({
          libelle: "",
          code_pays: "",
          continent: "",
          indicatif_tel: "",
          fuseau_horaire: "",
        });
        onClose();
        onSuccess();
      }
    } catch (error) {
      console.log("Échec de l'ajout du pays", error);
      onFailed();
    } finally {
      setAdding(false);
    }
  };

  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Ajouter un pays</ModalHeader>
        <ModalBody className="overflow-auto max-h-[50vh]">
          <div className="mb-1">
            <label htmlFor="libelle" className="block text-medium font-normal">
              Nom du pays
            </label>
            <input
              type="text"
              value={pays.libelle}
              onChange={handleInputChange}
              placeholder="Entrer le nom du pays"
              name="libelle"
              className="border rounded-md w-full p-2"
            />
            {errors.libelle && <span className="text-red-500 text-sm">{errors.libelle}</span>}
          </div>
          <div className="mb-1">
            <label htmlFor="code_pays" className="block text-medium font-normal">
              Code du pays
            </label>
            <input
              type="text"
              value={pays.code_pays}
              onChange={handleInputChange}
              placeholder="Entrer le code du pays"
              name="code_pays"
              className="border rounded-md w-full p-2"
            />
            {errors.code_pays && <span className="text-red-500 text-sm">{errors.code_pays}</span>}
          </div>
          <div className="mb-1">
            <label htmlFor="continent" className="block text-medium font-normal">
              Continent
            </label>
            <input
              type="text"
              value={pays.continent}
              onChange={handleInputChange}
              placeholder="Entrer le continent"
              name="continent"
              className="border rounded-md w-full p-2"
            />
            {errors.continent && <span className="text-red-500 text-sm">{errors.continent}</span>}
          </div>
          <div className="mb-1">
            <label htmlFor="indicatif_tel" className="block text-medium font-normal">
              Indicatif Téléphonique
            </label>
            <input
              type="text"
              value={pays.indicatif_tel}
              onChange={handleInputChange}
              placeholder="Entrer l'indicatif téléphonique"
              name="indicatif_tel"
              className="border rounded-md w-full p-2"
            />
            {errors.indicatif_tel && <span className="text-red-500 text-sm">{errors.indicatif_tel}</span>}
          </div>
          <div className="mb-1">
            <label htmlFor="fuseau_horaire" className="block text-medium font-normal">
              Fuseau Horaire
            </label>
            <input
              type="text"
              value={pays.fuseau_horaire}
              onChange={handleInputChange}
              placeholder="Entrer le fuseau horaire"
              name="fuseau_horaire"
              className="border rounded-md w-full p-2"
            />
            {errors.fuseau_horaire && <span className="text-red-500 text-sm">{errors.fuseau_horaire}</span>}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onPress={onClose}>
            Annuler
          </Button>
          <Button color="primary" onPress={addCountry} disabled={adding} isLoading={adding}>
            Ajouter
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CountryFormModal;
