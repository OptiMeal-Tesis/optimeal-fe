interface LactoseFreeIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export default function LactoseFreeIcon({ width = 16, height = 16, color = "var(--color-primary-500)" }: LactoseFreeIconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0)">
        <path d="M5.33334 1.33331H10.6667" stroke={color} strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5.99999 1.33331V2.22865M9.99999 1.33331V3.19265C10 3.71917 10.1559 4.23391 10.448 4.67198L10.8853 5.32798C11.1776 5.76624 11.3334 6.28123 11.3333 6.80798V7.56198M5.19999 5.19998L5.11466 5.32798C4.82243 5.76624 4.66654 6.28123 4.66666 6.80798V13.3333C4.66666 13.6869 4.80713 14.0261 5.05718 14.2761C5.30723 14.5262 5.64637 14.6666 5.99999 14.6666H9.99999C10.3536 14.6666 10.6928 14.5262 10.9428 14.2761C11.1928 14.0261 11.3333 13.6869 11.3333 13.3333V11.3333" stroke={color} strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4.66666 9.99999C5.19449 9.77886 5.76104 9.66498 6.33332 9.66498C6.9056 9.66498 7.47216 9.77886 7.99999 9.99999C8.72282 10.3028 9.51449 10.4031 10.29 10.29" stroke={color} strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
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
