import { useId } from 'react';

/** Mini ilustración SVG de dos capas para cabecera del tour (onboarding premium). */
export function TourHeaderIllustration() {
  const uid = useId().replace(/:/g, '');
  const glowId = `tourGlow-${uid}`;
  const coinId = `tourCoin-${uid}`;

  return (
    <svg
      className="tour-header-svg"
      viewBox="0 0 40 40"
      width="40"
      height="40"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={glowId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id={coinId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <g className="tour-svg-layer-back">
        <circle cx="20" cy="20" r="16" fill="none" stroke={`url(#${glowId})`} strokeWidth="1.2" opacity="0.55" />
        <path
          d="M 8 24 Q 20 12 32 24"
          fill="none"
          stroke={`url(#${glowId})`}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.7"
        />
      </g>
      <g className="tour-svg-layer-front">
        <circle cx="20" cy="18" r="7" fill={`url(#${coinId})`} stroke="#bfdbfe" strokeWidth="0.6" />
        <text x="20" y="21" textAnchor="middle" fontSize="8" fill="#0f172a" fontWeight="700" fontFamily="system-ui, sans-serif">
          $
        </text>
        <path
          d="M 12 28 L 16 26 L 20 28 L 24 26 L 28 28"
          fill="none"
          stroke="#34d399"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />
      </g>
    </svg>
  );
}
