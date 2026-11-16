import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [devtools(), tailwindcss(), tanstackStart(), viteReact()],
  build: {
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/@geothai/core")) {
            return "vendor-geothai";
          }
          if (
            id.includes("node_modules/react-day-picker") ||
            id.includes("node_modules/date-fns")
          ) {
            return "vendor-datepicker";
          }
          return undefined;
        },
      },
    },
  },
});

export default config;
