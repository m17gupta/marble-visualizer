import React, { useState } from "react";
import { AttributeId } from "../interfaces";

interface DropdownProps {
  options: AttributeId[];
  placeholder?: string;
  selected: AttributeId[];
  setSelected: any;
}

export const SearchAndSelect: React.FC<DropdownProps> = ({
  options,
  placeholder = "Select...",
  selected,
  setSelected,
}) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filteredOptions = options.filter((opt:any) =>
    opt.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (option: AttributeId) => {
    const sel = selected.some((d) => d.id == option.id);
    let filtered;
    if (sel) {
      filtered = selected.filter((d) => d.id != option.id);
    } else {
      filtered = [...selected, option];
    }
    setSelected(filtered);
    setOpen(false);
    setSearch("");
  };

  return (
    <div className="w-64">
      <div
        className="border rounded px-3 py-2 cursor-pointer flex justify-between items-center"
        onClick={() => setOpen(!open)}
      >
        <span>{selected.length < 0 || placeholder}</span>
        <span className="ml-2">&#9662;</span>
      </div>

      {open && (
        <div className="rounded-l mt-1 w-full border rounded bg-white z-10 max-h-60 overflow-y-auto">
          <input
            type="text"
            className="w-full px-2 py-1 border-b focus:outline-none"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <ul>
            {filteredOptions.map((option, index) => {
              const sel = selected.some((d) => d.id == option.id);
              return (
                <li
                  key={index}
                  className={`px-3 py-2 cursor-pointer hover:bg-blue-500 hover:text-white ${
                    sel ? "bg-blue-500 text-white" : ""
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  {option.name}
                </li>
              );
            })}
            {filteredOptions.length === 0 && (
              <li className="px-3 py-2 text-gray-400">No results</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
