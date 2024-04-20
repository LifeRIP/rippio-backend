# Rippio-Backend

Repositorio para el código backend del proyecto Rippio.

## Configuración del Entorno (PowerShell)

Antes de comenzar a trabajar en el proyecto, necesitas configurar tu entorno de desarrollo. Sigue los pasos a continuación para preparar todo lo necesario.

### Prerrequisitos

- [NVM](https://github.com/coreybutler/nvm-windows) (para utilizar la misma version Node)

   ```bash
    nvm install $(Get-Content .nvmrc)
    nvm use $(Get-Content .nvmrc)
   ```

- PNPM (recomendado)

   ```bash
   npm install -g pnpm
   ```

    o

- NPM

   ```bash
   npm install npm@latest -g
   ```

### Instalación

Configurar el entorno de desarrollo local:

   ```bash
   git clone https://github.com/LifeRIP/Rippio-Backend.git
   cd Rippio-Backend
   pnpm install
   ```

### Ejecución en ambiente local

Ejecutar el proyecto en un entorno local:

   ```bash
   pnpm start
   ```

## Estrategia de Ramificación Ship/Show/Ask

En este proyecto utilizamos la estrategia de ramificación Ship/Show/Ask para gestionar cómo se realizan y revisan los cambios en el código.

### Ship

Utiliza `Ship` para cambios menores o urgentes que no requieren revisión de código, por ejemplo, correcciones de errores menores, actualizaciones de documentación, etc.

#### Cómo realizar un Ship:

1. Crea una nueva rama desde `main`:

   ```bash
   git checkout -b hotfix/issue-description
   ```

2. Realiza tus cambios y realiza commits:

   ```bash
   git commit -m "Descripción breve del cambio"
   ```

3. Fusiona tu rama directamente en `main`:

   ```bash
   git checkout main
   git merge hotfix/issue-description
   git push origin main
   ```

### Show

Utiliza `Show` para cambios que son más significativos pero que se espera que sean fusionados sin discusión después de una revisión superficial.

#### Cómo realizar un Show:

1. Crea una nueva rama:

   ```bash
   git checkout -b feature/feature-name
   ```

2. Realiza tus cambios y realiza commits:

   ```bash
   git commit -m "Add some feature"
   ```

3. Abre una Pull Request en GitHub y etiquétala como `Show`.
4. Una vez aprobada, fusiona la Pull Request.

### Ask

Utiliza `Ask` para cambios significativos que requieren discusión y revisión detallada antes de su incorporación al proyecto.

#### Cómo realizar un Ask:

1. Crea una nueva rama:

   ```bash
   git checkout -b feature/new-big-feature
   ```

2. Realiza tus cambios y realiza commits:

   ```bash
   git commit -am "Start a big new feature"
   ```

3. Abre una Pull Request en GitHub y etiquétala como `Ask`.
4. Discute y revisa la Pull Request con el equipo.
5. Una vez que el consenso esté alcanzado y los cambios sean aprobados, fusiona la Pull Request.
