import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";
import Adresse from "../models/adresseModel";
import Commune from "../models/communeModel";
import Departement from "../models/departementModel";
import { default as Country, default as Pays } from "../models/paysModel";


export async function GET(req: NextRequest) {
  try {
    const adresses = await Adresse.findAll({
      include: [
        {
          model: Commune,
          attributes: ["libelle_commune", "id_commune"],
          include: [
            {
              model: Departement,
              attributes: ["libelle_departement", "id_departement"],
              include: [
                {
                  model: Country,
                  attributes: ["libelle_pays", "id_pays"],
                },
              ],
            },
          ],
        },
      ],
      order: [["id_adresses", "DESC"]],
    });

    return NextResponse.json({ data: adresses }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search";

async function getCoordinates(adresse: string): Promise<{ lat: number; lon: number } | null> {
  try {
    const response = await axios.get(NOMINATIM_BASE_URL, {
      params: {
        q: adresse,
        format: "json",
        addressdetails: 1,
        limit: 1,
      },
    });

    if (response.data.length > 0) {
      return {
        lat: parseFloat(response.data[0].lat),
        lon: parseFloat(response.data[0].lon),
      };
    }
    return null;
  } catch (error) {
    console.error("Erreur lors de la requête Nominatim :", error);
    return null;
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
      type_batiment
    } = await req.json();

    const commune = await Commune.findOne({ where: { id_commune } });
    if (!commune) {
      return NextResponse.json({ message: "Commune not found." }, { status: 404 });
    }

    const departement = await Departement.findOne({ where: { id_departement: commune.id_departement } });
    if (!departement) {
      return NextResponse.json({ message: "Departement not found." }, { status: 404 });
    }

    const pays = await Pays.findOne({ where: { id_pays: departement.id_pays } });
    if (!pays) {
      return NextResponse.json({ message: "Pays not found." }, { status: 404 });
    }

    // Génération de la clé d'unicité
    const cle_unicite_base = `${pays.code_pays}${departement.code_departement}${code_postal}${numero_rue || 'X'}${libelle_adresse
      .charAt(0)
      .toUpperCase()}${libelle_adresse.replace(/[aeiouAEIOU\s]/g, '').toUpperCase()}`;

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

    const cle_unicite = `${cle_unicite_base}${sequence}`;

    // Création sans latitude et longitude
    const adresse = await Adresse.create({
      numero_rue,
      libelle_adresse,
      statut,
      id_commune,
      section_communale,
      code_postal,
      cle_unicite,
      latitude: 10.00,
      longitude: 10.00,
      from,
      type_batiment
    });

    return NextResponse.json({ message: "Adresse créée avec succès", adresse }, { status: 201 });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
  }
}






