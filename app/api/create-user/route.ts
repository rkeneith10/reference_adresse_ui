import { testAndSendMail } from "@/lib/sendMail";
import { hash } from "bcryptjs";
import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import User from "../models/userModel";

export async function POST(req: NextRequest) {
  try {
    const { name, email, role } = await req.json();

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return NextResponse.json(
        { message: "L'utilisateur existe déjà." },
        { status: 400 }
      );
    }

    const password = randomBytes(8).toString("hex");
    const hashedPassword = await hash(password, 10);

    const user = await User.create({
      name,
      email,
      role,
      password: hashedPassword,
    });

    const result = await testAndSendMail({
      to: email,
      subject: "Bienvenue sur notre plateforme",
      text: `Bonjour ${name},\n\nVotre compte a été créé. Voici votre mot de passe temporaire : ${password}\n\nVeuillez le modifier dès votre première connexion.`,
    });
    console.log("Résultat de l'envoi d'email :", result);

    return NextResponse.json({  message: "Utilisateur créé",
      emailText: `Bonjour ${name},\n\nVotre compte a été créé. Voici votre mot de passe temporaire : ${password}\n\nVeuillez le modifier dès votre première connexion.`
  }, { status: 201 });
  } catch (error) {
    console.error("Erreur création utilisateur:", error);
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la création." },
      { status: 500 }
    );
  }
}
