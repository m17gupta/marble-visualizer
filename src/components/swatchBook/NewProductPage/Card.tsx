import { CardProps } from "./ProductAdd";

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hover = false,
}) => (
  <div
    className={`bg-white rounded-xl border border-gray-100 shadow-sm ${
      hover ? "hover:shadow-md transition-shadow duration-300" : ""
    } ${className}`}
  >
    {children}
  </div>
);
