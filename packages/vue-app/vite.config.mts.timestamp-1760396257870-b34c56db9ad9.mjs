// vite.config.mts
import AutoImport from "file:///home/artur-nerkowski/Projekty/monorepo-example/.yarn/__virtual__/unplugin-auto-import-virtual-5dad02b52c/0/cache/unplugin-auto-import-npm-20.2.0-5e9329ee1c-e767a32b0d.zip/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///home/artur-nerkowski/Projekty/monorepo-example/.yarn/__virtual__/unplugin-vue-components-virtual-da377990a8/0/cache/unplugin-vue-components-npm-29.1.0-8cc679e11d-fbc1ae4f45.zip/node_modules/unplugin-vue-components/dist/vite.js";
import Fonts from "file:///home/artur-nerkowski/Projekty/monorepo-example/.yarn/__virtual__/unplugin-fonts-virtual-beb9f784aa/0/cache/unplugin-fonts-npm-1.4.0-3989c4b7f0-4057028967.zip/node_modules/unplugin-fonts/dist/vite.mjs";
import Layouts from "file:///home/artur-nerkowski/Projekty/monorepo-example/.yarn/__virtual__/vite-plugin-vue-layouts-next-virtual-06577d59d8/0/cache/vite-plugin-vue-layouts-next-npm-1.0.0-745f9e4468-cd5c13b497.zip/node_modules/vite-plugin-vue-layouts-next/dist/index.js";
import Vue from "file:///home/artur-nerkowski/Projekty/monorepo-example/.yarn/__virtual__/@vitejs-plugin-vue-virtual-143cad8440/0/cache/@vitejs-plugin-vue-npm-6.0.1-c0994bf42d-6d11fa9637.zip/node_modules/@vitejs/plugin-vue/dist/index.js";
import VueRouter from "file:///home/artur-nerkowski/Projekty/monorepo-example/.yarn/__virtual__/unplugin-vue-router-virtual-5da2e73a3d/0/cache/unplugin-vue-router-npm-0.15.0-3553b12b9d-9efa96e041.zip/node_modules/unplugin-vue-router/dist/vite.js";
import { VueRouterAutoImports } from "file:///home/artur-nerkowski/Projekty/monorepo-example/.yarn/__virtual__/unplugin-vue-router-virtual-5da2e73a3d/0/cache/unplugin-vue-router-npm-0.15.0-3553b12b9d-9efa96e041.zip/node_modules/unplugin-vue-router/dist/index.js";
import Vuetify, { transformAssetUrls } from "file:///home/artur-nerkowski/Projekty/monorepo-example/.yarn/__virtual__/vite-plugin-vuetify-virtual-b8a8b55aed/0/cache/vite-plugin-vuetify-npm-2.1.2-c22f4b501d-bfcf04de38.zip/node_modules/vite-plugin-vuetify/dist/index.mjs";
import { defineConfig } from "file:///home/artur-nerkowski/Projekty/monorepo-example/.yarn/__virtual__/vite-virtual-afa9c15001/0/cache/vite-npm-7.1.9-ede47768b4-f628f903a1.zip/node_modules/vite/dist/node/index.js";
import { fileURLToPath, URL } from "node:url";
var __vite_injected_original_import_meta_url = "file:///home/artur-nerkowski/Projekty/monorepo-example/packages/vue-app/vite.config.mts";
var vite_config_default = defineConfig({
  plugins: [
    VueRouter({
      dts: "src/typed-router.d.ts"
    }),
    Layouts(),
    AutoImport({
      imports: [
        "vue",
        VueRouterAutoImports,
        {
          pinia: ["defineStore", "storeToRefs"]
        }
      ],
      dts: "src/auto-imports.d.ts",
      eslintrc: {
        enabled: true
      },
      vueTemplate: true
    }),
    Components({
      dts: "src/components.d.ts"
    }),
    Vue({
      template: { transformAssetUrls }
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    Vuetify({
      autoImport: true,
      styles: {
        configFile: "src/styles/settings.scss"
      }
    }),
    Fonts({
      fontsource: {
        families: [
          {
            name: "Roboto",
            weights: [100, 300, 400, 500, 700, 900],
            styles: ["normal", "italic"]
          }
        ]
      }
    })
  ],
  optimizeDeps: {
    exclude: [
      "vuetify",
      "vue-router",
      "unplugin-vue-router/runtime",
      "unplugin-vue-router/data-loaders",
      "unplugin-vue-router/data-loaders/basic"
    ]
  },
  define: { "process.env": {} },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("src", __vite_injected_original_import_meta_url))
    },
    extensions: [
      ".js",
      ".json",
      ".jsx",
      ".mjs",
      ".ts",
      ".tsx",
      ".vue"
    ]
  },
  server: {
    port: 3e3
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZVJvb3QiOiAiZmlsZTovLy9ob21lL2FydHVyLW5lcmtvd3NraS9Qcm9qZWt0eS9tb25vcmVwby1leGFtcGxlL3BhY2thZ2VzL3Z1ZS1hcHAvIiwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9hcnR1ci1uZXJrb3dza2kvUHJvamVrdHkvbW9ub3JlcG8tZXhhbXBsZS9wYWNrYWdlcy92dWUtYXBwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9hcnR1ci1uZXJrb3dza2kvUHJvamVrdHkvbW9ub3JlcG8tZXhhbXBsZS9wYWNrYWdlcy92dWUtYXBwL3ZpdGUuY29uZmlnLm10c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9hcnR1ci1uZXJrb3dza2kvUHJvamVrdHkvbW9ub3JlcG8tZXhhbXBsZS9wYWNrYWdlcy92dWUtYXBwL3ZpdGUuY29uZmlnLm10c1wiOy8vIFBsdWdpbnNcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xuaW1wb3J0IEZvbnRzIGZyb20gJ3VucGx1Z2luLWZvbnRzL3ZpdGUnXG5pbXBvcnQgTGF5b3V0cyBmcm9tICd2aXRlLXBsdWdpbi12dWUtbGF5b3V0cy1uZXh0J1xuaW1wb3J0IFZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgVnVlUm91dGVyIGZyb20gJ3VucGx1Z2luLXZ1ZS1yb3V0ZXIvdml0ZSdcbmltcG9ydCB7IFZ1ZVJvdXRlckF1dG9JbXBvcnRzIH0gZnJvbSAndW5wbHVnaW4tdnVlLXJvdXRlcidcbmltcG9ydCBWdWV0aWZ5LCB7IHRyYW5zZm9ybUFzc2V0VXJscyB9IGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZXRpZnknXG5cbi8vIFV0aWxpdGllc1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIFVSTCB9IGZyb20gJ25vZGU6dXJsJ1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIFZ1ZVJvdXRlcih7XG4gICAgICBkdHM6ICdzcmMvdHlwZWQtcm91dGVyLmQudHMnLFxuICAgIH0pLFxuICAgIExheW91dHMoKSxcbiAgICBBdXRvSW1wb3J0KHtcbiAgICAgIGltcG9ydHM6IFtcbiAgICAgICAgJ3Z1ZScsXG4gICAgICAgIFZ1ZVJvdXRlckF1dG9JbXBvcnRzLFxuICAgICAgICB7XG4gICAgICAgICAgcGluaWE6IFsnZGVmaW5lU3RvcmUnLCAnc3RvcmVUb1JlZnMnXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBkdHM6ICdzcmMvYXV0by1pbXBvcnRzLmQudHMnLFxuICAgICAgZXNsaW50cmM6IHtcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICB2dWVUZW1wbGF0ZTogdHJ1ZSxcbiAgICB9KSxcbiAgICBDb21wb25lbnRzKHtcbiAgICAgIGR0czogJ3NyYy9jb21wb25lbnRzLmQudHMnLFxuICAgIH0pLFxuICAgIFZ1ZSh7XG4gICAgICB0ZW1wbGF0ZTogeyB0cmFuc2Zvcm1Bc3NldFVybHMgfSxcbiAgICB9KSxcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdnVldGlmeWpzL3Z1ZXRpZnktbG9hZGVyL3RyZWUvbWFzdGVyL3BhY2thZ2VzL3ZpdGUtcGx1Z2luI3JlYWRtZVxuICAgIFZ1ZXRpZnkoe1xuICAgICAgYXV0b0ltcG9ydDogdHJ1ZSxcbiAgICAgIHN0eWxlczoge1xuICAgICAgICBjb25maWdGaWxlOiAnc3JjL3N0eWxlcy9zZXR0aW5ncy5zY3NzJyxcbiAgICAgIH0sXG4gICAgfSksXG4gICAgRm9udHMoe1xuICAgICAgZm9udHNvdXJjZToge1xuICAgICAgICBmYW1pbGllczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdSb2JvdG8nLFxuICAgICAgICAgICAgd2VpZ2h0czogWzEwMCwgMzAwLCA0MDAsIDUwMCwgNzAwLCA5MDBdLFxuICAgICAgICAgICAgc3R5bGVzOiBbJ25vcm1hbCcsICdpdGFsaWMnXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KSxcbiAgXSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgZXhjbHVkZTogW1xuICAgICAgJ3Z1ZXRpZnknLFxuICAgICAgJ3Z1ZS1yb3V0ZXInLFxuICAgICAgJ3VucGx1Z2luLXZ1ZS1yb3V0ZXIvcnVudGltZScsXG4gICAgICAndW5wbHVnaW4tdnVlLXJvdXRlci9kYXRhLWxvYWRlcnMnLFxuICAgICAgJ3VucGx1Z2luLXZ1ZS1yb3V0ZXIvZGF0YS1sb2FkZXJzL2Jhc2ljJyxcbiAgICBdLFxuICB9LFxuICBkZWZpbmU6IHsgJ3Byb2Nlc3MuZW52Jzoge30gfSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnc3JjJywgaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgfSxcbiAgICBleHRlbnNpb25zOiBbXG4gICAgICAnLmpzJyxcbiAgICAgICcuanNvbicsXG4gICAgICAnLmpzeCcsXG4gICAgICAnLm1qcycsXG4gICAgICAnLnRzJyxcbiAgICAgICcudHN4JyxcbiAgICAgICcudnVlJyxcbiAgICBdLFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiAzMDAwLFxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFDQSxPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLFdBQVc7QUFDbEIsT0FBTyxhQUFhO0FBQ3BCLE9BQU8sU0FBUztBQUNoQixPQUFPLGVBQWU7QUFDdEIsU0FBUyw0QkFBNEI7QUFDckMsT0FBTyxXQUFXLDBCQUEwQjtBQUc1QyxTQUFTLG9CQUFvQjtBQUM3QixTQUFTLGVBQWUsV0FBVztBQVpzTSxJQUFNLDJDQUEyQztBQWUxUixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxVQUFVO0FBQUEsTUFDUixLQUFLO0FBQUEsSUFDUCxDQUFDO0FBQUEsSUFDRCxRQUFRO0FBQUEsSUFDUixXQUFXO0FBQUEsTUFDVCxTQUFTO0FBQUEsUUFDUDtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsVUFDRSxPQUFPLENBQUMsZUFBZSxhQUFhO0FBQUEsUUFDdEM7QUFBQSxNQUNGO0FBQUEsTUFDQSxLQUFLO0FBQUEsTUFDTCxVQUFVO0FBQUEsUUFDUixTQUFTO0FBQUEsTUFDWDtBQUFBLE1BQ0EsYUFBYTtBQUFBLElBQ2YsQ0FBQztBQUFBLElBQ0QsV0FBVztBQUFBLE1BQ1QsS0FBSztBQUFBLElBQ1AsQ0FBQztBQUFBLElBQ0QsSUFBSTtBQUFBLE1BQ0YsVUFBVSxFQUFFLG1CQUFtQjtBQUFBLElBQ2pDLENBQUM7QUFBQTtBQUFBLElBRUQsUUFBUTtBQUFBLE1BQ04sWUFBWTtBQUFBLE1BQ1osUUFBUTtBQUFBLFFBQ04sWUFBWTtBQUFBLE1BQ2Q7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELE1BQU07QUFBQSxNQUNKLFlBQVk7QUFBQSxRQUNWLFVBQVU7QUFBQSxVQUNSO0FBQUEsWUFDRSxNQUFNO0FBQUEsWUFDTixTQUFTLENBQUMsS0FBSyxLQUFLLEtBQUssS0FBSyxLQUFLLEdBQUc7QUFBQSxZQUN0QyxRQUFRLENBQUMsVUFBVSxRQUFRO0FBQUEsVUFDN0I7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLFNBQVM7QUFBQSxNQUNQO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRLEVBQUUsZUFBZSxDQUFDLEVBQUU7QUFBQSxFQUM1QixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLE9BQU8sd0NBQWUsQ0FBQztBQUFBLElBQ3BEO0FBQUEsSUFDQSxZQUFZO0FBQUEsTUFDVjtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
