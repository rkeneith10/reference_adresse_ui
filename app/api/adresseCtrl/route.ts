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
    // Extraction et validation des données de la requête
    const { numero_rue, libelle_adresse, statut, id_sectioncommunale, code_postal } = await req.json();

    // Validation de base sur les entrées (à renforcer selon les besoins)
    if (!numero_rue || !libelle_adresse || !statut || !id_sectioncommunale || !code_postal) {
      return NextResponse.json({ message: "Invalid input data." }, { status: 400 });
    }

    // Récupérer la section communale
    const sectionCommunale = await SectionCommune.findOne({
      where: { id_sectioncommunale }
    });

    // Vérification de l'existence de la section communale
    if (!sectionCommunale) {
      return NextResponse.json({ message: "Section Communale not found." }, { status: 404 });
    }

    // Utilisation des relations définies entre les modèles pour réduire les requêtes
    const ville = await Ville.findOne({
      where: { id_ville: sectionCommunale.id_ville },
      include: [{
        model: Commune,
        include: [{
          model: Departement,
          include: [Pays]
        }]
      }]
    });

    // Vérifications des différents niveaux (Ville, Commune, Département, Pays)
    if (!ville) {
      return NextResponse.json({ message: "Ville not found." }, { status: 404 });
    }

    const commune = ville.Commune;
    if (!commune) {
      return NextResponse.json({ message: "Commune not found." }, { status: 404 });
    }

    const departement = commune.Departement;
    if (!departement) {
      return NextResponse.json({ message: "Departement not found." }, { status: 404 });
    }

    const pays = departement.Pays;
    if (!pays) {
      return NextResponse.json({ message: "Pays not found." }, { status: 404 });
    }

    // Génération de la clé d'unicité
    const cle_unicite_base = `${pays.code_pays}${departement.code_departement}${code_postal}${numero_rue || 'X'}${libelle_adresse.charAt(0).toUpperCase()}${libelle_adresse.replace(/[aeiouAEIOU\s]/g, '').toUpperCase()}`;

    // Recherche des clés similaires pour générer la séquence
    const highestSequenceKey = await Adresse.findOne({
      where: { cle_unicite: { [Op.like]: `${cle_unicite_base}%` } },
      order: [['cle_unicite', 'DESC']]
    });

    let sequence = '01';
    if (highestSequenceKey) {
      const highestSequence = parseInt(highestSequenceKey.cle_unicite.slice(-2));
      sequence = (highestSequence + 1).toString().padStart(2, '0');
    }

    const cle_unicite = `${cle_unicite_base}${sequence}`;

    // Création de la nouvelle adresse
    const newAddress = await Adresse.create({
      numero_rue,
      libelle_adresse,
      cle_unicite,
      statut,
      code_postal,
      id_sectioncommunale
    });

    // Réponse en cas de succès
    return NextResponse.json({
      success: true,
      data: newAddress,
    }, { status: 200 });
  } catch (error: any) {
    // Gestion des erreurs génériques
    console.error(error);
    return NextResponse.json({
      message: "Erreur lors de la création de l'adresse",
      error: error.message,
    }, { status: 500 });
  }
}
