import { Box, Select, VStack } from "@chakra-ui/react";
import React, { useState } from 'react';

interface Adresse {
  id_adresses: number,
  numero_rue: string,
  libelle: string,
  cle_unicite: string,
  statut: string,
  id_sectioncommune: number
}

interface SectionCommune {
  id_sectioncommune: number,
  id_commune: number,
  libelle: string,
  Adresses: Adresse[]
}

interface Commune {
  id_commune: number,
  id_departement: number,
  libelle: string,
  code_postal: string,
  longitude: string,
  lattitude: string,
  SectionCommunes: SectionCommune[]
}

interface Departement {
  id_departement: number,
  libelle: string,
  code_departement: string,
  chef_lieux: string,
  id_pays: number,
  Communes: Commune[]
}

interface Pays {
  id_pays: number,
  libelle: string,
  code_pays: string,
  continent: string,
  indicatif_tel: string,
  fuseau_horaire: string,
  Departements: Departement[]
}

interface Props {
  data: Pays[]
}

const Subdivision: React.FC<Props> = ({ data }) => {
  const [selectedCountry, setSelectedCountry] = useState<Pays | null>(null);
  const [selectedDepartement, setSelectedDepartement] = useState<Departement | null>(null);
  const [selectedCommune, setSelectedCommune] = useState<Commune | null>(null);
  const [selectedSection, setSelectedSection] = useState<SectionCommune | null>(null);
  const [selectedAdresse, setSelectedAdresee] = useState<Adresse | null>(null);

  const handleChangeCountry = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryId = parseInt(e.target.value);
    const country = data.find(p => p.id_pays === countryId) || null;
    setSelectedCountry(country);
    setSelectedDepartement(null);
    setSelectedCommune(null);
    setSelectedSection(null);
  };

  const handleChangeDepartement = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!selectedCountry) return;
    const departementId = parseInt(e.target.value);
    const departement = selectedCountry?.Departements.find(dept => dept.id_departement === departementId) || null;
    setSelectedDepartement(departement);
    setSelectedCommune(null);
    setSelectedSection(null);
  };

  const handleChangeCommune = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!selectedDepartement) return;
    const communeId = parseInt(e.target.value);
    const commune = selectedDepartement?.Communes.find(com => com.id_commune === communeId) || null;
    setSelectedCommune(commune);
    setSelectedSection(null);
  };

  const handleChangeSection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!selectedCommune) return;
    const sectionId = parseInt(e.target.value);
    const section = selectedCommune?.SectionCommunes.find(sect => sect.id_sectioncommune === sectionId) || null;
    setSelectedSection(section);
    setSelectedAdresee(null);
  };

  const handleChangeAdresse = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!selectedSection) return;
    const adresseId = parseInt(e.target.value);
    const adresse = selectedSection?.Adresses.find(adr => adr.id_adresses === adresseId) || null;
    setSelectedAdresee(adresse);
  };

  return (
    <VStack spacing={4}>
      <Box w="100%">
        <Select placeholder="Sélectionner un pays" onChange={handleChangeCountry}>
          {data.map(country => (
            <option key={country.id_pays} value={country.id_pays}>{country.libelle}</option>
          ))}
        </Select>
      </Box>

      {selectedCountry && (
        <Box w="100%">
          <Select placeholder="Sélectionner un département" onChange={handleChangeDepartement}>
            {selectedCountry.Departements.length > 0 ? (
              selectedCountry.Departements.map(dept => (
                <option key={dept.id_departement} value={dept.id_departement}>{dept.libelle}</option>
              ))
            ) : (
              <option>Aucun département disponible pour ce pays</option>
            )}
          </Select>
        </Box>
      )}

      {selectedDepartement && (
        <Box w="100%">
          <Select placeholder="Sélectionner une commune" onChange={handleChangeCommune}>
            {selectedDepartement.Communes.length > 0 ? (
              selectedDepartement.Communes.map(com => (
                <option key={com.id_commune} value={com.id_commune}>{com.libelle}</option>
              ))
            ) : (
              <option>Aucune commune disponible pour ce département</option>
            )}
          </Select>
        </Box>
      )}

      {selectedCommune && (
        <Box w="100%">
          <Select placeholder="Sélectionner une section communale" onChange={handleChangeSection}>
            {selectedCommune.SectionCommunes.length > 0 ? (
              selectedCommune.SectionCommunes.map(sect => (
                <option key={sect.id_sectioncommune} value={sect.id_sectioncommune}>{sect.libelle}</option>
              ))
            ) : (
              <option>Aucune section communale disponible pour cette commune</option>
            )}
          </Select>
        </Box>
      )}

      {selectedSection && (
        <Box w="100%">
          <Select placeholder="Sélectionner une adresse" onChange={handleChangeAdresse}>
            {selectedSection.Adresses.length > 0 ? (
              selectedSection.Adresses.map(adr => (
                <option key={adr.id_adresses} value={adr.id_adresses}>{adr.libelle}</option>
              ))
            ) : (
              <option>Aucune adresse disponible pour cette section communale</option>
            )}
          </Select>
        </Box>
      )}
    </VStack>
  );
};

export default Subdivision;
