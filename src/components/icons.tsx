export function LogoMark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="9" width="3" height="6" rx="1" fill="#2E6B42" />
      <rect x="19" y="9" width="3" height="6" rx="1" fill="#2E6B42" />
      <rect x="5" y="7" width="2.5" height="10" rx="1" fill="#6F9445" />
      <rect x="16.5" y="7" width="2.5" height="10" rx="1" fill="#6F9445" />
      <rect x="7.5" y="11" width="9" height="2" rx="1" fill="#7D7261" />
    </svg>
  )
}

export function LeafSprig() {
  return (
    <svg width="44" height="26" viewBox="0 0 40 24" fill="none">
      <path d="M2 20c8-2 14-8 16-18" stroke="#6F9445" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M8 14c2-3 5-4 8-3" stroke="#6F9445" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M5 18c2-2 4-3 6-3" stroke="#6F9445" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </svg>
  )
}

export function DumbbellIcon({ size = 26, color = "#2E6B42" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="9" width="3.4" height="6" rx="1.7" fill={color} />
      <rect x="18.6" y="9" width="3.4" height="6" rx="1.7" fill={color} />
      <rect x="5.6" y="7.2" width="2.6" height="9.6" rx="1.3" fill={color} />
      <rect x="15.8" y="7.2" width="2.6" height="9.6" rx="1.3" fill={color} />
      <rect x="8.2" y="11" width="7.6" height="2" rx="1" fill={color} />
    </svg>
  )
}

export function HourglassIcon({ size = 24, color = "#B8811F" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M7 4h10M7 20h10" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path
        d="M8 4c0 4.5 3 6 4 7 1-1 4-2.5 4-7M8 20c0-4.5 3-6 4-7 1 1 4 2.5 4 7"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export function BackArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M15 6l-6 6 6 6" stroke="#7D7261" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function PlusIcon({ size = 16, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}
