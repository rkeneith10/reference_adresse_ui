import { NextRequest, NextResponse } from 'next/server';
import { Op } from 'sequelize';
import Adresse from '../../models/adresseModel';
import Commune from '../../models/communeModel';
import Departement from '../../models/departementModel';
import Pays from '../../models/paysModel';
import SectionCommunale from '../../models/sectionCommunalModel';
import Ville from "../../models/villeModel";

export async function POST(req: NextRequest) {
  try {
    const {
      id_adresses,
      libelle_adresse,
      numero_rue,
      code_postal,
      id_commune,
      section_communale,
      villeRecord,
      statut,
    } = await req.json();

    const adr = await Adresse.findOne({ where: { id_adresses } });
    if (!adr) {
      return NextResponse.json({ message: "Adresse not found" }, { status: 404 });
    }

    let cle_unicite_base;
    let cle_unicite;

    // Cas avec `villeRecord`
    if (villeRecord) {
      cle_unicite_base = `${(villeRecord || '').replace(/\s+/g, '').toUpperCase()}${(section_communale || '').replace(/[aeiouAEIOU\s]/g, '').toUpperCase()}${numero_rue || 'X'}${(libelle_adresse || '')
      .charAt(0)
      .toUpperCase()}${(libelle_adresse || '').replace(/[aeiouAEIOU\s]/g, '').toUpperCase()}`;
    
    

      const similarKeys = await Adresse.findAll({
        where: {
          cle_unicite: {
            [Op.like]: `${cle_unicite_base}%`,
          },
        },
      });

      let sequence = '01';
      if (similarKeys.length > 0) {
        const highestSequence = Math.max(
          ...similarKeys.map((key) => parseInt(key.cle_unicite.slice(-2)))
        );
        sequence = (highestSequence + 1).toString().padStart(2, '0');
      }

      cle_unicite = `${cle_unicite_base}${sequence}`;

      await adr.update({
        libelle_adresse,
        numero_rue,
        section_communale,
        code_postal,
        villeRecord,
        cle_unicite,
        statut,
      });

      return NextResponse.json({ success: true, data: adr.toJSON() }, { status: 200 });
    }

    // Cas avec `id_sectioncommunale`
    if (id_commune) {
      const commune = await Commune.findOne({ where: { id_commune} });
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

      cle_unicite_base = `${pays.code_pays}${departement.code_departement}${code_postal}${numero_rue || 'X'}${libelle_adresse
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
        const highestSequence = Math.max(
          ...similarKeys.map((key) => parseInt(key.cle_unicite.slice(-2)))
        );
        sequence = (highestSequence + 1).toString().padStart(2, '0');
      }

      cle_unicite = `${cle_unicite_base}${sequence}`;

      await adr.update({
        libelle_adresse,
        numero_rue,
        code_postal,
        id_commune,
        section_communale,
        cle_unicite,
        statut,
      });

      return NextResponse.json({ success: true, data: adr.toJSON() }, { status: 200 });
    }

    return NextResponse.json(
      { message: "You must provide either 'id_commune' or 'villeRecord'." },
      { status: 400 }
    );
  } catch (error:any) {
    console.error(error);
    return NextResponse.json({
      message: "Erreur lors de la mise à jour de l'adresse",
      error: error.message,
    }, { status: 500 });
  }
}
