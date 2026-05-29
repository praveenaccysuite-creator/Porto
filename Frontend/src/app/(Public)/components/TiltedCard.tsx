"use client";
import type { SpringOptions } from 'framer-motion';
import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import RemoteImage from "./ui/RemoteImage";

interface TiltedCardProps {
  imageSrc: string;
  altText: string;
  title: string;
  description: string;
  technologies: string[];
  liveUrl: string;
  githubUrl?: string;
  containerHeight?: React.CSSProperties['height'];
  containerWidth?: React.CSSProperties['width'];
  scaleOnHover?: number;
  rotateAmplitude?: number;
}

const springValues: SpringOptions = {
  damping: 30,
  stiffness: 100,
  mass: 2
};

export default function TiltedCard({
  imageSrc,
  altText,
  title,
  description,
  technologies,
  liveUrl,
  githubUrl,
  containerHeight = '400px',
  containerWidth = '100%',
  scaleOnHover = 1.05,
  rotateAmplitude = 12
}: TiltedCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const overlayOpacity = useSpring(0, springValues);

  const [lastY, setLastY] = useState(0);

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    rotateX.set(rotationX);
    rotateY.set(rotationY);

    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);

    setLastY(offsetY);
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover);
    overlayOpacity.set(1);
  }

  function handleMouseLeave() {
    overlayOpacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <div
      ref={ref}
      className="tilted-card-container"
      style={{
        height: containerHeight,
        width: containerWidth,
        perspective: '1000px'
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
        
      <motion.div
        className="tilted-card"
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Image Layer */}
        <div className="card-image-wrapper">
          <RemoteImage
            src={imageSrc}
            alt={altText}
            fill
            className="card-image object-cover"
          />
        </div>




        {/* Hover Overlay */}
        <motion.div
          className="card-overlay"
          style={{ opacity: overlayOpacity }}
        >
          <div className="overlay-content">
            <h3 className="card-title">{title}</h3>
            <p className="card-description">{description}</p>

            {/* Tech Stack */}
            <div className="tech-stack">
              {technologies.map((tech, idx) => (
                <span key={idx} className="tech-badge">
                  {tech}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="card-actions">
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="action-btn live-btn"
                onClick={(e) => e.stopPropagation()}
              >
                <svg
                  className="btn-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                Visit
              </a>
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-btn github-btn"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg
                    className="btn-icon"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  Code
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Bottom Info */}
        <div className="card-footer">
          <h4 className="footer-title font-mono">{title}</h4>
          <p className="footer-category">{technologies.slice(0, 2).join(' • ')}</p>
        </div>
      </motion.div>
    </div>
  );
}
