import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import remarkGfm from "remark-gfm";
import mdx from "@mdx-js/rollup";
import rehypePrism from 'rehype-prism-plus'

export default defineConfig({
  plugins: [
    tailwindcss(),
    mdx({
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypePrism],
    }),
    reactRouter(),
    tsconfigPaths(),
  ],
});
