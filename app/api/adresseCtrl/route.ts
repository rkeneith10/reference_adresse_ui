import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";
import Adresse from "../models/adresseModel";
import Commune from "../models/communeModel";
import Departement from "../models/departementModel";
import Pays from "../models/paysModel";


export async function GET(req: NextRequest) {
  try {

    const adr = await Adresse.findAll({});
    if (adr) {
      const response = NextResponse.json({ data: adr }, { status: 200 });

      return response;
    }
  } catch (error: any) {
    console.error(error);
    const response = NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    return response;
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      numero_rue,
      libelle_adresse,
      statut,
      id_commune,
      section_communale,
      code_postal,
      from,
    } = await req.json();

    let cle_unicite_base;
    let cle_unicite;





      const commune = await Commune.findOne({ where: { id_commune } });
      if (!commune) {
        const response = NextResponse.json({ message: "Commune not found." }, { status: 404 });
        return response;
      }

      const departement = await Departement.findOne({ where: { id_departement: commune.id_departement } });
      if (!departement) {
        const response = NextResponse.json({ message: "Departement not found." }, { status: 404 });
        return response;
      }

      const pays = await Pays.findOne({ where: { id_pays: departement.id_pays } });
      if (!pays) {
        const response = NextResponse.json({ message: "Pays not found." }, { status: 404 });
        return response;
      }

      cle_unicite_base = `${pays.code_pays}${departement.code_departement}${code_postal}${numero_rue || 'X'}${libelle_adresse
        .charAt(0)
        .toUpperCase()}${libelle_adresse.replace(/[aeiouAEIOU\s]/g, '').toUpperCase()}`;

      // Trouver le plus grand numéro de séquence pour des clés similaires
      const similarKeys = await Adresse.findAll({
        where: {
          cle_unicite: {
            [Op.like]: `${cle_unicite_base}%`,
          },
        },
      });

      let sequence = '01';
      if (similarKeys.length > 0) {
        const highestSequence = Math.max(...similarKeys.map(key => parseInt(key.cle_unicite.slice(-2))));
        sequence = (highestSequence + 1).toString().padStart(2, '0');
      }

      cle_unicite = `${cle_unicite_base}${sequence}`;


      const adresse = await Adresse.create({
        numero_rue,
        libelle_adresse,
        statut,
        id_commune,
        section_communale,
        code_postal,
        cle_unicite,
        from,
      });

      const response = NextResponse.json(
        { message: "Adresse created successfully", adresse },
        { status: 201 }
      );
      return response;
    


    return response;
  } catch (error: any) {
    console.error(error);
    const response = NextResponse.json({ error: `Internal Server Error ${error}` }, { status: 500 });
    return response;
  }

  
}



