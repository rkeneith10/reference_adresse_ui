"use server";

import Ville from "../api/models/villeModel";

export async function updateVille(
  id_ville: number,
  libelle: string,
  id_commune: number,

) {
  const vil = await Ville.findOne({ where: { id_ville } });
  if (!vil) {
    throw new Error("Ville not found");
  }
  await vil.update({
    libelle,
    id_commune
  });
  return vil.toJSON();
}