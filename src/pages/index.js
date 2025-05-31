import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import AnimatedTerminal from '@site/src/components/AnimatedTerminal';

import styles from '../css/index.module.css';

function GhosttySection() {
  return (
    <section className={styles.ghosttySection}>
      <div className="container">
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.terminalContainer}>
              <AnimatedTerminal />
            </div>
          </div>
          <div className={styles.column}>
            <div className={styles.content}>
              <div className={styles.buttons}>
                <Link
                  className={clsx('button button--primary button--lg', styles.docsButton)}
                  to="/docs">
                  Docs
                </Link>
                <Link
                  className={clsx('button button--secondary button--lg', styles.blogButton)}
                  to="/blog">
                  Blog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <GhosttySection />
  );
}
