import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";
import Adresse from "../models/adresseModel";
import Commune from "../models/communeModel";
import Departement from "../models/departementModel";
import Pays from "../models/paysModel";
import SectionCommunale from "../models/sectionCommunalModel";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { numero_rue, libelle, statut, id_sectioncommune } = await req.json();

    const sectionCommunale = await SectionCommunale.findOne({ where: { id_sectioncommune } });
    if (!sectionCommunale) {
      return NextResponse.json(
        { message: "Section Communale not found." },
        { status: 404 }
      );
    }

    const commune = await Commune.findOne({ where: { id_commune: sectionCommunale.id_commune } });
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

    // Generate unicité key
    const cle_unicite_base = `${pays.code_pays}${departement.code_departement}${commune.code_postal}${numero_rue || 'X'}${libelle.charAt(0).toUpperCase()}${libelle.replace(/[aeiouAEIOU\s]/g, '').toUpperCase()}`;

    // Find the highest sequence number with similar cle_unicite
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

    // Create the new address
    const newAddress = await Adresse.create({
      numero_rue,
      libelle,
      cle_unicite,
      statut,
      id_sectioncommune,

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
