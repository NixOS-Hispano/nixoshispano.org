import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/blog"
          >
            Ir al Blog →
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Comunidad hispanohablante de NixOS"
    >
      <HomepageHeader />
      <main>
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              <div className={clsx("col col--4")}>
                <div className="text--center padding-horiz--md">
                  <Heading as="h3">Declarativo</Heading>
                  <p>
                    Define tu sistema completo en un fichero de configuración.
                    Sin sorpresas, sin estado oculto.
                  </p>
                </div>
              </div>
              <div className={clsx("col col--4")}>
                <div className="text--center padding-horiz--md">
                  <Heading as="h3">Reproducible</Heading>
                  <p>
                    El mismo fichero produce el mismo sistema en cualquier
                    máquina. Comparte tu configuración con confianza.
                  </p>
                </div>
              </div>
              <div className={clsx("col col--4")}>
                <div className="text--center padding-horiz--md">
                  <Heading as="h3">Comunidad</Heading>
                  <p>
                    Únete a la comunidad hispanohablante de NixOS. Aprende,
                    comparte y colabora en español.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
