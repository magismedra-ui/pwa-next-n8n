import withPWA from "next-pwa";

const isDev = process.env.NODE_ENV === "development";

const config = {
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: isDev, // desactiva PWA en modo dev
};

export default withPWA(config)({
  reactStrictMode: true,
  images: { unoptimized: true },
});
