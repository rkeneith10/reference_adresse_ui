import { NextRequest, NextResponse } from 'next/server';
import { Op } from 'sequelize';
import Adresse from '../../models/adresseModel';
import Commune from '../../models/communeModel';
import Departement from '../../models/departementModel';
import Pays from '../../models/paysModel';
import SectionCommunale from '../../models/sectionCommunalModel';

export async function POST(req: NextRequest) {
  try {
    const { id_adresses, libelle, numero_rue, id_sectioncommune, code_postal, statut } = await req.json();

    const adr = await Adresse.findOne({ where: { id_adresses } });
    if (!adr) {
      console.error("Adresse not found:", id_adresses);
      return NextResponse.json({ message: "Adresse not found" }, { status: 404 });
    }
    console.log(adr)

    const sectionCommunale = await SectionCommunale.findOne({ where: { id_sectioncommune } });
    if (!sectionCommunale) {
      console.error("Section Communale not found:", id_sectioncommune);
      return NextResponse.json({ message: "Section Communale not found." }, { status: 404 });
    }
    console.log(sectionCommunale)
    const commune = await Commune.findOne({ where: { id_commune: sectionCommunale.id_ville } });
    if (!commune) {
      console.error("Commune not found for Section Communale:", id_sectioncommune);
      return NextResponse.json({ message: "Commune not found." }, { status: 404 });
    }
    console.log(commune)
    const departement = await Departement.findOne({ where: { id_departement: commune.id_departement } });
    if (!departement) {
      console.error("Departement not found for Commune:", commune.id_commune);
      return NextResponse.json({ message: "Departement not found." }, { status: 404 });
    }
    console.log(departement)
    const pays = await Pays.findOne({ where: { id_pays: departement.id_pays } });
    if (!pays) {
      console.error("Pays not found for Departement:", departement.id_departement);
      return NextResponse.json({ message: "Pays not found." }, { status: 404 });
    }

    console.log(pays)

    // Generate unicité key
    const cle_unicite_base = `${pays.code_pays}${departement.code_departement}${code_postal}${numero_rue || 'X'}${libelle.charAt(0).toUpperCase()}${libelle.replace(/[aeiouAEIOU\s]/g, '').toUpperCase()}`;

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

    await adr.update({
      numero_rue,
      libelle,
      cle_unicite,
      statut,
      id_sectioncommune,

    });

    return NextResponse.json({ success: true, data: adr.toJSON() }, { status: 200 });
  } catch (error: any) {
    console.error("Server error:", error);
    return NextResponse.json({ message: "Erreur lors de la mise à jour de l'adresse", error: error.message }, { status: 500 });
  }
}

