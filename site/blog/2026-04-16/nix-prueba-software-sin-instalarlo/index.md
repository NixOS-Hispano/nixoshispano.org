---
title: "Nix, prueba software sin instalarlo"
slug: nix-prueba-software-sin-instalarlo
authors: [sincorchetes]
tags: [nixos, nix, nix-shell, devops]
---

<head>
  <link rel="canonical" href="https://echemosunbitstazo.es/posts/nix-prueba-software-sin-instalarlo" />
</head>

# Nix, prueba software sin instalarlo

¿Cuántas veces has instalado algo "para probar" y se ha quedado ahí para siempre? ¿O peor, has roto dependencias por mezclar versiones? Con Nix puedes probar software, cerrarlo y que no quede ni rastro. Cada paquete vive aislado en `/nix/store` con su propio hash, sus propias dependencias y su propio mundo.

<!-- truncate -->

Si todavía no tienes Nix instalado, puedes seguir [el post anterior](/blog/usa-nix-en-debian-ubuntu-o-fedora) donde explicamos cómo montarlo paso a paso.

## Creando un entorno temporal

Con `nix-shell` puedes crear un entorno temporal que solo contendrá aquello que quieras probar, sin necesidad de instalar nada en tu sistema. Nix inicia una nueva sesión de shell, hereda tus variables de entorno y antepone en el `$PATH` los binarios solicitados.

```shell
❯ nix-shell -p toilet

[nix-shell:~]$ toilet "Hola mundo"
                                                                      
 m    m        ""#                                           #        
 #    #  mmm     #     mmm          mmmmm  m   m  m mm    mmm#   mmm  
 #mmmm# #" "#    #    "   #         # # #  #   #  #"  #  #" "#  #" "# 
 #    # #   #    #    m"""#         # # #  #   #  #   #  #   #  #   # 
 #    # "#m#"    "mm  "mm"#         # # #  "mm"#  #   #  "#m##  "#m#" 
```

Sales con `exit` y el comando desaparece de tu `$PATH`. Aunque el binario queda cacheado en `/nix/store` para que la próxima vez no tenga que descargarlo.

## Entorno puro con --pure

Si quieres un entorno completamente aislado sin acceso a tus herramientas del sistema:

```shell
❯ nix-shell -p toilet --pure

[nix-shell:~]$ git
bash: git: command not found
```

Solo tendrás los paquetes solicitados y los comandos esenciales de bash como `ls`, `cat`, `grep`...

## Ejecución ad-hoc con --run

Para ejecutar un comando sin quedarte dentro de la shell:

```shell
❯ nix-shell -p toilet --run "toilet Hola mundo"
```

Perfecto para ejecuciones puntuales en scripts o automatizaciones.

## Múltiples paquetes a la vez

El flag `-p` (alias de `--packages`) acepta varios paquetes separados por espacio:

```shell
❯ nix-shell -p toilet cowsay --run "toilet -t Hola Mundo | cowsay -n"
 ________________________________________________________________________
/                                                                        \
|  m    m        ""#                  m    m                   #         |
|  #    #  mmm     #     mmm          ##  ## m   m  m mm    mmm#   mmm   |
|  #mmmm# #" "#    #    "   #         # ## # #   #  #"  #  #" "#  #" "#  |
|  #    # #   #    #    m"""#         # "" # #   #  #   #  #   #  #   #  |
|  #    # "#m#"    "mm  "mm"#         #    # "mm"#  #   #  "#m##  "#m#"  |
|                                                                        |
\                                                                        /
 ------------------------------------------------------------------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

## Limpieza del store

Los paquetes que pruebas se quedan cacheados en `/nix/store`. Para liberar espacio:

- **Limpieza estándar:** `nix-collect-garbage` — borra lo que no se usa pero mantiene versiones anteriores para rollback.
- **Limpieza a fondo:** `nix-collect-garbage -d` — vacía todo, incluido el historial de generaciones anteriores. Es el que más espacio libera.

## Lee el artículo completo

En este post he resumido lo esencial pero el artículo original tiene más detalle: sesiones anidadas, explicación del mecanismo de caché y más. Léelo completo en:

**[Nix, prueba software sin instalarlo](https://echemosunbitstazo.es/posts/nix-prueba-software-sin-instalarlo)**
