// CountryFormModal.tsx
//import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { TooltipAttributes } from '@/app/api/models/tooltipModel';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/react';
import axios from "axios";
import React, { useEffect, useState } from "react";
import TooltipIcon from './tooltipIcon';


interface CountryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onFailed: () => void;
}

const CountryFormModal: React.FC<CountryFormModalProps> = ({ isOpen, onClose, onSuccess, onFailed }) => {
  const [pays, setPays] = useState({
    libelle_pays: "",
    code_pays: "",
    continent: "",
    indicatif_tel: "",
    fuseau_horaire: "",
  });
  const [errors, setErrors] = useState({
    libelle_pays: "",
    code_pays: "",
    continent: "",
    indicatif_tel: "",
    fuseau_horaire: "",
  });
  const [adding, setAdding] = useState(false);
  const [visibleTooltip, setVisibleTooltip] = useState<string | null>(null);
  const [tooltips, setTooltips] = useState<Record<string, string>>({});

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setPays({ ...pays, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };


  const handleTooltipToggle = (field: string) => {
    setVisibleTooltip(field);
  };

  const handleTooltipHide = () => {
    setVisibleTooltip(null);
  };
  const validateForm = () => {
    let valid = true;
    const newErrors = { libelle_pays: "", code_pays: "", continent: "", indicatif_tel: "", fuseau_horaire: "" };

    if (!pays.libelle_pays) {
      newErrors.libelle_pays = "Nom du pays est requis";
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
          libelle_pays: "",
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">    <ModalOverlay
      bg="blackAlpha.600"
      backdropFilter="blur(10px)"
    />
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 " >Ajouter un pays</ModalHeader>
        <ModalBody >
          <div className="mb-4  mt-7 relative">
            <label htmlFor="libelle" className="block text-medium font-normal mb-2">
              Nom du pays
              <TooltipIcon field='libelle_pays' tooltipMessage={tooltips['libelle_pays']} />


            </label>
            <input
              type="text"
              value={pays.libelle_pays}
              onChange={handleInputChange}
              placeholder="Entrer le nom du pays"
              name="libelle_pays"
              className="border rounded-md w-full p-2"
            />
            {errors.libelle_pays && <span className="text-red-500 text-sm">{errors.libelle_pays}</span>}
          </div>
          <div className="mb-4">
            <label htmlFor="code_pays" className="block text-medium font-normal mb-2">
              Code du pays
              <TooltipIcon field='code_pays' tooltipMessage={tooltips['code_pays']} />
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
          <div className="mb-4">
            <label htmlFor="continent" className="block text-medium font-normal mb-2">
              Continent

              <TooltipIcon field="continent" tooltipMessage={tooltips['continent']} />



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
          <div className="mb-4">
            <label htmlFor="indicatif_tel" className="block text-medium font-normal mb-2">
              Indicatif Téléphonique

              <TooltipIcon field="indicatif_tel" tooltipMessage={tooltips['indicatif_tel']} />

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
          <div className="mb-4">
            <label htmlFor="fuseau_horaire" className="block text-medium font-normal mb-2">
              Fuseau Horaire

              <TooltipIcon field="fuseau_horaire" tooltipMessage={tooltips["fuseau_horaire"]} />

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
          <Button onClick={onClose}>
            Annuler
          </Button>
          <Button colorScheme='blue' ml={3} onClick={addCountry} disabled={adding} isLoading={adding}>
            Ajouter
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CountryFormModal;
