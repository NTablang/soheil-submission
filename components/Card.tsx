import React from "react";

type Props = {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  scrollable?: boolean;
  height?: string;
  withPadding?: boolean;
};
function Card({
  title,
  subtitle,
  children,
  scrollable = false,
  height = "",
  withPadding = true,
}: Props) {
  return (
    <div className="border border-black bg-white w-full rounded-md">
      {title && (
        <div className="border-b border-black px-8 py-4">
          <div>{title}</div>
          <div className="text-xs mt-1">{subtitle}</div>
        </div>
      )}
      <div
        className={`${withPadding ? "px-8 py-4" : ""}
        ${height} ${scrollable ? "overflow-scroll" : ""}`}
        >
        {children}
      </div>
    </div>
  );
}

export default Card;
