/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    unoptimized: process.env.NEXT_IMAGE_UNOPTIMIZED !== "false",
  },
}

export default nextConfig
