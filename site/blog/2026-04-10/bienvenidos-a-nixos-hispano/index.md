---
title: Bienvenidos a NixOS Hispano
slug: bienvenidos-a-nixos-hispano
authors: [sincorchetes]
tags: [nixos, comunidad, devenv, docusaurus]
---

# Bienvenidos a NixOS Hispano

¡Hola a todos! Este es el blog oficial de la comunidad NixOS Hispano.

Aquí compartiremos noticias, tutoriales y novedades sobre NixOS y el ecosistema Nix en español.

<!-- truncate -->

## ¿Qué es NixOS?

NixOS es una distribución de Linux construida sobre el gestor de paquetes Nix. Ofrece configuración declarativa y reproducible del sistema, lo que la convierte en una opción ideal para quienes buscan un sistema operativo fiable y fácil de mantener.

## Cómo hemos construido este sitio web

Este sitio web está construido con [Docusaurus](https://docusaurus.io/) y gestiono todo el entorno de desarrollo y despliegue usando [devenv](https://devenv.sh/). Quiero compartir cómo se ha hecho y por qué he tomado estas decisiones como responsable fundador de la comunidad.

### ¿Qué es devenv?

devenv es una herramienta construida sobre Nix que permite definir entornos de desarrollo reproducibles de forma sencilla y declarativa. A diferencia de otras aproximaciones del ecosistema Nix, devenv está diseñado específicamente para entornos de desarrollo: gestiona dependencias, scripts personalizados, variables de entorno y hooks de forma integrada, todo desde un único fichero `devenv.nix`.

### Nuestro entorno: `devenv.nix`

Así es como definimos el entorno de desarrollo del sitio:

```nix
{ pkgs, ... }:

{
  languages.javascript = {
    enable = true;
    bun.enable = true;
    directory = "./site";
  };

  scripts = {
    dev.exec = ''cd site && bun install && bun start'';
    build.exec = ''cd site && bun install && bun run build'';
    serve.exec = ''cd site && bun run serve'';
  };

  env = {
    DOCUSAURUS_TELEMETRY_DISABLED = "1";
  };

  enterShell = ''
    echo "NixOS Hispano environment"
    echo ""
    echo "Available commands:"
    echo "  dev    - Start the development server"
    echo "  build  - Build the static site"
    echo "  serve  - Serve the generated static files"
    echo ""
    bun --version
  '';
}
```

Con esto conseguimos:

- **Bun como runtime de JavaScript**: se usa [Bun](https://bun.sh/) en lugar de Node.js por su velocidad a la hora de instalar dependencias y por su compatibilidad nativa, lo que simplifica enormemente la configuración en Nix.
- **Scripts personalizados**: `dev`, `build` y `serve` son comandos disponibles directamente en la shell. Cualquier persona que clone el repositorio solo necesita ejecutar `devenv shell` y ya tiene todo listo.
- **Variables de entorno**: se desactiva la telemetría de Docusaurus por defecto.
- **Mensaje de bienvenida**: al entrar en el entorno, se muestra un resumen de los comandos disponibles.

### La pipeline de despliegue

El sitio se despliega automáticamente en GitHub Pages mediante GitHub Actions. El workflow (`.github/workflows/deploy.yml`) hace lo siguiente:

1. **Instala Nix** usando `cachix/install-nix-action` con el canal `nixos-unstable` y configurando el caché de devenv.
2. **Instala devenv** directamente desde su flake en GitHub.
3. **Construye el sitio** ejecutando `devenv shell build`, que activa el entorno Nix y lanza el script `build` definido en `devenv.nix`.
4. **Sube el artefacto** generado en `site/build` y lo despliega en GitHub Pages.

Esto significa que la pipeline de CI/CD usa exactamente el mismo entorno que se usa en local, garantizando reproducibilidad total.

### ¿Por qué devenv y no otras alternativas?

En el ecosistema Nix existen varias formas de gestionar entornos y dependencias. Estas son las alternativas que consideré y por qué elegí devenv:

#### `nix-env`

`nix-env` instala paquetes de forma imperativa en el perfil del usuario. Esto tiene varios inconvenientes:

- **No es reproducible**: el estado del entorno depende del historial de comandos ejecutados, no de un fichero declarativo.
- **Contamina el perfil global**: los paquetes instalados con `nix-env` afectan a todo el sistema del usuario, no solo al proyecto.
- **No es portable**: otro desarrollador tendría que ejecutar los mismos comandos `nix-env -i` para replicar el entorno, sin garantía de obtener las mismas versiones.

#### Flakes (`nix develop`)

Los flakes con `nix develop` son una alternativa legítima y potente para definir entornos reproducibles. Sin embargo:

- **Mayor complejidad**: requieren escribir un `flake.nix` con `devShell`, gestionar inputs, y entender conceptos como `outputs`, `system`, y `nixpkgs.legacyPackages`.
- **Hashes SHA256 de paquetes Node.js**: empaquetar dependencias de Node.js con flakes implica lidiar con los hashes SHA256 de cada paquete. Herramientas como `node2nix` o `dream2nix` intentan automatizarlo, pero añaden una capa de complejidad considerable: cada vez que se actualiza una dependencia hay que regenerar los hashes, y los errores de *hash mismatch* son frecuentes y frustrantes de depurar.
- **Verbosidad**: para un proyecto web sencillo como este, un `flake.nix` requiere bastante más código que un `devenv.nix`.
- **Experiencia de usuario**: devenv ofrece una abstracción más amigable con soporte nativo para lenguajes, scripts y variables de entorno sin necesidad de recurrir a `mkShell` o `buildInputs` manualmente.
- **Funcionalidad experimental**: los flakes siguen siendo una funcionalidad experimental en Nix y su API puede cambiar.

#### `nix-shell` con `shell.nix`

`nix-shell` es la forma clásica de crear entornos aislados en Nix:

- **Funcional pero limitado**: no tiene soporte nativo para scripts personalizados, gestión de lenguajes o hooks de forma tan integrada como devenv.
- **Sin caché oficial**: a diferencia de devenv, que se integra con Cachix de serie, `nix-shell` no ofrece un mecanismo de caché estandarizado para CI/CD.

#### En resumen

| Característica | `nix-env` | `nix-shell` | Flakes | **devenv** |
|---|---|---|---|---|
| Reproducible | No | Sí | Sí | **Sí** |
| Declarativo | No | Sí | Sí | **Sí** |
| Sencillez | Media | Media | Baja | **Alta** |
| Scripts integrados | No | No | No | **Sí** |
| Soporte de lenguajes | No | No | No | **Sí** |
| Integración con CI/CD | No | Parcial | Sí | **Sí** |
| Estable | Sí | Sí | No (experimental) | **Sí** |

devenv ofrece el equilibrio perfecto: la reproducibilidad de Nix, con una experiencia de desarrollo sencilla y una integración directa con la pipeline de CI/CD.

### ¿Por qué Docusaurus y no otro generador de sitios estáticos?

Además de elegir devenv para el entorno, también se evaluó qué generador de sitios estáticos usar. Estas fueron las alternativas que se descartaron:

#### MkDocs (Material for MkDocs)

[MkDocs](https://www.mkdocs.org/) es una herramienta popular para documentación, especialmente con el tema [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/). Sin embargo:

- **Reescritura desde cero en la v2**: MkDocs se reescribió completamente en su versión 2, lo que generó roturas de compatibilidad y fragmentación en el ecosistema de plugins.
- **Material ya no desarrolla más themes**: el proyecto Material for MkDocs ha dejado de elaborar nuevos themes para esta versión, centrándose en su propio framework.
- **Blog como ciudadano de segunda**: MkDocs es ante todo una herramienta de documentación. Su soporte de blog existe como plugin, pero la integración es limitada comparada con soluciones pensadas desde el inicio para blogs y contenido.

#### Sphinx

[Sphinx](https://www.sphinx-doc.org/) es el estándar de facto para documentación en el mundo Python y se usa en proyectos oficiales de gran envergadura. Aun así:

- **Orientado a documentación oficial**: Sphinx brilla en documentación técnica de proyectos grandes, pero resulta excesivo para un sitio comunitario con blog.
- **reStructuredText (rst)**: aunque Sphinx soporta Markdown a través de extensiones como MyST, su formato nativo es rst. Adoptar rst supone generar deuda técnica y curvas de aprendizaje innecesarias para los colaboradores de la comunidad, cuando Markdown es un estándar que todo el mundo ya conoce.
- **Menor ecosistema de themes y plugins para blogs**: el ecosistema de Sphinx está optimizado para documentación API y técnica, no para blogs o sitios comunitarios.

#### ¿Por qué Docusaurus?

[Docusaurus](https://docusaurus.io/) es un proyecto de código abierto mantenido por Meta con una comunidad activa y en crecimiento. Lo elegí porque:

- **Estándar en la industria**: lo usan proyectos como React Native, Jest, Supabase, Tauri y muchos más. Es una apuesta segura y con largo recorrido.
- **Todo integrado**: blog, documentación, búsqueda, i18n, versionado y sistema de plugins vienen de serie o son fáciles de añadir.
- **Markdown y MDX**: el contenido se escribe en Markdown estándar (o MDX si se necesitan componentes React), eliminando barreras de entrada para colaboradores.
- **Comunidad y respaldo**: al ser un proyecto de Meta con miles de estrellas en GitHub, cuenta con soporte activo, actualizaciones frecuentes y un ecosistema de plugins y themes en constante crecimiento.
- **Experiencia de desarrollo moderna**: hot reload, TypeScript nativo, y un sistema de theming basado en React que permite personalizar cualquier componente.

## ¿Por qué no tenemos una wiki propia?

Quizá te hayas fijado en que en la barra de navegación enlazamos directamente a la [wiki oficial de NixOS en español](https://wiki.nixos.org/wiki/NixOS_Wiki/es) en lugar de mantener una sección de wiki propia. Esta decisión es completamente intencionada, y responde a una filosofía clara: **no fragmentar la información de referencia**.

La wiki oficial de NixOS ya es el lugar centralizado donde la comunidad global documenta paquetes, opciones de configuración, guías de instalación y resolución de problemas. Crear una wiki paralela en español supondría:

- **Duplicar esfuerzo**: mantener contenido de referencia sincronizado con la wiki oficial es una tarea ingente y condenada a quedar desactualizada.
- **Fragmentar la información**: los usuarios tendrían que buscar en dos sitios distintos sin saber cuál tiene la versión más completa o actualizada.
- **Dividir a los colaboradores**: las contribuciones de documentación de referencia tienen más impacto en la wiki oficial, donde benefician a toda la comunidad hispanohablante de NixOS, no solo a los visitantes de este sitio.

En su lugar, animamos a todo el mundo a **contribuir traducciones y contenido directamente en la wiki oficial**. Cuantas más páginas estén disponibles en español allí, mejor para todos.

### Entonces, ¿qué papel juega este sitio?

NixOS Hispano no pretende ser una enciclopedia, sino un **espacio comunitario vivo**. Aquí publicaremos:

- **Tutoriales prácticos**: guías paso a paso con opinión y contexto, no solo documentación de referencia.
- **Puntos de vista y experiencias**: artículos sobre cómo usamos NixOS en el día a día, decisiones de diseño, flujos de trabajo y lecciones aprendidas.
- **Formas de contribuir**: cómo participar en la comunidad, traducir la wiki oficial, reportar bugs o colaborar con proyectos del ecosistema Nix.
- **Noticias y novedades**: anuncios de versiones, cambios importantes en nixpkgs y eventos de la comunidad.

En resumen: la wiki oficial es para la **referencia**, y este blog es para la **conversación**.

## Comentarios con GitHub Discussions

Para fomentar esa conversación, hemos integrado un sistema de comentarios en cada entrada del blog usando [Giscus](https://giscus.app/). Giscus conecta los comentarios del sitio directamente con **GitHub Discussions** del repositorio del proyecto, de forma que:

- **No necesitamos infraestructura propia**: los comentarios se almacenan en GitHub Discussions, sin bases de datos ni servicios adicionales.
- **Autenticación con GitHub**: los usuarios comentan con su cuenta de GitHub, lo que evita spam y facilita la identificación de los participantes.
- **Bidireccional**: los comentarios escritos aquí aparecen en GitHub Discussions y viceversa. Cualquiera puede participar desde donde le resulte más cómodo.
- **Respeta el tema del sitio**: el widget de Giscus se adapta automáticamente al modo claro u oscuro de Docusaurus.
- **Carga bajo demanda**: el widget se carga de forma diferida (`lazy`), sin afectar al rendimiento de la página.

La integración se hace mediante el componente [`@giscus/react`](https://github.com/giscus/giscus-component) y un wrapper del tema de Docusaurus (`BlogPostItem`), que inyecta la sección de comentarios automáticamente al final de cada post. No es necesario añadir nada manualmente en cada entrada: todos los posts del blog incluyen comentarios por defecto.

Si bajas hasta el final de esta página, podrás ver la sección de comentarios en acción. ¡Anímate a dejar el tuyo!

## Únete a la comunidad

- **Telegram**: [NixOS Hispano](https://t.me/nixoshispano)
- **LinkedIn**: [LinkedIn](https://www.linkedin.com/groups/17866051/)

¡Nos vemos en la comunidad!
