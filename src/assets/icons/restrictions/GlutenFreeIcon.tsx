interface GlutenFreeIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export default function GlutenFreeIcon({ width = 16, height = 16, color = "var(--color-primary-500)" }: GlutenFreeIconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0)">
        <path d="M1.33334 14.6667L8.00001 8" stroke={color} strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10.6667 5.33331L9.88666 6.11331" stroke={color} strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2.31332 8.35331L3.33332 7.33331L4.35332 8.35331C4.78892 8.79063 5.0335 9.38273 5.0335 9.99998C5.0335 10.6172 4.78892 11.2093 4.35332 11.6466L3.33332 12.6666L2.31332 11.6466C1.87772 11.2093 1.63315 10.6172 1.63315 9.99998C1.63315 9.38273 1.87772 8.79063 2.31332 8.35331Z" stroke={color} strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5.33334 5.33331L4.98001 5.68665C4.54441 6.12396 4.29984 6.71607 4.29984 7.33331C4.29984 7.95056 4.54441 8.54266 4.98001 8.97998L6.00001 9.99998L7.02001 8.97998C7.38668 8.61331 7.60668 8.14665 7.67334 7.66665" stroke={color} strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7.27335 3.50667C7.37335 3.33333 7.50001 3.16667 7.64668 3.02L8.66668 2L9.68668 3.02C10.0874 3.42267 10.3274 3.9577 10.3618 4.52474C10.3962 5.09178 10.2225 5.65188 9.87335 6.1" stroke={color} strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13.3333 1.33331H14.6667V2.66665C14.6667 3.37389 14.3857 4.05217 13.8856 4.55226C13.3855 5.05236 12.7072 5.33331 12 5.33331H10.6667V3.99998C10.6667 3.29274 10.9476 2.61446 11.4477 2.11436C11.9478 1.61426 12.6261 1.33331 13.3333 1.33331Z" stroke={color} strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7.64668 11.6467L8.66668 12.6667L7.64668 13.6867C7.20936 14.1223 6.61726 14.3668 6.00001 14.3668C5.38276 14.3668 4.79066 14.1223 4.35334 13.6867L3.33334 12.6667L4.35334 11.6467C4.79066 11.2111 5.38276 10.9665 6.00001 10.9665C6.61726 10.9665 7.20936 11.2111 7.64668 11.6467Z" stroke={color} strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10.6667 10.6667L10.3133 11.02C9.87602 11.4556 9.28391 11.7002 8.66667 11.7002C8.04942 11.7002 7.45732 11.4556 7.02 11.02L6 9.99999L7.02 8.97999C7.37588 8.6263 7.83656 8.39713 8.33333 8.32666" stroke={color} strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12.4933 8.72665C12.6667 8.62665 12.8333 8.49999 12.98 8.35332L14 7.33332L12.98 6.31332C12.5773 5.9126 12.0423 5.67255 11.4753 5.63819C10.9082 5.60382 10.3481 5.7775 9.89999 6.12665" stroke={color} strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M1.33334 1.33331L14.6667 14.6666" stroke={color} strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="16" height="16" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}
