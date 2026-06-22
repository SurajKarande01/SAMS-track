import React from "react";

export function Logo({ className = "w-8 h-8", showText = false, textClass = "font-bold text-xl tracking-tight text-white" }) {
  return (
    <div className="flex items-center gap-2 select-none">
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>
        {/* Shield background */}
        <path
          d="M12 2L3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-3z"
          fill="url(#logoGrad)"
        />
        {/* Book pages overlay */}
        <path
          d="M12 7v10m-5-8.5c1.2-.5 3.3-.5 5 0M12 8.5c1.7-.5 3.8-.5 5 0M7 11.5c1.2-.5 3.3-.5 5 0M12 11.5c1.7-.5 3.8-.5 5 0M7 14.5c1.2-.5 3.3-.5 5 0M12 14.5c1.7-.5 3.8-.5 5 0"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Small checkmark */}
        <path
          d="M8.5 17.5l2 2 4-4"
          stroke="#34d399"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showText && (
        <span className={textClass}>
          SAMS-TRACK
        </span>
      )}
    </div>
  );
}

export default Logo;
