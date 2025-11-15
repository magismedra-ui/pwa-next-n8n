"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function parseToken(token: string | null) {
  if (!token) return null;
  try {
    const [, payloadB64] = token.split(".");
    return JSON.parse(atob(payloadB64));
  } catch {
    return null;
  }
}

export default function useAuth(redirectIfInvalid = false) {
  const router = useRouter();
  const [payload, setPayload] = useState<any | null>(null);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const p = parseToken(token);
    const now = Math.floor(Date.now() / 1000);

    if (!p || (p.exp && p.exp < now)) {
      setValid(false);
      setPayload(null);
      if (redirectIfInvalid) router.replace("/");
      return;
    }
    setValid(true);
    setPayload(p);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/");
    setValid(false);
    setPayload(null);
  };

  return { valid, payload, logout };
}
