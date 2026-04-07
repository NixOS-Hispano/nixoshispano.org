import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "NixOS Hispano",
  tagline: "Comunidad hispanohablante de NixOS",
  favicon: "img/favicon.ico",

  url: "https://nixoshispano.org",
  baseUrl: "/",

  organizationName: "nixoshispano",
  projectName: "nixoshispano.org",

  onBrokenLinks: "throw",

  i18n: {
    defaultLocale: "es",
    locales: ["es"],
  },

  presets: [
    [
      "classic",
      {
        docs: false,
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          editUrl:
            "https://gitlab.com/nixoshispano/nixoshispano.org/-/edit/main/",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: [
    [
      "@easyops-cn/docusaurus-search-local",
      {
        hashed: true,
        language: ["es"],
        indexBlog: true,
        indexDocs: false,
        blogRouteBasePath: "/blog",
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: "NixOS Hispano",
      logo: {
        alt: "NixOS Hispano Logo",
        src: "img/nixos.png",
      },
      items: [
        { to: "/blog", label: "Blog", position: "left" },
        {
          href: "https://wiki.nixos.org/wiki/NixOS_Wiki/es",
          label: "Wiki NixOS",
          position: "left",
        },
        {
          href: "https://gitlab.com/nixoshispano/nixoshispano.org",
          label: "GitLab",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Recursos",
          items: [
            {
              label: "Wiki NixOS (es)",
              href: "https://wiki.nixos.org/wiki/NixOS_Wiki/es",
            },
            {
              label: "NixOS oficial",
              href: "https://nixos.org",
            },
          ],
        },
        {
          title: "Comunidad",
          items: [
            {
              label: "Telegram",
              href: "https://t.me/nixoshispano",
            },
            {
              label: "LinkedIn",
              href: "https://www.linkedin.com/groups/17866051/",
            },
          ],
        },
        {
          title: "Más",
          items: [
            {
              label: "Blog",
              to: "/blog",
            },
            {
              label: "RSS",
              href: "https://nixoshispano.org/blog/rss.xml",
            },
            {
              label: "Atom",
              href: "https://nixoshispano.org/blog/atom.xml",
            },
            {
              label: "GitLab",
              href: "https://gitlab.com/nixoshispano/nixoshispano.org",
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} NixOS Hispano — Comunidad independiente sin ánimo de lucro. Nix y NixOS son proyectos de software libre bajo sus respectivas licencias. Construido con Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["nix", "bash"],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
