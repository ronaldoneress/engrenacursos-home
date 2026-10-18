import type { NextConfig } from "next";

const CERTIFICADOS_BACKEND = "http://engrena-certificado-app:3021";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/consultar",
        destination: `${CERTIFICADOS_BACKEND}/api/consultar`,
      },
      {
        source: "/api/certificados/preview",
        destination: `${CERTIFICADOS_BACKEND}/api/certificados/preview`,
      },
      {
        source: "/api/carteirinhas/preview",
        destination: `${CERTIFICADOS_BACKEND}/api/carteirinhas/preview`,
      },
      {
        source: "/api/certificados/:codigo/pdf",
        destination: `${CERTIFICADOS_BACKEND}/api/certificados/:codigo/pdf`,
      },
      {
        source: "/api/certificados/:codigo/carteirinha/pdf",
        destination: `${CERTIFICADOS_BACKEND}/api/certificados/:codigo/carteirinha/pdf`,
      },
    ];
  },
};

export default nextConfig;
