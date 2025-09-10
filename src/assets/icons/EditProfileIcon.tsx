interface EditProfileIconProps {
  width?: number;
  height?: number;
  className?: string;
  color?: string;
}

export default function EditProfileIcon({ width = 24, height = 25, className, color = "black" }: EditProfileIconProps) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 24 25" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M2 21.5C1.99986 20.2062 2.31352 18.9317 2.91408 17.7857C3.51464 16.6397 4.38419 15.6565 5.44815 14.9203C6.51212 14.1842 7.73876 13.7171 9.02288 13.559C10.307 13.401 11.6103 13.5568 12.821 14.013" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21.378 17.126C21.7764 16.7277 22.0002 16.1874 22.0002 15.624C22.0002 15.0607 21.7764 14.5204 21.378 14.122C20.9797 13.7237 20.4394 13.4999 19.876 13.4999C19.3126 13.4999 18.7724 13.7237 18.374 14.122L14.364 18.134C14.1263 18.3716 13.9522 18.6654 13.858 18.988L13.021 21.858C12.9959 21.9441 12.9944 22.0353 13.0167 22.1221C13.0389 22.2089 13.0841 22.2882 13.1475 22.3516C13.2108 22.415 13.2901 22.4601 13.3769 22.4824C13.4637 22.5046 13.555 22.5031 13.641 22.478L16.511 21.641C16.8337 21.5468 17.1274 21.3728 17.365 21.135L21.378 17.126Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 13.5C12.7614 13.5 15 11.2614 15 8.5C15 5.73858 12.7614 3.5 10 3.5C7.23858 3.5 5 5.73858 5 8.5C5 11.2614 7.23858 13.5 10 13.5Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
