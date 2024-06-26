import bcrypt from "bcryptjs"; // Assurez-vous d'avoir installé bcryptjs
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../models/userModel";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        
      },
      async authorize(credentials, req) {
        const { email, password } = credentials;

        try {
          console.log("Recherche de l'utilisateur avec l'email :", email);
          const user = await User.findOne({ where: { email } });

          if (!user) {
            console.log("Utilisateur non trouvé");
            return null;
          }

          console.log("Utilisateur trouvé :", user);

          const isValidPassword = bcrypt.compareSync(password, user.password);
          console.log("Mot de passe valide :", isValidPassword);

          if (isValidPassword) {
            const customUser = {
              id: user.id,
              name: user.name,
              email: user.email,
            };
            return customUser;
          } else {
            console.log("Mot de passe incorrect");
            return null;
          }
        } catch (error) {
          console.error("Erreur lors de la sélection de l'utilisateur:", error);
          throw error;
        }
      },
    }),
  ],

  callbacks: {
    async session(session, user) {
      session.user = user;
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 86400,
  },

  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/page.tsx",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
