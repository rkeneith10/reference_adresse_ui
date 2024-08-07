import { Box, HStack, IconButton, Text, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';

interface Adresse {
  id_adresses: number;
  numero_rue: string;
  libelle: string;
  cle_unicite: string;
  code_postal: string,
  statut: string;
  id_sectioncommune: number;
}

interface SectionCommune {
  id_sectioncommune: number;
  id_ville: number;
  libelle: string;
  Adresses: Adresse[];
}

interface Ville {
  id_ville: number;
  id_commune: number;
  libelle: string;
  longitude: string;
  lattitude: string;
  SectionCommunes: SectionCommune[];
}

interface Commune {
  id_commune: number;
  id_departement: number;
  libelle: string;
  Ville: Ville[];
}

interface Departement {
  id_departement: number;
  libelle: string;
  code_departement: string;
  chef_lieux: string;
  id_pays: number;
  Communes: Commune[];
}

interface Pays {
  id_pays: number;
  libelle: string;
  code_pays: string;
  continent: string;
  indicatif_tel: string;
  fuseau_horaire: string;
  Departements: Departement[];
}

interface Props {
  data: Pays[];
}

const SubdivisionGeographique: React.FC<Props> = ({ data }) => {
  const [state, setState] = useState<any>({});
  const [stateDept, setStateDept] = useState<any>({});
  const [stateCommune, setStateCommune] = useState<any>({});
  const [stateVille, setStateVille] = useState<any>({});
  const [stateSection, setStateSection] = useState<any>({});
  const [stateAdresse, setStateAdresse] = useState<any>({});

  useEffect(() => {
    data.forEach((pays: Pays) => {
      setState({ ...state, [`${pays.libelle}-${pays.id_pays}`]: false });

      pays.Departements.forEach((dept: Departement) => {
        setStateDept({ ...stateDept, [`${dept.libelle}-${dept.id_departement}`]: false });

        dept.Communes.forEach((com: Commune) => {
          setStateCommune({ ...stateCommune, [`${com.libelle}-${com.id_commune}`]: false });

          com.Ville.forEach((vil: Ville) => {
            setStateVille({ ...stateVille, [`${vil.libelle}-${vil.id_ville}`]: false });

            vil.SectionCommunes.forEach((section: SectionCommune) => {
              setStateSection({ ...stateSection, [`${section.libelle}-${section.id_sectioncommune}`]: false });
              section.Adresses.forEach((adr: Adresse) => {
                setStateAdresse({ ...stateAdresse, [`${adr.libelle}-${adr.id_adresses}`]: false });
              });
            });
          });
        });
      });
    });
  }, [data]);

  const toggleState = (key: string, stateSetter: React.Dispatch<React.SetStateAction<any>>) => {
    stateSetter((prevState: any) => ({ ...prevState, [key]: !prevState[key] }));
  };

  const renderIcon = (isOpen: boolean) => (isOpen ? <FaMinus /> : <FaPlus />);

  return (
    <VStack align="start">
      {data.map(({ id_pays, libelle, Departements }: Pays) => (
        <Box key={id_pays} w="100%">
          <HStack onClick={() => toggleState(`${libelle}-${id_pays}`, setState)}>
            <IconButton
              icon={renderIcon(state[`${libelle}-${id_pays}`])}
              className='border border-gray-500'
              aria-label="Toggle"
            />
            <Text className='cursor-pointer'>
              <span className='font-bold text-blue-500'>Pays:</span> {libelle}
            </Text>
          </HStack>

          {state[`${libelle}-${id_pays}`] && (
            <VStack align="start" pl={8}>
              {Departements.map(({ id_departement, libelle: deptLibelle, Communes }: Departement) => (
                <Box key={id_departement} w="100%">
                  <HStack onClick={() => toggleState(`${deptLibelle}-${id_departement}`, setStateDept)}>
                    <IconButton
                      icon={renderIcon(stateDept[`${deptLibelle}-${id_departement}`])}
                      className='border border-gray-500'
                      aria-label="Toggle"
                      variant="ghost"
                    />
                    <Text className='cursor-pointer'>
                      <span className='font-bold text-blue-500'>Département:</span> {deptLibelle}
                    </Text>
                  </HStack>

                  {stateDept[`${deptLibelle}-${id_departement}`] && (
                    <VStack align="start" pl={8}>
                      {Communes.map(({ id_commune, libelle: comLibelle, Ville }: Commune) => (
                        <Box key={id_commune} w="100%">
                          <HStack onClick={() => toggleState(`${comLibelle}-${id_commune}`, setStateCommune)}>
                            <IconButton
                              icon={renderIcon(stateCommune[`${comLibelle}-${id_commune}`])}
                              className='border border-gray-500'
                              aria-label="Toggle"
                              variant="ghost"
                            />
                            <Text className='cursor-pointer'>
                              <span className='font-bold text-blue-500'>Commune:</span> {comLibelle}
                            </Text>
                          </HStack>

                          {stateCommune[`${comLibelle}-${id_commune}`] && (
                            <VStack align="start" pl={8}>
                              {Ville.map(({ id_ville, libelle: vilLibelle, SectionCommunes }: Ville) => (
                                <Box key={id_ville} w="100%">
                                  <HStack onClick={() => toggleState(`${vilLibelle}-${id_ville}`, setStateVille)}>
                                    <IconButton
                                      icon={renderIcon(stateVille[`${vilLibelle}-${id_ville}`])}
                                      className='border border-gray-500'
                                      aria-label="Toggle"
                                      variant="ghost"
                                    />
                                    <Text className='cursor-pointer'>
                                      <span className='font-bold text-blue-500'>Ville:</span> {vilLibelle}
                                    </Text>
                                  </HStack>

                                  {stateVille[`${vilLibelle}-${id_ville}`] && (
                                    <VStack align="start" pl={8}>
                                      {SectionCommunes.map(({ id_sectioncommune, libelle: secLibelle, Adresses }: SectionCommune) => (
                                        <Box key={id_sectioncommune} w="100%">
                                          <HStack onClick={() => toggleState(`${secLibelle}-${id_sectioncommune}`, setStateSection)}>
                                            <IconButton
                                              icon={renderIcon(stateSection[`${secLibelle}-${id_sectioncommune}`])}
                                              className='border border-gray-500'
                                              aria-label="Toggle"
                                              variant="ghost"
                                            />
                                            <Text className='cursor-pointer'>
                                              <span className='font-bold text-blue-500'>Section Communale:</span> {secLibelle}
                                            </Text>
                                          </HStack>

                                          {stateSection[`${secLibelle}-${id_sectioncommune}`] && (
                                            <VStack align="start" pl={8}>
                                              {Adresses.map(({ id_adresses, numero_rue, code_postal, libelle: adrLibelle }: Adresse) => (
                                                <Box key={id_adresses} w="100%">
                                                  <HStack onClick={() => toggleState(`${adrLibelle}-${id_adresses}`, setStateAdresse)}>
                                                    <IconButton
                                                      icon={renderIcon(stateAdresse[`${adrLibelle}-${id_adresses}`])}
                                                      aria-label="Toggle"
                                                      className='border border-gray-500'
                                                      variant="ghost"
                                                    />
                                                    <Text className='cursor-pointer'>
                                                      <span className='font-bold text-blue-500'>Adresse:</span> {`${code_postal},${numero_rue}, ${adrLibelle}`}
                                                    </Text>
                                                  </HStack>
                                                </Box>
                                              ))}
                                            </VStack>
                                          )}
                                        </Box>
                                      ))}
                                    </VStack>
                                  )}
                                </Box>
                              ))}
                            </VStack>
                          )}
                        </Box>
                      ))}
                    </VStack>
                  )}
                </Box>
              ))}
            </VStack>
          )}
        </Box>
      ))}
    </VStack>
  );
};

export default SubdivisionGeographique;
