import { DepartementAttributes } from '@/app/api/models/departementModel';
import { TooltipAttributes } from '@/app/api/models/tooltipModel';
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
import React, { useEffect, useState } from "react";
import Select from 'react-select';
import TooltipIcon from './tooltipIcon';

interface CommuneFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onFailed: () => void;
  departements: DepartementAttributes[];
}

const CommuneFormModal: React.FC<CommuneFormModalProps> = ({ isOpen, onClose, onSuccess, onFailed, departements }) => {
  const [adding, setAdding] = useState(false);
  const [tooltips, setTooltips] = useState<Record<string, string>>({});
  const [commune, setCommune] = useState({
    id_departement: "",
    libelle_commune: "",

  });

  const [errors, setErrors] = useState({
    id_departement: "",
    libelle_commune: "",

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
    const newErrors = { libelle_commune: "", id_departement: "" };
    if (!commune.id_departement) {
      newErrors.id_departement = "Le departement de reference est requis";
      valid = false;
    }
    if (!commune.libelle_commune) {
      newErrors.libelle_commune = "Nom de la ville est requis";
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
          libelle_commune: "",

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
  };

  const DepartementOption = departements.map((dept) => (
    {
      value: dept.id_departement,
      label: dept.libelle_departement
    }
  ))
  const handleSelectChange = (selectedOption: any) => {
    setCommune({ ...commune, id_departement: selectedOption.value });
    setErrors({ ...errors, id_departement: "" });
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
            Ajouter une ville
          </ModalHeader>
          <ModalBody>
            <div className="mb-4">
              <label
                htmlFor="id_departement"
                className="block text-sm font-normal mb-2"
              >
                Choisir un département
                <TooltipIcon field='id_departement' tooltipMessage={tooltips['id_departement'] || ""} />
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
            <div className="mb-4">
              <label
                htmlFor="libelle"
                className="block text-sm font-normal mb-2"
              >
                Ville
                <TooltipIcon field='libelle_commune' tooltipMessage={tooltips['libelle_commune'] || ""} />
              </label>
              <input
                type="text"
                placeholder="Entrer la ville"
                id="libelle_commune"
                name="libelle_commune"
                onChange={handleinputChange}
                value={commune.libelle_commune}
                className="border rounded-md w-full p-2 text-sm"
              />
              {errors.libelle_commune && <span className="text-red-500 text-sm">{errors.libelle_commune}</span>}
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
