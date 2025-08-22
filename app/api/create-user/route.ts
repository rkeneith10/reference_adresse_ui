import { testAndSendMail } from "@/lib/sendMail";
import { hash } from "bcryptjs";
import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import User from "../models/userModel";

export async function POST(req: NextRequest) {
  try {
    const { name, email, role } = await req.json();
    console.log("Données reçues :", { name, email, role });

    // Validation des champs
    if (!name || !email) {
      return NextResponse.json(
        { message: "Les champs 'name' et 'email' sont obligatoires." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Vérification de l'existence de l'utilisateur
    const existingUser = await User.findOne({ where: { email: normalizedEmail } });
    if (existingUser) {
      return NextResponse.json(
        { message: "L'utilisateur existe déjà." },
        { status: 400 }
      );
    }

    // Génération du mot de passe
    const password = randomBytes(8).toString("hex");
    const hashedPassword = await hash(password, 10);

    // Création de l'utilisateur
    const user = await User.create({
      name,
      email: normalizedEmail,
      role: role || "user", // Utilisation de la valeur par défaut si role n'est pas fourni
      password: hashedPassword,
      status: 0,
    });

    // Envoi de l'email
    const result = await testAndSendMail({
      to: email,
      subject: "Bienvenue sur notre plateforme",
      text: `Bonjour ${name},\n\nVotre compte a été créé. Voici votre mot de passe temporaire : ${password}\n\nVeuillez le modifier dès votre première connexion.`,
    });
    console.log("Résultat de l'envoi d'email :", result);

    return NextResponse.json(
      {
        message: "Utilisateur créé",
        emailText: `Bonjour ${name},\n\nVotre compte a été créé. Voici votre mot de passe temporaire : ${password}\n\nVeuillez le modifier dès votre première connexion.`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erreur création utilisateur:", error);
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