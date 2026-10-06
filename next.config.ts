import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The Leonie Dubuc case study shipped as "Vox" first. Keep old links
  // (shared URLs, search results) landing on the renamed page.
  async redirects() {
    return [
      {
        source: "/work/vox",
        destination: "/work/leonie-dubuc",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
