"use server";

import Tooltip from "../api/models/tooltipModel";

export async function updateTooltip(
  id: number,
  nom_champ: string,
  nom_application: string,
  message_tooltip: string,

) {
  const tooltip = await Tooltip.findOne({ where: { id } });
  if (!tooltip) {
    throw new Error("Tooltip not found");
  }
  await tooltip.update({
    nom_champ, nom_application, message_tooltip
  });
  return tooltip.toJSON();
}

export async function deleteCountry(id: number) {
  const tooltip = await Tooltip.findByPk(id);
  if (!tooltip) {
    throw new Error('Country not found');
  }
  await tooltip.destroy();
  return { message: 'Country deleted successfully' };
}
