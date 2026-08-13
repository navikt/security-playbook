import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from '@docusaurus/router';
import styles from './CollapsibleSection.module.css';

export default function CollapsibleSection({ summary, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const detailsRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash && detailsRef.current) {
      const targetElement = detailsRef.current.querySelector(location.hash);
      if (targetElement) {
        setIsOpen(true);
        // Wait one tick for React to render <details open> before scrolling
        const OPEN_RENDER_DELAY_MS = 50;
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }, OPEN_RENDER_DELAY_MS);
      }
    }
  }, [location.hash]);

  // Extract the first heading (h1–h4) from children to use as the card header.
  // This keeps the heading in the MDX source (so Docusaurus picks it up for TOC),
  // while rendering it inside <summary> as the collapsible toggle.
  const childrenArray = React.Children.toArray(children);
  const firstHeadingIndex = childrenArray.findIndex(
    (child) => React.isValidElement(child) && (
      // Native HTML headings (h1–h4 as string type)
      (typeof child.type === 'string' && /^h[1-4]$/.test(child.type)) ||
      // Docusaurus custom heading components: remark-headings always sets an id prop
      (child.props && typeof child.props.id === 'string' && child.props.id.length > 0)
    )
  );
  const headingElement = firstHeadingIndex !== -1 ? childrenArray[firstHeadingIndex] : null;
  const contentChildren = firstHeadingIndex !== -1
    ? childrenArray.filter((_, i) => i !== firstHeadingIndex)
    : childrenArray;

  return (
    <details
      ref={detailsRef}
      open={isOpen}
      onToggle={(e) => setIsOpen(e.target.open)}
      className={styles.details}
    >
      <summary className={styles.summary}>
        <span className={styles.chevron} aria-hidden="true">▶</span>
        {headingElement ?? <span className={styles.summaryText}>{summary}</span>}
      </summary>
      <div className={styles.content}>
        {contentChildren}
      </div>
    </details>
  );
}
