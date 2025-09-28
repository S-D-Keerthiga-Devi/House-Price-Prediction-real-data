import React from "react";

export const Spinner = ({ size = 24, color = "text-gray-500" }) => {
  return (
    <div
      className={`animate-spin rounded-full border-4 border-t-4 border-gray-200 ${color}`}
      style={{ width: size, height: size }}
    ></div>
  );
};
