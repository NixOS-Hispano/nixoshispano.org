{ pkgs, ... }:

{

  packages = [
    pkgs.nodejs_22
  ];

  languages.javascript = {
    enable = true;
    bun.enable = true;
    directory = "./site";
    package = pkgs.nodejs_22;
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
