import React from 'react';
import styles from '../css/terminal.module.css';

const Terminal = ({ content, onClick, isPlaying = true }) => {
  const renderContent = () => {
    if (typeof content === 'string') {
      return content.split('\n').map((line, index) => (
        <div key={index} className={styles.line}>
          {line || '\u00A0'} {/* Non-breaking space for empty lines */}
        </div>
      ));
    }

    // Handle array of lines or more complex content structure
    if (Array.isArray(content)) {
      return content.map((line, index) => (
        <div key={index} className={styles.line}>
          {line || '\u00A0'}
        </div>
      ));
    }

    // Handle frame data from animation
    if (content && typeof content === 'object') {
      const lines = content.lines || content.content || [];
      return lines.map((line, index) => (
        <div key={index} className={styles.line}>
          <span dangerouslySetInnerHTML={{ __html: line || '\u00A0' }} />
        </div>
      ));
    }

    return <div className={styles.line}>Terminal ready</div>;
  };

  return (
    <div className={styles.terminal} onClick={onClick}>
      <div className={styles.terminalHeader}>
        <div className={styles.terminalButtons}>
          <div className={`${styles.terminalButton} ${styles.close}`}></div>
          <div className={`${styles.terminalButton} ${styles.minimize}`}></div>
          <div className={`${styles.terminalButton} ${styles.maximize}`}></div>
        </div>
        <div className={styles.terminalTitle}>
          Terminal {!isPlaying && '(Paused)'}
        </div>
      </div>
      <div className={styles.terminalBody}>
        <div className={styles.terminalContent}>
          {renderContent()}
          <div className={`${styles.cursor} ${isPlaying ? styles.blinking : ''}`}>
            ▊
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
