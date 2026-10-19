export default function CartPlusIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Handle and upper basket rim */}
      <path d="M3.5 5.5l2.2 4.5h7.8" />
      {/* Basket body */}
      <path d="M5.7 10l1.8 5.5a1.2 1.2 0 0 0 1.15.8h7.7a1.2 1.2 0 0 0 1.15-.85l.5-1.5" />
      {/* Plus symbol */}
      <path d="M18.5 7v5.5" />
      <path d="M15.7 9.75h5.6" />
      {/* Wheels drawn as line circles */}
      <circle cx="8.5" cy="19.2" r="1.3" strokeWidth="1.8" />
      <circle cx="16" cy="19.2" r="1.3" strokeWidth="1.8" />
    </svg>
  );
}
