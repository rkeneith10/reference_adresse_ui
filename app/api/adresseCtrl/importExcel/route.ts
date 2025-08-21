import { NextRequest, NextResponse } from 'next/server';
import Adresse, { AdresseAttributes } from '../../models/adresseModel';
import Commune from '../../models/communeModel';

export async function POST(req: NextRequest) {
  try {

    const body = await req.json();
    if (!Array.isArray(body)) {
      throw new Error("Request body must be an array of addresses");
    }

    const adresses = body as AdresseAttributes[];


    for (let adr of adresses) {

      const communeExists = await Commune.findByPk(adr.id_commune);

      if (!communeExists) {
        console.error(`Commune avec id ${adr.id_commune} non trouvée.`);
        continue;
      }

      const createdAdresses = await Adresse.create({
        numero_rue: adr.numero_rue,
        libelle_adresse: adr.libelle_adresse,
        code_postal: adr.code_postal,
        cle_unicite: adr.cle_unicite,
        statut: adr.statut,
        section_communale: adr.section_communale,
        id_commune: adr.id_commune,
        from: adr.from,
        type_batiment: adr.type_batiment,
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
