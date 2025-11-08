# 🕺 DonDisco 💃

**DonDisco** es una aplicación web moderna construida con React, TypeScript, Vite y Material UI. Es tu plataforma de música disco favorita donde puedes explorar álbumes clásicos, playlists curadas y radio en vivo.

## 🚀 Tecnologías

- **React 18** - Biblioteca de JavaScript para construir interfaces de usuario
- **TypeScript** - Superset tipado de JavaScript  
- **Vite** - Herramienta de construcción rápida y moderna
- **Material UI** - Biblioteca de componentes React con Material Design
- **Emotion** - Biblioteca CSS-in-JS para estilos

## ✨ Características

- 🎵 Interfaz moderna con tema disco
- 📱 Diseño completamente responsivo
- 🎨 Tema personalizado con gradientes y colores vibrantes
- 🔧 Configuración de desarrollo optimizada con HMR
- 📦 Componentes Material UI listos para usar

## 🛠️ Instalación

1. Clona el repositorio o descarga los archivos
2. Instala las dependencias:
   ```bash
   npm install
   ```

## 🚀 Uso

### Desarrollo
Para iniciar el servidor de desarrollo:
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`

### Construcción
Para construir la aplicación para producción:
```bash
npm run build
```

### Vista previa
Para previsualizar la construcción de producción:
```bash
npm run preview
```

### Linting
Para ejecutar el linter:
```bash
npm run lint
```

## 📁 Estructura del Proyecto

```
dondisco/
├── src/
│   ├── components/     # Componentes reutilizables
│   ├── pages/         # Componentes de páginas
│   ├── types/         # Definiciones de tipos TypeScript
│   ├── theme/         # Configuración del tema Material UI
│   ├── App.tsx        # Componente principal
│   └── main.tsx       # Punto de entrada
├── public/            # Archivos estáticos
└── .github/           # Configuración de GitHub y Copilot
```

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
