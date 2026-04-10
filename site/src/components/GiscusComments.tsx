import React from "react";
import Giscus from "@giscus/react";
import { useColorMode } from "@docusaurus/theme-common";

export default function GiscusComments(): JSX.Element {
  const { colorMode } = useColorMode();

  return (
    <div style={{ marginTop: "2rem" }}>
      <Giscus
        repo="nixos-hispano/nixoshispano.org"
        repoId="R_kgDOR8BMLA"
        category="Blog Comments"
        categoryId="DIC_kwDOR8BMLM4C6SZG"
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={colorMode === "dark" ? "dark" : "light"}
        lang="es"
        loading="lazy"
      />
    </div>
  );
}
