---
title: "Usa Nix en Debian, Ubuntu o Fedora y deja de sufrir"
slug: usa-nix-en-debian-ubuntu-o-fedora
authors: [sincorchetes]
tags: [nixos, debian, ubuntu, fedora, nix]
---

# Usa Nix en Debian, Ubuntu o Fedora y deja de sufrir

No necesitas instalar NixOS para aprovechar Nix. De hecho, puedes tener **tres distribuciones diferentes** para trabajar y mantener entornos de desarrollo idénticos en todas ellas. Sin Docker. Sin Ansible. Sin rezar para que funcione igual en producción.

<!-- truncate -->

## ¿Por qué querría Nix si ya tengo apt o dnf?

Buena pregunta. `apt` y `dnf` hacen su trabajo. Pero tienen un problema de base: **son gestores de paquetes del sistema**. Cuando instalas algo, lo enchufas directamente en `/usr/bin`, `/usr/lib` y compañía. Si dos proyectos necesitan versiones distintas de Node, Python o lo que sea... ya sabes cómo acaba la cosa. Virtualenvs, nvm, contenedores para todo, y un `docker-compose.yml` que parece un testamento.

## ¿Qué es `/nix/store`?

Nix funciona diferente. En lugar de instalar paquetes en las rutas compartidas del sistema, cada paquete se almacena en `/nix/store`, un directorio especial que actúa como almacén centralizado de **todo** lo que Nix gestiona: binarios, librerías, configuraciones, dependencias. Cada elemento dentro del store tiene una ruta única generada a partir de un hash criptográfico que incluye el código fuente, las dependencias y las opciones de compilación. Algo así:

```
/nix/store/83vhly8yyqr4nlzjvdyjsghvrkfb7gzl-toilet-0.3/
/nix/store/b6zafi0xddw1s6nsx1gmsrxrw00yr8h6-nodejs-slim-20.20.2/
```

Ese hash garantiza que si cualquier cosa cambia, la ruta será diferente. Esto permite que convivan múltiples versiones del mismo software sin conflictos. No toca tu sistema. No contamina nada. Y lo mejor: **funciona igual en Debian, Ubuntu y Fedora**.

## Tu primer entorno de desarrollo portable

Vamos a lo práctico. Imagina que necesitas trabajar en un proyecto con Node.js 20, Python 3.12 y jq. En lugar de instalar cada cosa con el gestor de paquetes de turno:

```shell
❯ nix shell nixpkgs#nodejs_20 nixpkgs#python312 nixpkgs#jq
```

Comprobamos:

```shell
❯ node --version
v20.20.2

❯ python3 --version
Python 3.12.11

❯ jq --version
jq-1.7.1
```

Los tres comandos están disponibles. Sales de la shell, desaparecen. Tu sistema sigue intacto.

## Probar software sin ensuciar tu sistema

¿Necesitas probar `wireshark` pero no quieres dejarlo instalado? ¿O una versión concreta de `terraform`?

```shell
❯ nix shell nixpkgs#wireshark
```

Úsalo. Cuando termines, cierra la shell. No queda rastro en tu sistema. Ni binarios sueltos, ni dependencias huérfanas, ni `apt autoremove` que ejecutar.

Y si quieres ejecutarlo directamente sin ni siquiera entrar en una shell:

```shell
❯ nix run nixpkgs#cowsay -- "Esto funciona en Debian, Ubuntu y Fedora"
 ___________________________________________
< Esto funciona en Debian, Ubuntu y Fedora >
 -------------------------------------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

## Convivencia pacífica con apt y dnf

Un punto importante: **Nix no reemplaza tu gestor de paquetes**. Tu sistema sigue siendo Debian, Ubuntu o Fedora al 100%. Los paquetes de sistema, las actualizaciones de seguridad, el kernel... todo eso lo sigue gestionando `apt` o `dnf`. Nix se ocupa del **entorno de desarrollo**. Conviven sin problemas porque Nix no toca `/usr`, no modifica librerías del sistema, no interfiere con nada. Vive en su `/nix/store` y punto.

## Esto no ha hecho más que empezar

En los próximos artículos seguiremos desgranando la maquinaria pesada de Nix: `nix-shell`, flakes, devenv, y todo lo que hace que este ecosistema sea una bestia en entornos de desarrollo y producción. Y cuando hayamos exprimido Nix a fondo, nos pondremos serios: **instalar NixOS desde cero con la ISO live**.

## Lee el artículo completo

En este post he resumido lo esencial pero el artículo original tiene más detalle: instalación paso a paso, habilitación de flakes, desinstalación limpia y más. Léelo completo en:

**[Usa Nix en Debian, Ubuntu o Fedora y deja de sufrir](https://echemosunbitstazo.es/posts/usa-nix-en-debian-ubuntu-o-fedora)**
