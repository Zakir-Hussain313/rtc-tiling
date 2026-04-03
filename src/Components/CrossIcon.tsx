import React from "react";

type CrossIconProps = {
  className?: string;
};

function CrossIcon({ className }: CrossIconProps) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      className={className}
    >
      <line
        x1="1"
        y1="1"
        x2="17"
        y2="17"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="17"
        y1="1"
        x2="1"
        y2="17"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

export default CrossIcon;