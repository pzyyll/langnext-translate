import IconsResolver from 'unplugin-icons/resolver';
import UnpluginViteComponents from 'unplugin-vue-components/vite';
import Icons from 'unplugin-icons/vite';
import path from 'path';
import * as cheerio from 'cheerio';
import tailwindcss from '@tailwindcss/vite';

// loader helpers
import { FileSystemIconLoader } from 'unplugin-icons/loaders';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	ssr: false,

	// nitro: {
	//   preset: "static",
	// },
	srcDir: 'src-renderer',

	modules: [
		'unplugin-icons/nuxt',
		'@pinia/nuxt',
		'@nuxt/fonts',
		'@vueuse/nuxt',
		'@nuxtjs/i18n',
		'@formkit/auto-animate/nuxt',
		'reka-ui/nuxt'
	],
	css: ['~/assets/css/main.css'],
	i18n: {
		locales: [
			{
				code: 'en',
				name: 'English',
				file: 'en.json'
			},
			{
				code: 'zh',
				name: '简体中文',
				file: 'zh.json'
			}
		],
		defaultLocale: 'zh',
		restructureDir: 'src-renderer/i18n',
		strategy: 'no_prefix'
		// detectBrowserLanguage: {
		// 	useCookie: true,
		// 	cookieCrossOrigin: false,
		// 	fallbackLocale: 'en'
		// }
	},

	vite: {
		build: {
			ssr: false,
			chunkSizeWarningLimit: 1024
			// rollupOptions: {
			//   output: {
			//     manualChunks(id) {
			//       if (id.includes("node_modules/")) {
			//         const splits = id.toString().split("node_modules/").at(-1)?.split("/");
			//         console.log(`Chunking ${splits}`);
			//         const name = splits?.at(0);
			//         console.log(`Chunking ${name}`);
			//         return name;
			//       }
			//     },
			//   },
			// },
		},
		clearScreen: false,
		// Enable environment variables
		// Additional environment variables can be found at
		// https://tauri.app/2/reference/environment-variables/
		// envPrefix: ["VITE_", "TAURI_"],
		server: {
			watch: {
				ignored: ['**/src-tauri/**']
			}
		},
		plugins: [
			UnpluginViteComponents({
				resolvers: [
					IconsResolver({
						prefix: 'icon',
						customCollections: ['svgs']
					})
				]
			}),
			Icons({
				autoInstall: true,
				compiler: 'vue3',
				customCollections: {
					svgs: FileSystemIconLoader(
						path.resolve(__dirname, 'src-renderer/assets/icons'),
						(svg) => {
							// Replace fill attribute with currentColor if exists, sets it if it doesn't.
							// and delete width and height attributes if they exist.
							const $ = cheerio.load(svg, { xmlMode: true });
							const $svg = $('svg');
							$svg.attr('fill', 'currentColor');
							$svg.removeAttr('width');
							$svg.removeAttr('height');
							return $.xml($svg);
						}
					)
				},
				iconCustomizer(collection, icon, props) {
					if (collection === 'svgs') {
						props.width = '1.5em';
						props.height = '1.5em';
					}
				}
			}),
			tailwindcss()
		]
	},
	devServer: {
		port: 1234
	},

	$development: {
		devtools: {
			enabled: true
		}
	},
	app: {
		pageTransition: { name: 'page', mode: 'out-in' }
	},
	compatibilityDate: '2025-03-12'
});
