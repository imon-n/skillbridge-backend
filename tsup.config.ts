import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"],
  platform: "node",
  target: "node20",
  outDir: "dist",
  external: [
    "pg-native",
    /^@prisma\/.*/,
    /^.*\/generated\/.*$/,
  ],
  noExternal: [],
  esbuildOptions(options) {
    options.external = [
      ...(options.external || []),
      "**/generated/**",
      "@prisma/client-runtime-utils",
    ];
  },
});