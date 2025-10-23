import { SidebarItemProps } from "./ProductAdd";

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  active = false,
  badge,
  onClick,
}) => (
  <button
    onClick={() => onClick(label)}
    className={`flex w-full items-center justify-between px-4 py-3 cursor-pointer rounded-lg transition-all duration-200 ${
      active
        ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-l-4 border-blue-500"
        : "hover:bg-gray-50 text-gray-700"
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon size={18} className={active ? "text-blue-600" : "text-gray-500"} />
      <span className="font-medium">{label}</span>
    </div>
    {badge && (
      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
        {badge}
      </span>
    )}
  </button>
);
