import { SelectOption, SelectProps } from "./ProductAdd";

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  placeholder,
  className = "",
  name,
  index = null,
}) => {
  return (
    <select
      value={value}
      name={name}
      onChange={(e) => {
        index !== null ? onChange(e, index) : onChange(e);
      }}
      className={`bg-white border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 ${className}`}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option: SelectOption) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
