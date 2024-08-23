import { NextRequest, NextResponse } from "next/server";
import Ville from "../models/villeModel";

export async function GET() {
  try {
    const ville = await Ville.findAll({})
    if (ville) {
      return NextResponse.json({ data: ville }, { status: 200 })
    }
  } catch (error: any) {
    console.error(error)
  }
}

export async function POST(req: NextRequest) {

  try {
    const { libelle_ville, id_commune, longitude, lattitude, } = await req.json();

    const existingVille = await Ville.findOne({ where: { libelle_ville } })

    if (existingVille) {
      return NextResponse.json(
        { message: "Cette ville existe déjà." },
        { status: 400 }
      );
    }
    const newVille = await Ville.create({
      id_commune,
      libelle_ville,
      longitude,
      lattitude


    })
    return NextResponse.json(
      {
        success: true,
        data: newVille,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Erreur lors de la création de la ville",
        error: error.message,
      },
      { status: 500 }
    );
  }
}