
// Assurez-vous d'importer les bons modules nécessaires
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";

// Fonction asynchrone pour protéger la route
export async function protectRoute() {
  const router = useRouter();
  const session = await getSession();

  if (!session) {
    router.push("/"); // Rediriger vers la page d'accueil si la session n'est pas active
  }

  return session; // Retourner la session si elle est active
}
