import { NextRequest, NextResponse } from "next/server";
import SectionCommunale from "../models/sectionCommunalModel";

export async function GET() {
  try {
    const sectioncommunale = await SectionCommunale.findAll({})
    if (sectioncommunale) {
      return NextResponse.json({ data: sectioncommunale }, { status: 200 })
    }
  } catch (error: any) {
    console.error(error)
  }
}

export async function POST(req: NextRequest) {

  try {
    const { libelle, id_ville } = await req.json();

    const existingSectionommunal = await SectionCommunale.findOne({ where: { libelle } })

    if (existingSectionommunal) {
      return NextResponse.json(
        { message: "Cette section communale existe déjà." },
        { status: 400 }
      );
    }
    const newSectionCommunale = await SectionCommunale.create({
      id_ville,
      libelle
    })
    return NextResponse.json(
      {
        success: true,
        data: newSectionCommunale,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Erreur lors de la création de la section communale",
        error: error.message,
      },
      { status: 500 }
    );
  }
}