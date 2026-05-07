// app/icon.tsx
export default function Icon() {
  return (
    <svg width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <rect x="10" y="10" width="80" height="80" rx="20" fill="url(#grad)" />
      <text x="50" y="65" fontSize="45" fontWeight="900" textAnchor="middle" fill="#0a0a0a">FP</text>
      <animateTransform
        attributeName="transform"
        type="scale"
        values="1;1.08;1"
        dur="2s"
        repeatCount="indefinite"
      />
    </svg>
  )
}