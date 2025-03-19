import { NextRequest, NextResponse } from 'next/server';
import { Op } from 'sequelize';
import Adresse from '../../models/adresseModel';
import Commune from '../../models/communeModel';
import Departement from '../../models/departementModel';
import { default as Country, default as Pays } from '../../models/paysModel';


// Handler for GET request
export async function GET(
  req: NextRequest,
  { params }: { params: { id_adresses: number } }
) {
  try {
    const { id_adresses } = params;

    if (!id_adresses) {
      return NextResponse.json({ error: "Invalid Id" }, { status: 400 });
    }

    const detailAdresse = await Adresse.findOne({
      where: { id_adresses },
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
    });

    if (!detailAdresse) {
      return NextResponse.json({ error: "Adresse introuvable" }, { status: 404 });
    }


    const responseData = {
      id_adresses: detailAdresse.id_adresses,
      libelle_adresse: detailAdresse.libelle_adresse,
      numero_rue: detailAdresse.numero_rue,
      code_postal: detailAdresse.code_postal,
      cle_unicite: detailAdresse.cle_unicite,
      statut: detailAdresse.statut,
      section_communale: detailAdresse.section_communale,
      // id_commune: detailAdresse.id_commune,
      commune: {
        libelle_commune: detailAdresse.Commune.libelle_commune,
        id_commune: detailAdresse.Commune.id_commune,
        departement: {
          libelle_departement: detailAdresse.Commune.Departement.libelle_departement,
          id_departement: detailAdresse.Commune.Departement.id_departement,
          country: {
            libelle_pays: detailAdresse.Commune.Departement.Country.libelle_pays,
            id_pays: detailAdresse.Commune.Departement.Country.id_pays,
          },
        },
      },
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des détails de l'adresse" },
      { status: 500 }
    );
  }
}

// Handler for DELETE request
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id_adresses: number } }
) {
  try {
    const { id_adresses } = params;

    if (!id_adresses) {
      return NextResponse.json({ error: "Invalid Id" }, { status: 400 });
    }

    const adresse = await Adresse.findOne({ where: { id_adresses } });
    if (!adresse) {
      return NextResponse.json(
        { message: "L'adresse n'existe pas." },
        { status: 404 }
      );
    }


    await Adresse.destroy({ where: { id_adresses } });
    return NextResponse.json(
      { message: "L'adresse a été supprimé avec succès." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Erreur lors de la suppression du de l'adresse",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id_adresses: string } }) {
  try {
    const id_adresses = parseInt(params.id_adresses, 10);
    if (isNaN(id_adresses)) {
      return NextResponse.json({ message: "L'identifiant de l'adresse est invalide." }, { status: 400 });
    }

    const body = await req.json();
    const { libelle_adresse, numero_rue, code_postal, id_commune, section_communale, statut, from } = body;

    // Vérifier si l'adresse existe
    const adr = await Adresse.findOne({ where: { id_adresses } });
    if (!adr) {
      return NextResponse.json({ message: "Adresse non trouvée." }, { status: 404 });
    }

    // Vérifier si la commune existe
    const commune = await Commune.findOne({ where: { id_commune } });
    if (!commune) {
      return NextResponse.json({ message: "Commune non trouvée." }, { status: 404 });
    }

    // Vérifier le département
    const departement = await Departement.findOne({ where: { id_departement: commune.id_departement } });
    if (!departement) {
      return NextResponse.json({ message: "Département non trouvé." }, { status: 404 });
    }

    // Vérifier le pays
    const pays = await Pays.findOne({ where: { id_pays: departement.id_pays } });
    if (!pays) {
      return NextResponse.json({ message: "Pays non trouvé." }, { status: 404 });
    }

    // Générer une nouvelle clé d'unicité
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
      const highestSequence = Math.max(
        ...similarKeys.map((key) => parseInt(key.cle_unicite.slice(-2), 10))
      );
      sequence = (highestSequence + 1).toString().padStart(2, '0');
    }

    const cle_unicite = `${cle_unicite_base}${sequence}`;

    // Mise à jour de l'adresse
    await adr.update({
      libelle_adresse,
      numero_rue,
      code_postal,
      id_commune,
      section_communale,
      cle_unicite,
      statut,
      from
    });

    return NextResponse.json({ success: true, data: adr.toJSON() }, { status: 200 });

  } catch (error: any) {
    console.error("Erreur lors de la mise à jour de l'adresse:", error);
    return NextResponse.json({
      message: "Erreur lors de la mise à jour de l'adresse",
      error: error.message,
    }, { status: 500 });
  }
}






