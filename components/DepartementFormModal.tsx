import { CountryAttributes } from "@/app/api/models/paysModel";
import { TooltipAttributes } from "@/app/api/models/tooltipModel";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner
} from '@chakra-ui/react';
import axios from "axios";
import React, { useEffect, useState } from "react";
import Select from 'react-select';
import TooltipIcon from "./tooltipIcon";

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
    libelle_departement: "",
    code_departement: "",
    chef_lieux: "",
    id_pays: "",
  });



  const [tooltips, setTooltips] = useState<Record<string, string>>({});

  const [errors, setErrors] = useState({
    libelle_departement: "",
    code_departement: "",
    chef_lieux: "",
    id_pays: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDepartement({ ...departement, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSelectChange = (selectedOption: any) => {
    setDepartement({ ...departement, id_pays: selectedOption.value });
    setErrors({ ...errors, id_pays: "" });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { libelle_departement: "", code_departement: "", chef_lieux: "", id_pays: "" };

    if (!departement.libelle_departement) {
      newErrors.libelle_departement = "Nom du departement est requis";
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


  useEffect(() => {
    const fetchTooltips = async () => {
      try {

        const nom_application = "Adresse";

        const response = await axios.get(`/api/tooltipCtrl?nom_application=${encodeURIComponent(nom_application)}`);

        const tooltipMap: Record<string, string> = {};
        const tooltips = response.data.tooltip;

        tooltips.forEach((tooltip: TooltipAttributes) => {
          tooltipMap[tooltip.nom_champ] = tooltip.message_tooltip;
        });

        setTooltips(tooltipMap);
      } catch (error) {
        console.error('Erreur lors de la récupération des tooltips:', error);
      }
    };

    fetchTooltips();
  }, []);
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
          libelle_departement: "",
          code_departement: "",
          chef_lieux: "",
          id_pays: "",
        });
        onClose();
        onSuccess();
      }
    } catch (error) {
      onFailed();
      console.error("Échec de l'ajout du département", error);
    } finally {
      setAdding(false);
    }
  };

  const countryOptions = countries.map((country) => ({
    value: country.id_pays,
    label: country.libelle_pays,
  }));

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
            <div className="mb-4">
              <label htmlFor="codepays" className="block text-medium font-normal mb-2">
                Choisir un pays
                <TooltipIcon field="id_pays" tooltipMessage={tooltips['id_pays'] || ''} />

              </label>

              <Select
                placeholder="Choisir un pays"
                className="w-full"
                name="id_pays"
                options={countryOptions}
                onChange={handleSelectChange}
              />

              {errors.id_pays && (
                <span className="text-red-500 text-sm">{errors.id_pays}</span>
              )}
            </div>
            <div className="mb-2">
              <label htmlFor="libelle" className="block text-medium font-normal mb-2">
                Nom du departement
                <TooltipIcon field="id_pays" tooltipMessage={tooltips['id_pays'] || ''} />


              </label>
              <input
                type="text"
                placeholder="Entrer le nom du departement"
                onChange={handleInputChange}
                id="libelle_departement"
                name="libelle_departement"
                className="border rounded-md w-full p-2"
              />
              {errors.libelle_departement && (
                <span className="text-red-500 text-sm">{errors.libelle_departement}</span>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="code_departement" className="block text-medium font-normal mb-2">
                Code du departement
                <TooltipIcon field="code_departement" tooltipMessage={tooltips['code_departement'] || ''} />

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
            <div className="mb-4">
              <label htmlFor="chef_lieux" className="block text-medium font-normal mb-2">
                Chef Lieux
                <TooltipIcon field="chef_lieux" tooltipMessage={tooltips['chef_lieux'] || ''} />

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
  );
};

export default DepartementFormModal;
