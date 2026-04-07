import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  color?: string; // tailwind text color class
}

const Badge = ({ children, color = "text-white" }: BadgeProps) => (
  <span
    className={`px-3 py-1 bg-black rounded-lg text-sm font-bold ${color} transition-opacity duration-200 group-hover:opacity-0`}
  >
    {children}
  </span>
);

export default Badge;
