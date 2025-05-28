import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import AnimatedTerminal from '../components/AnimatedTerminal'; // Adjust path as needed
import styles from '../css/index.module.css'; // Adjust path as needed

function useWindowSize() {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    function updateSize() {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return [width, height];
}

// Hook to load animation data
function useAnimationData() {
  const [animationFrames, setAnimationFrames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadFrames() {
      try {
        const frames = [];
        let frameIndex = 1;
        let consecutiveFailures = 0;
        const maxConsecutiveFailures = 3; // Stop after 3 consecutive failures

        while (consecutiveFailures < maxConsecutiveFailures) {
          try {
            const response = await fetch(`/terminals/animation_frames/frame${frameIndex}.txt`);
            if (response.ok) {
              const content = await response.text();
              frames.push(content);
              consecutiveFailures = 0; // Reset failure count on success
              console.log(`Loaded frame ${frameIndex}`);
            } else {
              consecutiveFailures++;
              console.log(`Frame ${frameIndex} not found (${response.status})`);
            }
          } catch (fetchError) {
            consecutiveFailures++;
            console.log(`Error loading frame ${frameIndex}:`, fetchError);
          }
          frameIndex++;
        }

        if (frames.length === 0) {
          throw new Error('No animation frames found');
        }

        console.log(`Successfully loaded ${frames.length} frames`);
        setAnimationFrames(frames);
      } catch (err) {
        console.error('Error loading animation frames:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadFrames();
  }, []);

  return { animationFrames, loading, error };
}

function GhosttyHomePage() {
  // Load animation data
  const { animationFrames, loading, error } = useAnimationData();

  // Calculate font size based on window dimensions
  const [windowWidth, windowHeight] = useWindowSize();
  const widthSize = windowWidth > 1100 ? 'small' : windowWidth > 674 ? 'tiny' : 'xtiny';
  const heightSize = windowHeight > 900 ? 'small' : windowHeight > 750 ? 'tiny' : 'xtiny';

  let fontSize = 'small';
  const sizePriority = ['xtiny', 'tiny', 'small'];
  for (const size of sizePriority) {
    if (widthSize === size || heightSize === size) {
      fontSize = size;
      break;
    }
  }

  // Debug logging
  useEffect(() => {
    console.log('Animation frames loaded:', animationFrames.length);
    console.log('Loading state:', loading);
    console.log('Error state:', error);
  }, [animationFrames, loading, error]);

  return (
    <main className={styles.homePage}>
      {/* Show loading state while frames are being loaded */}
      {loading && (
        <div className={styles.loading}>Loading terminal animation...</div>
      )}

      {/* Show error state if frames failed to load */}
      {error && (
        <div className={styles.error}>
          Error loading animation: {error}
          <br />
          <small>Check browser console for details</small>
        </div>
      )}

      {/* Only render when window width is calculated and frames are loaded */}
      {windowWidth > 0 && !loading && !error && animationFrames.length > 0 && (
        <>
          <section className={styles.terminalWrapper} aria-hidden={true}>
            <AnimatedTerminal
              title="👻 Ghostty"
              fontSize={fontSize}
              whitespacePadding={windowWidth > 950 ? 20 : windowWidth > 850 ? 10 : 0}
              className={styles.animatedTerminal}
              columns={100}
              rows={41}
              frames={animationFrames}
              frameLengthMs={31}
              loop={true}
              autoStart={true}
            />
          </section>

          <div className={styles.gridContainer}>
            <p className={`${styles.tagline} ${styles.regularWeight}`}>
              Ghostty is a fast, feature-rich, and cross-platform terminal
              emulator that uses platform-native UI and GPU acceleration.
            </p>
          </div>

          <div className={`${styles.gridContainer} ${styles.buttonsList}`}>
            <a
              href="/download"
              className={`${styles.buttonLink} ${styles.large}`}
            >
              Download
            </a>
            <a
              href="/docs"
              className={`${styles.buttonLink} ${styles.large} ${styles.neutral}`}
            >
              Documentation
            </a>
          </div>
        </>
      )}

      {/* Fallback content if no frames are available */}
      {windowWidth > 0 && !loading && !error && animationFrames.length === 0 && (
        <div className={styles.fallback}>
          <h1>👻 Ghostty</h1>
          <p>Fast, feature-rich, and cross-platform terminal emulator</p>
        </div>
      )}
    </main>
  );
}

export default function Home() {
  return (
    <Layout
      title="Ghostty Terminal Emulator"
      description="Fast, feature-rich, and cross-platform terminal emulator that uses platform-native UI and GPU acceleration."
    >
      <GhosttyHomePage />
    </Layout>
  );
}
