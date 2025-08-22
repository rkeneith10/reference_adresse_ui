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
import validator from 'validator';


interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onFailed: () => void;

}

const UserFormModal: React.FC<UserFormModalProps> = ({ isOpen, onClose, onSuccess, onFailed }) => {
  const [adding, setAdding] = useState(false);

  const [visibleTooltip, setVisibleTooltip] = useState<string | null>(null);


  const [user, setUser] = useState({

    name: "",
    email: "",
    role: "",

  });

  const [errors, setErrors] = useState({

    name: "",
    email: "",
    role: "",
  });

  const [tooltips, setTooltips] = useState<Record<string, string>>({});

  const roles: any = [
    {
      id: "1",
      nom: "admin"
    },
    {
      id: "2",
      nom: "user"
    }
  ]


  const handleinputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
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
    const newErrors = { name: "", email: "", role: "" };
    if (!user.name) {
      newErrors.name = "Le nom de l'utilisateur est requis";
      valid = false;
    }
    if (!user.email) {
      newErrors.email = "L'email  est requis";
      valid = false;
    }
    if (!validator.isEmail(user.email)) {
      newErrors.email = "Entrez un email valide";
      valid = false;
    }
    if (!user.role) {
      newErrors.role = "Le role de l'utilisateur est requis";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const addUser = async () => {
    if (!validateForm()) {
      return;
    }
    setAdding(true);

    try {
      const response = await axios.post("/api/create-user", user, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 201) {
        const emailText = response.data.emailText;
        alert(emailText)
        setUser({

          name: "",
          email: "",
          role: ""

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
    setUser({ ...user, role: selectedOption.value });
    setErrors({ ...errors, role: "" });
  };

  const roleOption = roles.map((rl: any) => ({
    value: rl.nom,
    label: rl.nom
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
            Ajouter une utlisateur
          </ModalHeader>
          <ModalBody>


            <div className="mb-4 relative">
              <label htmlFor="name" className="block text-sm font-normal mb-2">
                Nom Complet
                <div
                  className="ml-2 inline-block cursor-pointer relative"
                  onMouseEnter={() => handleTooltipToggle('name')}
                  onMouseLeave={handleTooltipHide}
                >
                  <FaQuestionCircle className="text-gray-500" size={15} />
                  {visibleTooltip === 'name' && (
                    <div className="absolute z-10 bg-gray-900 text-white text-md rounded-lg shadow-lg p-3 -top-12 left-1/2 transform -translate-x-1/2 w-72 text-center">
                      {tooltips['name']}
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45 bottom-[-5px]"></div>
                    </div>
                  )}
                </div>
              </label>
              <input
                type="text"
                placeholder="Entrer le nom de l'utilisateur"
                id="name"
                name="name"
                onChange={handleinputChange}
                value={user.name}
                className="border rounded-md w-full p-2 text-sm"
              />
              {errors.name && (
                <span className="text-red-500 text-sm">{errors.name}</span>
              )}
            </div>

            <div className="mb-4 relative">
              <label htmlFor="email" className="block text-sm font-normal mb-2">
                Email
                <div
                  className="ml-2 inline-block cursor-pointer relative"
                  onMouseEnter={() => handleTooltipToggle('numero_rue')}
                  onMouseLeave={handleTooltipHide}
                >
                  <FaQuestionCircle className="text-gray-500" size={15} />
                  {visibleTooltip === 'email' && (
                    <div className="absolute z-10 bg-gray-900 text-white text-md rounded-lg shadow-lg p-3 -top-12 left-1/2 transform -translate-x-1/2 w-72 text-center">
                      {tooltips['email']}
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45 bottom-[-5px]"></div>
                    </div>
                  )}
                </div>
              </label>
              <input
                type="text"
                placeholder="Entrer l'email"
                id="email"
                name="email"
                onChange={handleinputChange}
                value={user.email}
                className="border rounded-md w-full p-2 text-sm"
              />
              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email}</span>
              )}
            </div>

            <div className="mb-4 relative">
              <label htmlFor="role" className="block text-sm font-normal mb-2">
                Choisir un role
                <div
                  className="ml-2 inline-block cursor-pointer relative"
                  onMouseEnter={() => handleTooltipToggle('role')}
                  onMouseLeave={handleTooltipHide}
                >
                  <FaQuestionCircle className="text-gray-500" size={15} />
                  {visibleTooltip === 'role' && (
                    <div className="absolute z-10 bg-gray-900 text-white text-md rounded-lg shadow-lg p-3 -top-12 left-1/2 transform -translate-x-1/2 w-72 text-center">
                      {tooltips['role']}
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45 bottom-[-5px]"></div>
                    </div>
                  )}
                </div>
              </label>
              <Select
                placeholder="Choisir un role"
                name="role"
                onChange={handleSelectChange}
                options={roleOption}
                className="w-full"
              />
              {errors.role && (
                <span className="text-red-500 text-sm">{errors.role}</span>
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
              onClick={addUser}
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

export default UserFormModal




