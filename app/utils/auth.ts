export function isTokenValid() {
  const token = localStorage.getItem("token");

  if (!token) {
    return { valid: false, payload: null };
  }

  try {
    const [, payloadBase64] = token.split(".");
    const payload = JSON.parse(atob(payloadBase64));

    const now = Math.floor(Date.now() / 1000);

     if (payload.exp && payload.exp < now) {
      return { valid: false, payload: null };
    }

    return { valid: true, payload };
  } catch (err) {
    return { valid: false, payload: null };
  }
}
