import { useState } from "react";
import { CollapsibleSectionProps } from "./ProductAdd";
import { Card } from "./Card";
import { ChevronDown } from "lucide-react";

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  defaultOpen = true,
  icon: Icon,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);

  return (
    <Card className="mb-6 overflow-hidden">
      <div
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon size={20} className="text-blue-600" />}
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div
          className={`transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <ChevronDown size={20} className="text-gray-400" />
        </div>
      </div>
      {isOpen && (
        <div className="px-6 pb-6 border-t border-gray-100">
          <div className="pt-6">{children}</div>
        </div>
      )}
    </Card>
  );
};
