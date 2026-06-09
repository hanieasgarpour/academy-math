import type { NextConfig } from "next";

const isDeploy = process.env.DEPLOY === "1";

const nextConfig: NextConfig = {
  ...(isDeploy && { output: "export", basePath: "/academy-math" }),
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
