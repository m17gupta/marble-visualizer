import React, { useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import { AttributeId } from "../interfaces";

interface MultiSelectDropdownProps {
  label?: string;
  options?: (string | number)[];
  defaultSelected?: (string | number)[];
  onSelectionChange?: (index: number, selected: (string | number)[]) => void;
  allowCreate?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  setSelected?: any;
  allvalues: AttributeId;
  onAddInPossible: (index: number, possibleValue: string | number) => void;
}

interface DropdownState {
  isOpen: boolean;
  selectedValues: (string | number)[];
  newValue: string;
  isCreating: boolean;
}

type DropdownAction =
  | { type: "TOGGLE_DROPDOWN" }
  | { type: "CLOSE_DROPDOWN" }
  | { type: "SET_SELECTED"; payload: (string | number)[] }
  | { type: "TOGGLE_OPTION"; payload: string | number }
  | { type: "REMOVE_VALUE"; payload: string | number }
  | { type: "SET_NEW_VALUE"; payload: string }
  | { type: "START_CREATING" }
  | { type: "STOP_CREATING" }
  | { type: "SELECT_ALL"; payload: (string | number)[] }
  | { type: "SELECT_NONE" };

const dropdownReducer = (
  state: DropdownState,
  action: DropdownAction
): DropdownState => {
  switch (action.type) {
    case "TOGGLE_DROPDOWN":
      return {
        ...state,
        isOpen: !state.isOpen,
        isCreating: false,
      };
    case "CLOSE_DROPDOWN":
      return {
        ...state,
        isOpen: false,
        isCreating: false,
      };
    case "SET_SELECTED":
      return {
        ...state,
        selectedValues: action.payload,
      };
    case "TOGGLE_OPTION":
      const isSelected = state.selectedValues.includes(action.payload);
      return {
        ...state,
        selectedValues: isSelected
          ? state.selectedValues.filter((val) => val !== action.payload)
          : [...state.selectedValues, action.payload],
      };
    case "REMOVE_VALUE":
      return {
        ...state,
        selectedValues: state.selectedValues.filter(
          (val) => val !== action.payload
        ),
      };
    case "SET_NEW_VALUE":
      return {
        ...state,
        newValue: action.payload,
      };
    case "START_CREATING":
      return {
        ...state,
        isCreating: true,
        isOpen: true,
      };
    case "STOP_CREATING":
      return {
        ...state,
        isCreating: false,
        newValue: "",
      };
    case "SELECT_ALL":
      return {
        ...state,
        selectedValues: action.payload,
      };
    case "SELECT_NONE":
      return {
        ...state,
        selectedValues: [],
      };
    default:
      return state;
  }
};

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label = "Value(s):",
  options,
  defaultSelected = [],
  onSelectionChange,
  allowCreate = true,
  placeholder = "Enter new value...",
  className = "",
  disabled = false,
  setSelected,
  allvalues,
  onAddInPossible,
}) => {
  const [state, dispatch] = React.useReducer(dropdownReducer, {
    isOpen: false,
    selectedValues: defaultSelected,
    newValue: "",
    isCreating: false,
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        dispatch({ type: "CLOSE_DROPDOWN" });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (onSelectionChange && allvalues?.id !== undefined) {
      onSelectionChange(allvalues.id, state.selectedValues);
    }
  }, [state.selectedValues]);

  useEffect(() => {
    if (state.isCreating && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [state.isCreating]);

  const toggleDropdown = (): void => {
    if (!disabled) {
      dispatch({ type: "TOGGLE_DROPDOWN" });
    }
  };

  const handleOptionClick = (optionValue: string | number): void => {
    dispatch({ type: "TOGGLE_OPTION", payload: optionValue });
  };

  const removeValue = (valueToRemove: string | number): void => {
    dispatch({ type: "REMOVE_VALUE", payload: valueToRemove });
  };

  const selectAll = (): void => {
    dispatch({ type: "SELECT_ALL", payload: options! });
  };

  const selectNone = (): void => {
    dispatch({ type: "SELECT_NONE" });
  };

  const createValue = (): void => {
    if (allowCreate && !disabled) {
      dispatch({ type: "START_CREATING" });
    }
  };

  const handleCreateValue = (): void => {
    if (!options?.includes(state.newValue) && allvalues.id !== undefined) {
      onAddInPossible(allvalues.id, state.newValue);
      dispatch({ type: "TOGGLE_OPTION", payload: state.newValue });
      dispatch({ type: "STOP_CREATING" });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCreateValue();
    } else if (e.key === "Escape") {
      e.preventDefault();
      dispatch({ type: "STOP_CREATING" });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch({ type: "SET_NEW_VALUE", payload: e.target.value });
  };

  const getOptionLabel = (value: string | number): string | number => {
    const option = options?.find((opt) => opt === value);
    return option ? option : value;
  };

  return (
    <div className={`w-full max-w-2xl mx-auto p-6 ${className}`}>
      <div ref={dropdownRef} className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>

        {/* Selected Values Display */}
        <div
          className={`min-h-[44px] w-full px-3 py-2 border border-gray-300 rounded-md bg-white flex flex-wrap gap-2 items-center ${
            disabled ? "cursor-not-allowed bg-gray-50" : "cursor-pointer"
          }`}
          onClick={toggleDropdown}
        >
          {state.selectedValues.map((value) => (
            <span
              key={value}
              className="inline-flex items-center px-2 py-1 rounded-md text-sm bg-gray-100 text-gray-700"
            >
              × {getOptionLabel(value)}
              <button
                type="button"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  removeValue(value);
                }}
                className="ml-1 text-gray-500 hover:text-gray-700"
                disabled={disabled}
                aria-label={`Remove ${getOptionLabel(value)}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
          <div className="flex-grow"></div>
          <ChevronDown
            size={20}
            className={`text-gray-400 transition-transform ${
              state.isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex gap-3 mt-3">
          <button
            type="button"
            onClick={selectAll}
            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400"
            disabled={disabled}
          >
            Select all
          </button>
          <button
            type="button"
            onClick={selectNone}
            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400"
            disabled={disabled}
          >
            Select none
          </button>
          <div className="flex-grow"></div>
          {allowCreate && (
            <button
              type="button"
              onClick={createValue}
              className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-600 rounded disabled:text-gray-400 disabled:border-gray-400"
              disabled={disabled}
            >
              Create value
            </button>
          )}
        </div>

        {/* Dropdown Menu */}
        {state.isOpen && (
          <div className=" top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
            {state.isCreating && allowCreate && (
              <div className="p-3 border-b border-gray-200">
                <input
                  ref={inputRef}
                  type="text"
                  value={state.newValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  placeholder={placeholder}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={handleCreateValue}
                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => dispatch({ type: "STOP_CREATING" })}
                    className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {options !== undefined &&
              options.map((option) => {
                const isSelected = state.selectedValues.includes(option);
                return (
                  <div
                    key={option}
                    onClick={() => handleOptionClick(option)}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-50 ${
                      isSelected ? "bg-blue-50 text-blue-700" : "text-gray-700"
                    }`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    {option}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};
