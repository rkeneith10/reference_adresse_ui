import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";
import Adresse from "../models/adresseModel";
import Commune from "../models/communeModel";
import Departement from "../models/departementModel";
import Pays from "../models/paysModel";
import SectionCommune from "../models/sectionCommunalModel";
import Ville from "../models/villeModel";

export async function GET() {
  try {
    const adr = await Adresse.findAll({})
    if (adr) {
      return NextResponse.json({ data: adr }, { status: 200 })
    }
  } catch (error: any) {
    console.error(error)
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { numero_rue, libelle_adresse, statut, id_sectioncommunale, code_postal } = await req.json();

    const sectionCommunale = await SectionCommune.findOne({ where: { id_sectioncommunale } });
    if (!sectionCommunale) {
      return NextResponse.json(
        { message: "Section Communale not found." },
        { status: 404 }
      );
    }

    const ville = await Ville.findOne({ where: { id_ville: sectionCommunale.id_ville } });
    if (!ville) {
      return NextResponse.json({ message: "Ville not found" }, { status: 400 })
    }

    const commune = await Commune.findOne({ where: { id_commune: ville.id_commune } });
    if (!commune) {
      return NextResponse.json(
        { message: "Commune not found." },
        { status: 404 }
      );
    }

    const departement = await Departement.findOne({ where: { id_departement: commune.id_departement } });
    if (!departement) {
      return NextResponse.json(
        { message: "Departement not found." },
        { status: 404 }
      );
    }

    const pays = await Pays.findOne({ where: { id_pays: departement.id_pays } });
    if (!pays) {
      return NextResponse.json(
        { message: "Pays not found." },
        { status: 404 }
      );
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
      sequence = (highestSequence + 1).toString().padStart(2, '0');
    }

    const cle_unicite = `${cle_unicite_base}${sequence}`;


    const newAddress = await Adresse.create({
      numero_rue,
      libelle_adresse,
      cle_unicite,
      statut,
      code_postal,
      id_sectioncommunale,

    });

    return NextResponse.json({
      success: true,
      data: newAddress,
    }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({
      message: "Erreur lors de la création de l'adresse",
      error: error.message,
    }, { status: 500 });
  }
}

