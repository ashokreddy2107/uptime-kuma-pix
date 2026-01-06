import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import visualizer from "rollup-plugin-visualizer";
import viteCompression from "vite-plugin-compression";
import { VitePWA } from "vite-plugin-pwa";

// We use require for these as they are likely CommonJS modules in your environment
const postCssScss = require("postcss-scss");
const postcssRTLCSS = require("postcss-rtlcss");

const viteCompressionFilter = /\.(js|mjs|json|css|html|svg)$/i;

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 3000,
        allowedHosts: [
            'ashok-c.pixelvide.cloud'
        ]
    },
    define: {
        "FRONTEND_VERSION": JSON.stringify(process.env.npm_package_version),
        "process.env": {},
    },
    plugins: [
        vue(),
        visualizer({
            filename: "tmp/dist-stats.html"
        }),
        viteCompression({
            algorithm: "gzip",
            filter: viteCompressionFilter,
        }),
        viteCompression({
            algorithm: "brotliCompress",
            filter: viteCompressionFilter,
        }),
        VitePWA({
            registerType: null,
            srcDir: "src",
            filename: "serviceWorker.ts",
            strategies: "injectManifest",
        }),
    ],
    css: {
        preprocessorOptions: {
            scss: {
                // This tells Sass to look in node_modules for @import statements
                loadPaths: ["node_modules"],
                // This silences the "legacy API" warning and uses the modern compiler logic
                api: 'modern-compiler' 
            },
        },
        postcss: {
            "parser": postCssScss,
            "map": false,
            "plugins": [ postcssRTLCSS ]
        }
    },
    build: {
        commonjsOptions: {
            include: [ /.js$/ ],
        },
        rollupOptions: {
            output: {
                manualChunks(id) {
                    // Custom chunking logic can go here if needed
                }
            }
        },
    }
});
