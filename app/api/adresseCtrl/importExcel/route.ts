import { NextRequest, NextResponse } from 'next/server';
import Adresse, { AdresseAttributes } from '../../models/adresseModel';

export async function POST(req: NextRequest) {
  try {
    // Parse the request body as JSON
    const body = await req.json();

    // Ensure the parsed body is an array
    if (!Array.isArray(body)) {
      throw new Error("Request body must be an array of addresses");
    }

    const adresses = body as AdresseAttributes[];

    // Log the received addresses
    console.log("Received addresses:", adresses);

    // Map and validate addresses
    const validAdresses = adresses.map((adresse: AdresseAttributes) => ({
      numero_rue: adresse.numero_rue,
      libelle: adresse.libelle,
      cle_unicite: adresse.cle_unicite,
      statut: adresse.statut,
      id_sectioncommune: adresse.id_sectioncommune,
    }));

    // Log the valid addresses before saving
    console.log("Valid addresses to be saved:", validAdresses);

    // Bulk create addresses, ignoring duplicates
    const createdAdresses = await Adresse.bulkCreate(validAdresses, {
      ignoreDuplicates: true,
    });

    // Log the result of the bulkCreate operation
    console.log("Created addresses:", createdAdresses);

    // Return a successful response
    return NextResponse.json({ success: true, data: createdAdresses }, { status: 200 });
  } catch (error: any) {
    console.error("Erreur dans l'API d'importation des adresses :", error);

    // Return an error response
    return NextResponse.json({
      message: "Erreur lors de l'importation des adresses",
      error: error.message,
    }, { status: 500 });
  }
}
