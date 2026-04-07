# NixOS Hispano - Blog

Blog de la comunidad hispanohablante de NixOS. Hecho con [Docusaurus](https://docusaurus.io/).

## Publicar un nuevo post

### Estructura de un post

Los posts van en `site/blog/` con el formato:

```
site/blog/YYYY-MM-DD/titulo-del-post/
├── index.md
└── (imágenes opcionales)
```

El archivo `index.md` debe tener este front matter al inicio:

```markdown
---
title: Título del post
slug: titulo-del-post
authors: [tu_usuario]
tags: [nixos, ejemplo]
---

Contenido del post aquí.

<!-- truncate -->

Resto del contenido (lo de arriba se muestra como resumen en el listado).
```

### Añadir tu perfil de autor

Si es tu primer post, añade tu entrada en `site/blog/authors.yml`:

```yaml
tu_usuario:
  name: Tu Nombre
  url: https://tu-web.com
  image_url: https://url-de-tu-avatar.jpg
  socials:
    github: tu_usuario_github
```

### Si eres miembro de la organización

1. Clona el repo
2. Crea una rama: `git checkout -b post/titulo-del-post`
3. Crea tu carpeta y archivo en `site/blog/`
4. Prueba en local: `devenv shell dev`
5. Haz commit y push
6. Abre un Pull Request a `main`

### Si eres colaborador externo

1. Haz fork del repo
2. Crea tu rama y post igual que arriba
3. Abre un Pull Request desde tu fork

### Desarrollo local

Necesitas [devenv](https://devenv.sh/) instalado.

```bash
# Entrar al entorno de desarrollo
devenv shell

# Arrancar servidor local
dev

# Construir para producción
build
```

## Comunidad

- [Telegram](https://t.me/nixoshispano)
- [LinkedIn](https://www.linkedin.com/groups/17866051/)
