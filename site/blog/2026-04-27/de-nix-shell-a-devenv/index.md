---
title: "De nix-shell a devenv: el camino para no volverte loco con tus entornos"
slug: de-nix-shell-a-devenv
authors: [sincorchetes]
tags: [nixos, nix, nix-shell, devenv, flakes, devops]
---

<head>
  <link rel="canonical" href="https://echemosunbitstazo.es/posts/de-nix-shell-a-devenv" />
</head>

¿Cuántas veces has empezado un proyecto nuevo y has acabado instalando un PostgreSQL "solo para esto" en tu máquina? ¿Y luego otro proyecto pide otra versión y empiezan los líos con puertos, servicios de `systemd` y aquel `pg_hba.conf` que tocaste hace meses? Nix soluciona buena parte del problema, pero según vas escalando aparecen otras incomodidades: `shellHook` cada vez más largos, `initdb` y `pg_ctl` a mano, `trap` para parar bien al salir... y la sensación de estar escribiendo bash dentro de Nix.

<!-- truncate -->

En el post original recorremos cuatro formas de montar el mismo entorno (una API en FastAPI con PostgreSQL 17) para ver, paso a paso, dónde se rompe cada aproximación y por qué `devenv` acaba siendo el destino natural:

1. **Scripts con `nix-shell` en la cabecera**: rápido y mágico la primera vez, pero sigue siendo un script de bash con esteroides.
2. **`mkShell` + `shellHook`**: más limpio de leer, pero la lógica del entorno sigue viviendo en bash.
3. **Flakes**: reproducibilidad bit a bit gracias a `flake.lock`, pero el `shellHook` infame sigue ahí.
4. **`devenv`**: declaras servicios (`services.postgres`), lenguajes (`languages.python`), `scripts` y variables, y se acabaron los `initdb`, `pg_ctl` y `trap` a mano.

La conclusión es bastante directa: Nix te da las piezas, y `devenv` las pone juntas con una experiencia que recuerda a `docker-compose` pero **sin contenedores, sin demonios y sin imágenes de gigas**, manteniendo la reproducibilidad de los flakes por debajo.

Si vienes de `docker-compose` y la curva de Nix te da pereza, el consejo es claro: empieza por `devenv` y ya irás bajando al detalle cuando lo necesites.

Tienes el artículo completo, con todos los ejemplos de código y la comparativa entre aproximaciones, en [echemosunbitstazo.es](https://echemosunbitstazo.es/posts/de-nix-shell-a-devenv). Y el código de los cuatro ejemplos está disponible en el repositorio [echemosunbitstazo.es-nix](https://github.com/sincorchetes/echemosunbitstazo.es-nix/tree/main/posts/de-nix-shell-a-devenv) por si quieres clonarlo y trastear.
