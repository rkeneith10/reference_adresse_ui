import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";
import Adresse from "../models/adresseModel";
import Commune from "../models/communeModel";
import Departement from "../models/departementModel";
import Pays from "../models/paysModel";
import SectionCommune from "../models/sectionCommunalModel";
import Ville from "../models/villeModel";

// Middleware CORS
const withCORS = (response: NextResponse) => {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
};

export async function GET() {
  try {
    const adr = await Adresse.findAll({});
    if (adr) {
      const response = NextResponse.json({ data: adr }, { status: 200 });
      return withCORS(response);
    }
  } catch (error: any) {
    console.error(error);
    const response = NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    return withCORS(response);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { numero_rue, libelle_adresse, statut, id_sectioncommunale, code_postal ,from} = await req.json();

    const sectionCommunale = await SectionCommune.findOne({ where: { id_sectioncommunale } });
    if (!sectionCommunale) {
      const response = NextResponse.json({ message: "Section Communale not found." }, { status: 404 });
      return withCORS(response);
    }

    const ville = await Ville.findOne({ where: { id_ville: sectionCommunale.id_ville } });
    if (!ville) {
      const response = NextResponse.json({ message: "Ville not found" }, { status: 400 });
      return withCORS(response);
    }

    const commune = await Commune.findOne({ where: { id_commune: ville.id_commune } });
    if (!commune) {
      const response = NextResponse.json({ message: "Commune not found." }, { status: 404 });
      return withCORS(response);
    }

    const departement = await Departement.findOne({ where: { id_departement: commune.id_departement } });
    if (!departement) {
      const response = NextResponse.json({ message: "Departement not found." }, { status: 404 });
      return withCORS(response);
    }

    const pays = await Pays.findOne({ where: { id_pays: departement.id_pays } });
    if (!pays) {
      const response = NextResponse.json({ message: "Pays not found." }, { status: 404 });
      return withCORS(response);
    }

    // Generer clé unicité
    const cle_unicite_base = `${pays.code_pays}${departement.code_departement}${code_postal}${numero_rue || 'X'}${libelle_adresse.charAt(0).toUpperCase()}${libelle_adresse.replace(/[aeiouAEIOU\s]/g, '').toUpperCase()}`;

    // Trouver le plus grand numéro de séquence avec une cle_unicite similaire
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
      sequence = (highestSequence + 1).toString().padStart(2, "0");
    }

    const cle_unicite = `${cle_unicite_base}${sequence}`;

    const adresse = await Adresse.create({
      numero_rue,
      libelle_adresse,
      statut,
      id_sectioncommunale,
      code_postal,
      cle_unicite,
      from,
    });

    const response = NextResponse.json({ message: "Adresse created successfully", data: adresse }, { status: 201 });
    return withCORS(response);
  } catch (error: any) {
    console.error(error);
    const response = NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    return withCORS(response);
  }
}

export async function OPTIONS() {
  const response = NextResponse.json(null, { status: 204 });
  return withCORS(response);
}
