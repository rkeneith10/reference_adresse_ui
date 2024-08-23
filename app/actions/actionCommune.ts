"use server";

import Commune from "../api/models/communeModel";

export async function updateCommune(
  id_commune: number,
  libelle_commune: string,
  id_departement: number
) {
  const com = await Commune.findOne({ where: { id_commune } });
  if (!com) {
    throw new Error("Commune not found");
  }
  await com.update({
    libelle_commune,

    id_departement
  });
  return com.toJSON();
}