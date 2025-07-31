// src/components/ui/combobox.tsx

import React, { useState } from "react";

interface ComboboxProps {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  placeholder?: string;
}

export const Combobox: React.FC<ComboboxProps> = ({
  options,
  selected,
  onSelect,
  placeholder = "Select or type",
}) => {
  const [query, setQuery] = useState(selected || "");
  const [showOptions, setShowOptions] = useState(false);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (value: string) => {
    onSelect(value);
    setQuery(value);
    setShowOptions(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={(e) => {
          const val = e.target.value;
          setQuery(val);
          setShowOptions(true);
          onSelect(val);
        }}
        onFocus={() => setShowOptions(true)}
        onBlur={() => setTimeout(() => setShowOptions(false), 100)}
        className="w-full border border-gray-300 px-3 py-2 rounded-md"
      />
      {showOptions && filteredOptions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-auto shadow-sm">
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
