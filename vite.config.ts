import { defineConfig } from "vite";
import svelte from '@sveltejs/vite-plugin-svelte';
import path from "path";

const rendererPath = path.resolve(__dirname, "./src/renderer");
const outDirRenderer = path.resolve(__dirname, "./app/renderer");

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [svelte({ configFile: './../../svelte.config.cjs' })],
	base: "./",
	root: rendererPath,
	build: {
		outDir: outDirRenderer,
		emptyOutDir: true,
	},
	resolve: {
		alias: [
			{
				find: "@renderer",
				replacement: path.resolve(__dirname, "src/renderer"),
			},
			{
				find: "@common",
				replacement: path.resolve(__dirname, "src/common"),
			},
			{
				find: "@lib",
				replacement: path.resolve(__dirname, "src/renderer/lib"),
			},
		],
	},
});
