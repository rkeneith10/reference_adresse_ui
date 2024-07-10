import { NextRequest, NextResponse } from 'next/server';
import Adresse, { AdresseAttributes } from '../../models/adresseModel';
import SectionCommune from '../../models/sectionCommunalModel';

export async function POST(req: NextRequest) {
  try {

    const body = await req.json();
    if (!Array.isArray(body)) {
      throw new Error("Request body must be an array of addresses");
    }

    const adresses = body as AdresseAttributes[];


    for (let adr of adresses) {

      const sectionCommuneExists = await SectionCommune.findByPk(adr.id_sectioncommune);

      if (!sectionCommuneExists) {
        console.error(`SectionCommune avec id ${adr.id_sectioncommune} non trouvée.`);
        continue;
      }

      const createdAdresses = await Adresse.create({
        numero_rue: adr.numero_rue,
        libelle: adr.libelle,
        cle_unicite: adr.cle_unicite,
        statut: adr.statut,
        id_sectioncommune: adr.id_sectioncommune
      });

      console.log("Created addresses:", createdAdresses);
    }

    return NextResponse.json({ success: true, data: adresses }, { status: 200 });

  } catch (error: any) {
    console.error("Erreur dans l'API d'importation des adresses :", error);

    // Return an error response
    return NextResponse.json({
      message: "Erreur lors de l'importation des adresses",
      error: error.message,
    }, { status: 500 });
  }
}
