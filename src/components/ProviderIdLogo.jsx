export default function ProviderIdLogo({ className = "w-64 h-auto" }) {
  return (
    <svg
      viewBox="0 0 460 170"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Provider ID Logo"
    >
      <defs>
        {/* Frame loop gradient: Bright Emerald Green at bottom -> Lime Green -> Golden Yellow at top right */}
        <linearGradient id="providerFrameGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00A859" />
          <stop offset="55%" stopColor="#84CC16" />
          <stop offset="100%" stopColor="#EAB308" />
        </linearGradient>

        {/* Node Gradients */}
        <linearGradient id="nodeYellowLime" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D9F99D" />
          <stop offset="100%" stopColor="#84CC16" />
        </linearGradient>

        <linearGradient id="nodeVibrantGreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#00A859" />
        </linearGradient>

        <linearGradient id="idTextGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#006636" />
          <stop offset="100%" stopColor="#004D28" />
        </linearGradient>
      </defs>

      {/* Sweeping Outer Frame Box around "ID" */}
      <path
        d="M 215 142 L 350 142 C 382 142 402 128 418 88 L 434 45 C 440 32 432 20 415 20 L 250 20 C 242 20 238 24 240 32 C 242 38 248 40 256 40 L 400 40 L 388 72 C 378 100 365 120 342 120 L 215 120 C 205 120 198 126 200 132 C 202 138 208 142 215 142 Z"
        fill="url(#providerFrameGradient)"
      />

      {/* Connected nodes (Icon structure above/left of ID) */}
      {/* Top right node - Lime/Yellow */}
      <rect x="296" y="14" width="28" height="28" rx="7" fill="url(#nodeYellowLime)" />
      {/* Connector between Top and Middle */}
      <path d="M 304 38 L 304 48 C 304 54 298 60 292 60 L 284 60" stroke="#00A859" strokeWidth="6" strokeLinecap="round" fill="none" />
      {/* Middle left node - Green */}
      <rect x="264" y="46" width="28" height="28" rx="7" fill="url(#nodeVibrantGreen)" />
      {/* Connector down to Bottom node */}
      <path d="M 278 74 L 278 92 C 278 98 284 104 290 104 L 298 104" stroke="#00A859" strokeWidth="6" strokeLinecap="round" fill="none" />
      {/* Bottom node - Deep Green */}
      <rect x="296" y="90" width="26" height="26" rx="7" fill="#006636" />

      {/* "PROVIDER" Text */}
      <text
        x="12"
        y="112"
        fontFamily="'Prompt', 'SF Pro Display', system-ui, sans-serif"
        fontWeight="700"
        fontSize="54"
        letterSpacing="0.5"
        fill="#009647"
      >
        PROVIDER
      </text>

      {/* "ID" Text */}
      <text
        x="298"
        y="116"
        fontFamily="'Prompt', 'SF Pro Display', system-ui, sans-serif"
        fontWeight="900"
        fontSize="82"
        fill="url(#idTextGradient)"
      >
        ID
      </text>
    </svg>
  )
}
