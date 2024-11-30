import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig({
	plugins: [vue(), vueDevTools()],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	server: {
		proxy: {
			"/socket": {
				target: "ws://localhost:8081",
				ws: true,
			},
			"/api": "http://localhost:8081",
		},
	},
	css: {
		preprocessorOptions: {
			scss: {
				api: "modern-compiler", // or 'modern'
			},
		},
	},
});
