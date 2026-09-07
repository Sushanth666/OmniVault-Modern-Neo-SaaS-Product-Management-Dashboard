import React from 'react';

/**
 * Creative OmniVault Brand Mark Logo
 * Features an isometric geometric 3D vault enclosure, interlocking Omni ring, and glowing asset core.
 */
export function OmniVaultLogo({ size = 36, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-300 ${className}`}
      aria-label="OmniVault Logo"
    >
      <defs>
        {/* Top Facet: Radiant Cyan & Violet Horizon */}
        <linearGradient id="ovTopFacet" x1="6" y1="6" x2="38" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="60%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>

        {/* Left Facet: Deep Obsidian Navy */}
        <linearGradient id="ovLeftFacet" x1="6" y1="14" x2="22" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>

        {/* Right Facet: Cyber Amethyst Purple */}
        <linearGradient id="ovRightFacet" x1="22" y1="14" x2="38" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#312e81" />
        </linearGradient>

        {/* Core Asset Star Gradient */}
        <linearGradient id="ovCoreGlow" x1="17" y1="17" x2="27" y2="27" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#e0e7ff" />
        </linearGradient>

        {/* Ambient Drop Glow */}
        <filter id="ovGlow" x="0" y="0" width="44" height="44" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#6366f1" floodOpacity="0.45" />
        </filter>
      </defs>

      {/* Outer Glow Wrapper */}
      <g filter="url(#ovGlow)">
        {/* Top Isometric Vault Face */}
        <path
          d="M22 5.5L36.5 13.8L22 22.2L7.5 13.8L22 5.5Z"
          fill="url(#ovTopFacet)"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="0.75"
          strokeLinejoin="round"
        />

        {/* Left Isometric Vault Face */}
        <path
          d="M7.5 13.8L22 22.2V38.5L7.5 30.2V13.8Z"
          fill="url(#ovLeftFacet)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="0.75"
          strokeLinejoin="round"
        />

        {/* Right Isometric Vault Face */}
        <path
          d="M22 22.2L36.5 13.8V30.2L22 38.5V22.2Z"
          fill="url(#ovRightFacet)"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="0.75"
          strokeLinejoin="round"
        />

        {/* Vault Precision Groove Lines */}
        <path
          d="M12 16.5L22 22.2L32 16.5"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="0.75"
          strokeLinecap="round"
        />
        <path
          d="M22 22.2V33"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="0.75"
          strokeLinecap="round"
        />

        {/* Central 'Omni' Vault Ring */}
        <circle
          cx="22"
          cy="22"
          r="7"
          fill="#0c1222"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="1.75"
        />
        <circle
          cx="22"
          cy="22"
          r="5.5"
          fill="#1e1b4b"
          stroke="rgba(99, 102, 241, 0.6)"
          strokeWidth="0.75"
        />

        {/* Biometric Asset Spark Core (4-point vault diamond) */}
        <path
          d="M22 17.8C22 20.2 20.2 22 17.8 22C20.2 22 22 23.8 22 26.2C22 23.8 23.8 22 26.2 22C23.8 22 22 20.2 22 17.8Z"
          fill="url(#ovCoreGlow)"
        />

        {/* Center Radiant Core Beacon */}
        <circle cx="22" cy="22" r="1.2" fill="#ffffff" />
      </g>
    </svg>
  );
}
