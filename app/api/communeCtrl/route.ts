import { NextRequest, NextResponse } from "next/server";
import Commune from "../models/communeModel";

export async function GET() {
  try {
    const commune = await Commune.findAll({})
    if (commune) {
      return NextResponse.json({ data: commune }, { status: 200 })
    }
  } catch (error: any) {
    console.error(error)
  }
}

export async function POST(req: NextRequest) {

  try {
    const { libelle, id_departement, longitude, lattitude, code_postal } = await req.json();

    const existingCommune = await Commune.findOne({ where: { libelle } })

    if (existingCommune) {
      return NextResponse.json(
        { message: "Cette commune existe déjà." },
        { status: 400 }
      );
    }
    const newCommune = await Commune.create({
      id_departement,
      libelle,
      longitude,
      lattitude,
      code_postal


    })
    return NextResponse.json(
      {
        success: true,
        data: newCommune,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Erreur lors de la création du departement",
        error: error.message,
      },
      { status: 500 }
    );
  }
}