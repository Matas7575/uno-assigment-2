/// <reference types="vite/client" />

/**
 * Module declaration for Vue single-file components.
 * 
 * This allows TypeScript to understand `.vue` files and their default exports.
 * 
 * @module VueComponent
 */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  
  /**
   * The default export of a Vue single-file component.
   * 
   * @type {DefineComponent<{}, {}, any>}
   */
  const component: DefineComponent<{}, {}, any>
  export default component
}