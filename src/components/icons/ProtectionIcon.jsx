import React from 'react';

export default function ProtectionIcon({ 
  className = '', 
  title, 
  style = {}, 
  fillColor = "white",
  ...props 
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={{ display: 'inline-block', ...style }}
      aria-hidden={title ? undefined : 'true'}
      role={title ? 'img' : 'presentation'}
      {...props}
    >
      {title && <title>{title}</title>}
      <path
        d="M12 2.5C9.5 2.5 6.5 3.5 5 4.5V12.5C5 16.5 8 20 12 21.5C16 20 19 16.5 19 12.5V4.5C17.5 3.5 14.5 2.5 12 2.5Z"
        fill={fillColor}
        stroke="currentColor"
        strokeWidth="0.75"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
