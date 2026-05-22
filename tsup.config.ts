import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"],
  platform: "node",
  target: "node20",
  outDir: "dist",
  noExternal: [],
  esbuildOptions(options) {
    options.external = [
      ...(options.external || []),
      "@prisma/client-runtime-utils",
      "@prisma/client",
      "@prisma/adapter-pg",
      "pg-native",
      "generated",
    ];
  },
});