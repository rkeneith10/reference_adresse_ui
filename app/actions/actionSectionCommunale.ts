"use server";

import SectionCommunale from "../api/models/sectionCommunalModel";

export async function updateSectionCommunale(
  id_sectioncommune: number,
  libelle: string,
  id_ville: number

) {
  const com = await SectionCommunale.findOne({ where: { id_sectioncommune } });
  if (!com) {
    throw new Error("Section Communale not found");
  }
  await com.update({
    libelle,
    id_ville

  });
  return com.toJSON();
}