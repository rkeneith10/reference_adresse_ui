import { compare, hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import User from "../models/userModel";

export async function POST(req: NextRequest) {
  try {
    // Lire et valider les données de la requête
    const { email, oldPassword, newPassword } = await req.json();
    console.log("Données reçues :", { email, oldPassword, newPassword });

    if (!email || !oldPassword || !newPassword) {
      return NextResponse.json(
        { message: "Les champs 'email', 'oldPassword' et 'newPassword' sont obligatoires." },
        { status: 400 }
      );
    }

    // Normaliser l'email
    const normalizedEmail = email.trim().toLowerCase();

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ where: { email: normalizedEmail } });
    if (!user) {
      return NextResponse.json({ message: "Utilisateur introuvable" }, { status: 404 });
    }

    // Vérifier l'ancien mot de passe
    const isMatch = await compare(oldPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Mot de passe incorrect" }, { status: 400 });
    }

    // Hacher le nouveau mot de passe
    const hashed = await hash(newPassword, 10);

    // Mettre à jour l'utilisateur
    user.password = hashed;
    user.status = 1;
    await user.save();

    return NextResponse.json({ message: "Mot de passe changé avec succès" }, { status: 200 });
  } catch (error: any) {
    console.error("Erreur lors du changement de mot de passe:", error);
    return NextResponse.json(
      {
        message: "Erreur interne",
        error: error.message,
        details: error.errors ? error.errors.map((e: any) => e.message) : error,
      },
      { status: 500 }
    );
  }
}