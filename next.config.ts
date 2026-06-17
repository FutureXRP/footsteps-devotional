import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The church-history devotional moved from the site root to /footsteps when
  // the site became a multi-series library. Preserve the old links.
  async redirects() {
    return [
      { source: "/entry/:day", destination: "/footsteps/entry/:day", permanent: true },
      { source: "/journey", destination: "/footsteps/journey", permanent: true },
      { source: "/bookmarks", destination: "/footsteps/bookmarks", permanent: true },
    ];
  },
};

export default nextConfig;
