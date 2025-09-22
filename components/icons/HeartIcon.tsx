import React from 'react';

export const HeartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.25 6.75H5.25a.75.75 0 00-.75.75v5.25a6.75 6.75 0 006.75 6.75h.75a6.75 6.75 0 006.75-6.75V7.5a.75.75 0 00-.75-.75z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.25 9h1.5a2.25 2.25 0 010 4.5h-1.5"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 3v2.25M12 3v2.25M15 3v2.25"
    />
  </svg>
);

