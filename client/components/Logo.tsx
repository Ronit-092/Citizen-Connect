interface LogoProps {
  className?: string;
}

export default function Logo({ className = "w-10 h-10" }: LogoProps) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer chevron with rounded corners */}
      <path 
        d="M50 15 L80 45 C80 45 80 48 77 48 L70 48 C68 48 67 47 65 45 L50 30 L35 45 C33 47 32 48 30 48 L23 48 C20 48 20 45 20 45 L50 15 Z" 
        fill="#5029E5"
      />
      {/* Inner chevron with rounded corners */}
      <path 
        d="M50 40 L70 60 C70 60 70 62 68 62 L62 62 C61 62 60 61 59 60 L50 51 L41 60 C40 61 39 62 38 62 L32 62 C30 62 30 60 30 60 L50 40 Z" 
        fill="#5029E5"
      />
    </svg>
  );
}
