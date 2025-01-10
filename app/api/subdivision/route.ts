import { NextRequest, NextResponse } from "next/server";
import Adresse from "../models/adresseModel";
import Commune from "../models/communeModel";
import Departement from "../models/departementModel";
import Country from '../models/paysModel';

export async function GET(req: NextRequest) {
  try {
    const pays = await Country.findAll({
      include: {
        model: Departement,
        include: [{
          model: Commune,
          include:[{
            model:Adresse
          }]

        }]

      },
    })
    return NextResponse.json(pays, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la recuperation des donnees" }, { status: 400 })
  }

}