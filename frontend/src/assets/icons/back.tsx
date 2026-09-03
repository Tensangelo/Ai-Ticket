import type { IconProps } from "../../lib/types/icons";

export const BackIcon = ({
  width = "24",
  height = "24",
  colorPrimary = "currentColor",
  className,
}: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      className={className}
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <g
        fill="none"
        stroke={colorPrimary}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="m8 5l-5 5l5 5" />
        <path d="M3 10h8c5.523 0 10 4.477 10 10v1" />
      </g>
    </svg>
  );
};
