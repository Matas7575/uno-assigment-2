# uno-assigment-2

## Project setup
```sh
npm install
```

### Compiles and hot-reloads for development
```sh
npm run serve
```

### Compiles and minifies for production
```sh
npm run build
```

### Lints and fixes files
```sh
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Using Vue in This Project

This project is built using Vue 3, a progressive JavaScript framework for building user interfaces. Here are some key points on how Vue is utilized in this project:

### Single File Components (SFCs)

Vue's Single File Components (SFCs) are used extensively in this project. Each component is defined in a `.vue` file, which contains the template, script, and style sections. For example:
- [App.vue](src/App.vue) - The root component of the application.
- [HelloWorld.vue](src/components/HelloWorld.vue) - A sample component.
- [UnoCard.vue](src/components/UnoCard.vue) - A component representing a single Uno card.

### State Management with Pinia

State management is handled using Pinia, a store library for Vue. The store is defined in [unoStore.ts](src/store/unoStore.ts) and provides reactive state and methods to manage the game state.

### Routing with Vue Router

Vue Router is used for navigating between different views in the application. The routes are defined in [index.ts](src/router/index.ts). Key views include:
- [GameSetup.vue](src/views/GameSetup.vue) - The setup screen for the game.
- [PlayHand.vue](src/views/PlayHand.vue) - The main game play area.
- [GameOver.vue](src/views/GameOver.vue) - The game over screen.

### TypeScript

TypeScript is used throughout the project to provide static type checking. This helps catch errors early and improves code quality. Type definitions are provided in the [types](src/types) directory.

### Tailwind CSS

Tailwind CSS is used for styling the application. Custom styles are defined in [main.css](src/assets/main.css) and Tailwind configuration is provided in [tailwind.config.js](tailwind.config.js).

### Icons with Lucide Vue

Lucide Vue is used for icons in the application. Icons are imported and used in components like [Dialog.vue](src/components/ui/Dialog.vue).

### Utility Services

Utility services, such as [cardService.ts](src/services/cardService.ts), are used to encapsulate logic related to card operations, such as creating and shuffling the deck.

### Running the Project

To run the project locally, follow these steps:
1. Install dependencies:
    ```sh
    npm install
    ```
2. Start the development server:
    ```sh
    npm run serve
    ```
3. Open your browser and navigate to `http://localhost:8080` to see the application in action.

### Building for Production

To build the project for production, run:
```sh
npm run build
```
This will create a `dist` directory with the compiled files.

### Linting

To lint and fix files, run:
```sh
npm run lint
```

### Further Customization

For further customization, refer to the [Vue CLI Configuration Reference](https://cli.vuejs.org/config/).