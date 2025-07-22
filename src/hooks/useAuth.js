'use client';
import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";

export function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error("Erro ao decodificar o token:", err);
      }
    }
  }, []);

  return { user };
}
