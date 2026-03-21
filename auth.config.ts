import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      
      const isPublicRoute = 
        nextUrl.pathname.startsWith("/login") || 
        nextUrl.pathname.startsWith("/register") || 
        nextUrl.pathname.startsWith("/forgot-password") || 
        nextUrl.pathname.startsWith("/reset-password");

      // Pokud je uživatel přihlášen a jde na veřejnou routu (login/register), hoď ho na home
      if (isPublicRoute) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/", nextUrl));
        }
        return true;
      }

      // Pokud není přihlášen a nejde na veřejnou routu, middleware ho hodí na /login
      return isLoggedIn;
    },
  },
  providers: [], 
} satisfies NextAuthConfig;
