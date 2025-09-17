interface VeganIconProps {
  color?: string;
}

export default function VegenIcon({ color = "var(--color-primary-500)" }: VeganIconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0)">
        <path d="M10.6667 5.33331C13.3333 5.33331 14.6667 3.99998 14.6667 1.33331C12 1.33331 10.6667 2.66665 10.6667 5.33331Z" stroke={color} strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11.6067 2.39336C10.2232 1.50341 8.55957 1.15635 6.93569 1.41894C5.3118 1.68153 3.84234 2.53522 2.80988 3.81584C1.77742 5.09646 1.25488 6.71358 1.34274 8.35621C1.43061 9.99884 2.12267 11.551 3.28585 12.7142C4.44902 13.8773 6.00118 14.5694 7.6438 14.6573C9.28643 14.7451 10.9036 14.2226 12.1842 13.1901C13.4648 12.1577 14.3185 10.6882 14.5811 9.06433C14.8437 7.44044 14.4966 5.77681 13.6067 4.39336" stroke={color} strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M1.33334 1.33331C3.34575 2.93867 4.9845 4.96293 6.13576 7.26544C7.28701 9.56795 7.92316 12.0935 8.00001 14.6666C8.60001 10.12 9.00001 8.33331 10.6667 5.33331" stroke={color} strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="16" height="16" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}
