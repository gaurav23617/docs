import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { X, Menu, LayoutGrid, SquarePlus } from "lucide-react";
import styles from "../css/terminal.module.css";

// Terminal component
export default function Terminal({
  columns,
  rows,
  fontSize = "medium",
  className,
  title,
  lines,
  whitespacePadding = 0,
  disableScrolling = false,
}) {
  const [platformStyle, setPlatformStyle] = useState("macos");

  useEffect(() => {
    const userAgent = window?.navigator.userAgent;
    const isLinux = /Linux/i.test(userAgent);
    setPlatformStyle(isLinux ? "adwaita" : "macos");
  }, []);

  const [autoScroll, setAutoScroll] = useState(true);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const position = Math.ceil(
      (scrollTop / (scrollHeight - clientHeight)) * 100,
    );
    if (position < 100) {
      setAutoScroll(false);
    }
    if (position === 100) {
      setAutoScroll(true);
    }
  };

  const codeRef = useRef(null);

  useEffect(() => {
    if (autoScroll) {
      codeRef.current?.scrollTo({
        top: codeRef.current.scrollHeight,
        behavior: "instant",
      });
    }
  }, [lines?.length, autoScroll]);

  const padding = " ".repeat(whitespacePadding);

  return (
    <div
      className={clsx(
        styles.terminal,
        className,
        {
          [styles.fontXTiny]: fontSize === "xtiny",
          [styles.fontTiny]: fontSize === "tiny",
          [styles.fontSmall]: fontSize === "small",
          [styles.fontMedium]: fontSize === "medium",
          [styles.fontLarge]: fontSize === "large",
        },
        {
          [styles.adwaita]: platformStyle === "adwaita",
          [styles.macos]: platformStyle === "macos",
        },
      )}
      style={{
        "--columns": columns + 2 * whitespacePadding,
        "--rows": rows,
      }}
    >
      <div className={styles.header}>
        {platformStyle === "adwaita" && <AdwaitaButtons />}
        {platformStyle === "macos" && <MacosButtons />}
        <p className={styles.title}>{title}</p>
      </div>
      <code
        ref={codeRef}
        className={clsx(styles.content, {
          [styles.disableScrolling]: disableScrolling,
        })}
        onScroll={handleScroll}
      >
        {lines?.map((line, i) => {
          return (
            <div
              key={i + line}
              dangerouslySetInnerHTML={{
                __html: `${padding}${line}${padding}`,
              }}
            />
          );
        })}
      </code>
    </div>
  );
}

function AdwaitaButtons() {
  // NOTE:
  // It is entirely intentional that the maximize/minimize buttons are missing.
  // Blame GNOME.
  return (
    <>
      <ul className={clsx(styles.windowControls, styles.start)}>
        <li>
          <SquarePlus className={styles.icon} />
        </li>
      </ul>
      <ul className={clsx(styles.windowControls, styles.end)}>
        <li>
          <LayoutGrid className={styles.icon} />
        </li>
        <li>
          <Menu className={styles.icon} />
        </li>
        <li className={styles.circularButton}>
          <X className={styles.icon} />
        </li>
      </ul>
    </>
  );
}

function MacosButtons() {
  return (
    <ul className={clsx(styles.windowControls, styles.start)}>
      <li className={styles.circularButton} />
      <li className={styles.circularButton} />
      <li className={styles.circularButton} />
    </ul>
  );
}
