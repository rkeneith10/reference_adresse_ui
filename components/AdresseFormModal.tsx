import { CommuneAttributes } from '@/app/api/models/communeModel';
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
import { FaQuestionCircle } from 'react-icons/fa';
import Select from 'react-select';


interface AdresseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onFailed: () => void;
  communes: CommuneAttributes[];
}

const AdresseFormModal: React.FC<AdresseFormModalProps> = ({ isOpen, onClose, onSuccess, onFailed, communes }) => {
  const [adding, setAdding] = useState(false);

  const [visibleTooltip, setVisibleTooltip] = useState<string | null>(null);


  const [adresse, setAdresse] = useState({
    id_commune: "",
    section_communale: "",
    numero_rue: "",
    libelle_adresse: "",
    statut: "En creation",
    code_postal: "",
    from: "moi"

  });

  const [errors, setErrors] = useState({
    numero_rue: "",
    libelle_adresse: "",
    id_commune: "",
    section_communale: "",
    code_postal: ""
  });

  const [tooltips, setTooltips] = useState<Record<string, string>>({});


  // const handleTooltipToggle = (field: keyof typeof tooltips) => {
  //   setTooltips((prevState) => ({
  //     ...prevState,
  //     [field]: !prevState[field],
  //   }));
  // };


  const handleinputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAdresse({ ...adresse, [name]: value });
    setErrors({ ...errors, [name]: "" });

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

  const validateForm = () => {
    let valid = true;
    const newErrors = { libelle_adresse: "", numero_rue: "", id_commune: "", section_communale: "", code_postal: "" };
    if (!adresse.section_communale) {
      newErrors.section_communale = "La section communale est requise";
      valid = false;
    }
    if (!adresse.id_commune) {
      newErrors.id_commune = "La commune de reference est requise";
      valid = false;
    }
    if (!adresse.libelle_adresse) {
      newErrors.libelle_adresse = "L'adresse est requise";
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
      if (response.status === 201) {
        setAdresse({
          id_commune: "",
          section_communale: "",
          numero_rue: "",
          libelle_adresse: "",
          statut: "En creation",
          code_postal: "",
          from: "moi",

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
    setAdresse({ ...adresse, id_commune: selectedOption.value });
    setErrors({ ...errors, id_commune: "" });
  };

  const adresseOption = communes.map((comm) => ({
    value: comm.id_commune,
    label: comm.libelle_commune
  }))

  const handleTooltipToggle = (field: string) => {
    setVisibleTooltip(field);
  };

  const handleTooltipHide = () => {
    setVisibleTooltip(null);
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
            Ajouter une adresse
          </ModalHeader>
          <ModalBody>
            <div className="mb-4 relative">
              <label htmlFor="id_sectioncommunale" className="block text-sm font-normal mb-2">
                Choisir une commune
                <div
                  className="ml-2 inline-block cursor-pointer relative"
                  onMouseEnter={() => handleTooltipToggle('id_sectioncommunale')}
                  onMouseLeave={handleTooltipHide}
                >
                  <FaQuestionCircle className="text-gray-500" size={15} />
                  {visibleTooltip === 'id_sectioncommunale' && (
                    <div className="absolute z-10 bg-gray-900 text-white text-md rounded-lg shadow-lg p-3 -top-12 left-1/2 transform -translate-x-1/2 w-72 text-center">
                      {tooltips['id_sectioncommunale']}
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45 bottom-[-5px]"></div>
                    </div>
                  )}
                </div>
              </label>
              <Select
                placeholder="Choisir une commune"
                name="id_commune"
                onChange={handleSelectChange}
                options={adresseOption}
                className="w-full"
              />
              {errors.id_commune && (
                <span className="text-red-500 text-sm">{errors.id_commune}</span>
              )}
            </div>

            <div className="mb-4 relative">
              <label htmlFor="libelle_adresse" className="block text-sm font-normal mb-2">
                Libelle
                <div
                  className="ml-2 inline-block cursor-pointer relative"
                  onMouseEnter={() => handleTooltipToggle('libelle_adresse')}
                  onMouseLeave={handleTooltipHide}
                >
                  <FaQuestionCircle className="text-gray-500" size={15} />
                  {visibleTooltip === 'libelle_adresse' && (
                    <div className="absolute z-10 bg-gray-900 text-white text-md rounded-lg shadow-lg p-3 -top-12 left-1/2 transform -translate-x-1/2 w-72 text-center">
                      {tooltips['libelle_adresse']}
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45 bottom-[-5px]"></div>
                    </div>
                  )}
                </div>
              </label>
              <input
                type="text"
                placeholder="Entrer l'adresse"
                id="libelle_adresse"
                name="libelle_adresse"
                onChange={handleinputChange}
                value={adresse.libelle_adresse}
                className="border rounded-md w-full p-2 text-sm"
              />
              {errors.libelle_adresse && (
                <span className="text-red-500 text-sm">{errors.libelle_adresse}</span>
              )}
            </div>

            <div className="mb-4 relative">
              <label htmlFor="numero_rue" className="block text-sm font-normal mb-2">
                Numero de rue
                <div
                  className="ml-2 inline-block cursor-pointer relative"
                  onMouseEnter={() => handleTooltipToggle('numero_rue')}
                  onMouseLeave={handleTooltipHide}
                >
                  <FaQuestionCircle className="text-gray-500" size={15} />
                  {visibleTooltip === 'numero_rue' && (
                    <div className="absolute z-10 bg-gray-900 text-white text-md rounded-lg shadow-lg p-3 -top-12 left-1/2 transform -translate-x-1/2 w-72 text-center">
                      {tooltips['numero_rue']}
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45 bottom-[-5px]"></div>
                    </div>
                  )}
                </div>
              </label>
              <input
                type="text"
                placeholder="Entrer le numéro de rue"
                id="numero_rue"
                name="numero_rue"
                onChange={handleinputChange}
                value={adresse.numero_rue}
                className="border rounded-md w-full p-2 text-sm"
              />
              {errors.numero_rue && (
                <span className="text-red-500 text-sm">{errors.numero_rue}</span>
              )}
            </div>


            <div className="mb-4 relative">
              <label htmlFor="section_communale" className="block text-sm font-normal mb-2">
                Section Communale
                <div
                  className="ml-2 inline-block cursor-pointer relative"
                  onMouseEnter={() => handleTooltipToggle('section_communale')}
                  onMouseLeave={handleTooltipHide}
                >
                  <FaQuestionCircle className="text-gray-500" size={15} />
                  {visibleTooltip === 'section_communale' && (
                    <div className="absolute z-10 bg-gray-900 text-white text-md rounded-lg shadow-lg p-3 -top-12 left-1/2 transform -translate-x-1/2 w-72 text-center">
                      {tooltips['section_communale']}
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45 bottom-[-5px]"></div>
                    </div>
                  )}
                </div>
              </label>
              <input
                type="text"
                placeholder="Entrer la section communale"
                id="section_communale"
                name="section_communale"
                onChange={handleinputChange}
                value={adresse.section_communale}
                className="border rounded-md w-full p-2 text-sm"
              />
              {errors.section_communale && (
                <span className="text-red-500 text-sm">{errors.section_communale}</span>
              )}
            </div>




            <div className="mb-4 relative">
              <label htmlFor="code_postal" className="block text-sm font-normal mb-2">
                Code postal
                <div
                  className="ml-2 inline-block cursor-pointer relative"
                  onMouseEnter={() => handleTooltipToggle('code_postal')}
                  onMouseLeave={handleTooltipHide}
                >
                  <FaQuestionCircle className="text-gray-500" size={15} />
                  {visibleTooltip === 'code_postal' && (
                    <div className="absolute z-10 bg-gray-900 text-white text-md rounded-lg shadow-lg p-3 -top-12 left-1/2 transform -translate-x-1/2 w-72 text-center">
                      {tooltips['code_postal']}
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45 bottom-[-5px]"></div>
                    </div>
                  )}
                </div>
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
              {errors.code_postal && (
                <span className="text-red-500 text-sm">{errors.code_postal}</span>
              )}
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




