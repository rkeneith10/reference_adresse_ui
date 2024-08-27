import { Box, HStack, IconButton, Text, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';

interface Adresse {
  id_adresses: number;
  numero_rue: string;
  libelle_adresse: string;
  cle_unicite: string;
  code_postal: string,
  statut: string;
  id_sectioncommunale: number;
}

interface SectionCommune {
  id_sectioncommunale: number;
  id_ville: number;
  libelle_sectioncommunale: string;
  Adresses: Adresse[];
}

interface Ville {
  id_ville: number;
  id_commune: number;
  libelle_ville: string;
  longitude: string;
  lattitude: string;
  SectionCommunes: SectionCommune[];
}

interface Commune {
  id_commune: number;
  id_departement: number;
  libelle_commune: string;
  Villes: Ville[];
}

interface Departement {
  id_departement: number;
  libelle_departement: string;
  code_departement: string;
  chef_lieux: string;
  id_pays: number;
  Communes: Commune[];
}

interface Pays {
  id_pays: number;
  libelle_pays: string;
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
      setState((prevState: any) => ({ ...prevState, [`${pays.libelle_pays}-${pays.id_pays}`]: false }));

      pays.Departements?.forEach((dept: Departement) => {
        setStateDept((prevState: any) => ({ ...prevState, [`${dept.libelle_departement}-${dept.id_departement}`]: false }));

        dept.Communes?.forEach((com: Commune) => {
          setStateCommune((prevState: any) => ({ ...prevState, [`${com.libelle_commune}-${com.id_commune}`]: false }));

          com.Villes?.forEach((vil: Ville) => {
            setStateVille((prevState: any) => ({ ...prevState, [`${vil.libelle_ville}-${vil.id_ville}`]: false }));

            vil.SectionCommunes?.forEach((section: SectionCommune) => {
              setStateSection((prevState: any) => ({ ...prevState, [`${section.libelle_sectioncommunale}-${section.id_sectioncommunale}`]: false }));

              section.Adresses?.forEach((adr: Adresse) => {
                setStateAdresse((prevState: any) => ({ ...prevState, [`${adr.libelle_adresse}-${adr.id_adresses}`]: false }));
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
      {data?.map(({ id_pays, libelle_pays, Departements }: Pays) => (
        <Box key={id_pays} w="100%">
          <HStack onClick={() => toggleState(`${libelle_pays}-${id_pays}`, setState)}>
            <IconButton
              icon={renderIcon(state[`${libelle_pays}-${id_pays}`])}
              className='border border-gray-500'
              aria-label="Toggle"
            />
            <Text className='cursor-pointer'>
              <span className='font-bold text-blue-500'>Pays:</span> {libelle_pays}
            </Text>
          </HStack>

          {state[`${libelle_pays}-${id_pays}`] && (
            <VStack align="start" pl={8}>
              {Departements?.map(({ id_departement, libelle_departement: deptLibelle, Communes }: Departement) => (
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
                      {Communes?.map(({ id_commune, libelle_commune: comLibelle, Villes }: Commune) => (
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
                              {Villes?.map(({ id_ville, libelle_ville: vilLibelle, SectionCommunes }: Ville) => (
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
                                      {SectionCommunes?.map(({ id_sectioncommunale, libelle_sectioncommunale: secLibelle, Adresses }: SectionCommune) => (
                                        <Box key={id_sectioncommunale} w="100%">
                                          <HStack onClick={() => toggleState(`${secLibelle}-${id_sectioncommunale}`, setStateSection)}>
                                            <IconButton
                                              icon={renderIcon(stateSection[`${secLibelle}-${id_sectioncommunale}`])}
                                              className='border border-gray-500'
                                              aria-label="Toggle"
                                              variant="ghost"
                                            />
                                            <Text className='cursor-pointer'>
                                              <span className='font-bold text-blue-500'>Section Communale:</span> {secLibelle}
                                            </Text>
                                          </HStack>

                                          {stateSection[`${secLibelle}-${id_sectioncommunale}`] && (
                                            <VStack align="start" pl={8}>
                                              {Adresses?.map(({ id_adresses, numero_rue, code_postal, libelle_adresse: adrLibelle }: Adresse) => (
                                                <Box key={id_adresses} w="100%">
                                                  <HStack onClick={() => toggleState(`${adrLibelle}-${id_adresses}`, setStateAdresse)}>
                                                    {/* <IconButton
                                                      icon={renderIcon(stateAdresse[`${adrLibelle}-${id_adresses}`])}
                                                      aria-label="Toggle"
                                                      className='border border-gray-500'
                                                      variant="ghost"
                                                    /> */}
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
