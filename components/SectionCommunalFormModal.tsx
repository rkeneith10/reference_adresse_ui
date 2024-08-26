import { TooltipAttributes } from '@/app/api/models/tooltipModel';
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
import React, { useEffect, useState } from "react";
import Select from "react-select";
import TooltipIcon from './tooltipIcon';

interface SectionCommunalFormModal {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onFailed: () => void;
  villes: VilleAttributes[];
}
const SectionCommunalFormModal: React.FC<SectionCommunalFormModal> = ({ isOpen, onClose, onSuccess, onFailed, villes }) => {
  const [adding, setAdding] = useState<boolean>(false);
  const [tooltips, setTooltips] = useState<Record<string, string>>({});
  const [sectioncommunale, setSectioncommunale] = useState({
    id_ville: "",
    libelle_sectioncommunale: "",

  });

  const [errors, setErrors] = useState({
    id_ville: "",
    libelle: "",

  });

  const villeOption = villes.map((vil) => ({
    value: vil.id_ville,
    label: vil.libelle_ville
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
    if (!sectioncommunale.libelle_sectioncommunale) {
      newErrors.libelle = "Nom de la section communale est requis";
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
          libelle_sectioncommunale: "",

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
                htmlFor="id_ville"
                className="block text-sm font-normal mb-2"
              >
                Choisir une ville
                <TooltipIcon field='id_ville' tooltipMessage={tooltips['id_ville']} />
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
                htmlFor="libelle_sectioncommunale"
                className="block text-sm font-normal mb-2"
              >
                Section Communale
                <TooltipIcon field='libelle_sectioncommunale' tooltipMessage={tooltips['libelle_sectioncommunale']} />
              </label>
              <input
                type="text"
                placeholder="Entrer la commune"
                id="libelle_sectioncommunale"
                name="libelle_sectioncommunale"
                onChange={handleinputChange}
                value={sectioncommunale.libelle_sectioncommunale}
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
