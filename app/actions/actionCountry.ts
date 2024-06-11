"use server";

import Country from "../api/models/paysModel";

export async function updateCountry(
  id_pays: number,
  libelle: string,
  code_pays: string,
  continent: string,
  indicatif_tel: string,
  fuseau_horaire: string
) {
  const country = await Country.findOne({ where: { id_pays } });
  if (!country) {
    throw new Error("Country not found");
  }
  await country.update({
    libelle,
    code_pays,
    continent,
    indicatif_tel,
    fuseau_horaire,
  });
  return country.toJSON();
}

export async function deleteCountry(id_pays: number) {
  const country = await Country.findByPk(id_pays);
  if (!country) {
    throw new Error('Country not found');
  }
  await country.destroy();
  return { message: 'Country deleted successfully' };
}
