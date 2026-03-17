"use client";

import {useEffect, useState} from "react";
import getUser from "@/server/auth/getUser";

type User = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  phone?: string | null;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
  };
};

export default function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      try {
        const session = await getUser();
        if (!mounted) return;
        setUser(session?.data?.user ?? null);
        setUser(prev => ({...prev, phone: session?.data?.user.user_metadata.phone}))
      } catch (e) {
        if (!mounted) return;
        setError("No se pudo cargar el usuario");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  return {user, loading, error};
}
