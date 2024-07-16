import { Box, HStack, IconButton, Text, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';

interface Adresse {
  id_adresses: number;
  numero_rue: string;
  libelle: string;
  cle_unicite: string;
  statut: string;
  id_sectioncommune: number;
}

interface SectionCommune {
  id_sectioncommune: number;
  id_commune: number;
  libelle: string;
  Adresses: Adresse[];
}

interface Commune {
  id_commune: number;
  id_departement: number;
  libelle: string;
  code_postal: string;
  longitude: string;
  lattitude: string;
  SectionCommunes: SectionCommune[];
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

const Subdivision: React.FC<Props> = ({ data }) => {
  const [state, setState] = useState<any>({});
  const [stateDept, setStateDept] = useState<any>({});
  const [stateCommune, setStateCommune] = useState<any>({});
  const [stateSection, setStateSection] = useState<any>({});
  const [stateAdresse, setStateAdresse] = useState<any>({});

  useEffect(() => {
    data.forEach((pays: Pays) => {
      setState({ ...state, [`${pays.libelle}-${pays.id_pays}`]: false })

      pays.Departements.forEach((dept: Departement) => {
        setStateDept({ ...stateDept, [`${dept.libelle}-${dept.id_departement}`]: false })

        dept.Communes.forEach((com: Commune) => {
          setStateCommune({ ...stateCommune, [`${com.libelle}-${com.id_commune}`]: false })

          com.SectionCommunes.forEach((section: SectionCommune) => {
            setStateSection({ ...stateSection, [`${section.libelle}-${section.id_sectioncommune}`]: false })

            section.Adresses.forEach((adr: Adresse) => {
              setStateAdresse({ ...stateAdresse, [`${adr.libelle}-${adr.id_adresses}`]: false })
            })
          })
        })
      })
    })
  }, [])

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

              aria-label="Toggle"
              variant="ghost"
            />
            <Text className='cursor-pointer'><span className='font-bold'>Pays:</span>{libelle}</Text>
          </HStack>

          {state[`${libelle}-${id_pays}`] && (
            <VStack align="start" pl={8}>
              {Departements.map(({ id_departement, libelle: deptLibelle, Communes }: Departement) => (
                <Box key={id_departement} w="100%">
                  <HStack onClick={() => toggleState(`${deptLibelle}-${id_departement}`, setStateDept)}>
                    <IconButton
                      icon={renderIcon(stateDept[`${deptLibelle}-${id_departement}`])}

                      aria-label="Toggle"
                      variant="ghost"
                    />
                    <Text className='cursor-pointer'> <span className='font-bold'>Departement: </span>{deptLibelle}</Text>
                  </HStack>
                  {stateDept[`${deptLibelle}-${id_departement}`] && (
                    <VStack align="start" pl={8}>
                      {Communes.map(({ id_commune, libelle: comLibelle, SectionCommunes }: Commune) => (
                        <Box key={id_commune} w="100%">
                          <HStack onClick={() => toggleState(`${comLibelle}-${id_commune}`, setStateCommune)}>
                            <IconButton
                              icon={renderIcon(stateCommune[`${comLibelle}-${id_commune}`])}

                              aria-label="Toggle"
                              variant="ghost"
                            />
                            <Text className='cursor-pointer'><span className='font-bold'>Commune: </span>{comLibelle}</Text>
                          </HStack>
                          {stateCommune[`${comLibelle}-${id_commune}`] && (
                            <VStack align="start" pl={8}>
                              {SectionCommunes.map(({ id_sectioncommune, libelle: secLibelle, Adresses }: SectionCommune) => (
                                <Box key={id_sectioncommune} w="100%">
                                  <HStack onClick={() => toggleState(`${secLibelle}-${id_sectioncommune}`, setStateSection)}>
                                    <IconButton
                                      icon={renderIcon(stateSection[`${secLibelle}-${id_sectioncommune}`])}

                                      aria-label="Toggle"
                                      variant="ghost"
                                    />
                                    <Text className='cursor-pointer'> <span className='font-bold'>Section Communale: </span>{secLibelle}</Text>
                                  </HStack>
                                  {stateSection[`${secLibelle}-${id_sectioncommune}`] && (
                                    <VStack align="start" pl={8}>
                                      {Adresses.map(({ id_adresses, libelle: adrLibelle }: Adresse) => (
                                        <Box key={id_adresses} w="100%">
                                          <HStack onClick={() => toggleState(`${adrLibelle}-${id_adresses}`, setStateAdresse)}>
                                            <IconButton
                                              icon={renderIcon(stateAdresse[`${adrLibelle}-${id_adresses}`])}
                                              onClick={() => toggleState(`${adrLibelle}-${id_adresses}`, setStateAdresse)}
                                              aria-label="Toggle"
                                              variant="ghost"
                                            />
                                            <Text className='cursor-pointer'> <span className='font-bold'>Adresse:</span> {adrLibelle}</Text>
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
  );
};

export default Subdivision;