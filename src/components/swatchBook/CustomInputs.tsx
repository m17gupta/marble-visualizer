import React, { useState, useEffect, useRef } from "react";

// Types for form configuration
interface SelectOption {
  value: string | number;
  label: string;
}

export interface FormField {
  id: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio"
    | "file";
  placeholder?: string;
  required?: boolean;
  options?: SelectOption[];
  multiple?: boolean;
  accept?: string;
  rows?: number;
  min?: number;
  max?: number;
  defaultValue?: any;
}

export interface DynamicFormProps {
  fields: FormField[];
  className?: string;
  formData: any;
  setFormData: any;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  className = "",
  formData,
  setFormData,
}) => {
  if (fields == null) {
    return <h1>No Fields</h1>;
  }

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const renderField = (field: FormField) => {
    const baseClasses =
      "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-400";

    switch (field.type) {
      case "textarea":
        return (
          <textarea
            id={field.id}
            value={formData[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={field.rows || 4}
            className={`${baseClasses} resize-vertical`}
          />
        );

      case "select":
        return (
          <select
            id={field.id}
            value={field.multiple ? undefined : formData[field.id] || ""}
            multiple={field.multiple}
            onChange={(e) => {
              if (field.multiple) {
                const values = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                );
                handleInputChange(field.id, values);
              } else {
                handleInputChange(field.id, e.target.value);
              }
            }}
            required={field.required}
            className={`${baseClasses} ${
              field.multiple ? "h-32" : ""
            } bg-white`}
          >
            {!field.multiple && <option value="">Select an option</option>}
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "checkbox":
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={field.id}
              checked={formData[field.id] || false}
              onChange={(e) => handleInputChange(field.id, e.target.checked)}
              required={field.required}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-200"
            />
            <label
              htmlFor={field.id}
              className="ml-3 text-sm font-medium text-gray-700"
            >
              {field.label}
            </label>
          </div>
        );

      case "radio":
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={`${field.id}-${option.value}`}
                  name={field.id}
                  value={option.value}
                  checked={formData[field.id] === option.value}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  required={field.required}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 transition-all duration-200"
                />
                <label
                  htmlFor={`${field.id}-${option.value}`}
                  className="ml-3 text-sm font-medium text-gray-700"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );

      case "file":
        return (
          <input
            type="file"
            id={field.id}
            onChange={(e) =>
              handleInputChange(field.id, e.target.files?.[0] || null)
            }
            accept={field.accept}
            required={field.required}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:transition-all file:duration-200"
          />
        );

      default:
        return (
          <input
            type={field.type}
            id={field.id}
            value={formData[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            min={field.min}
            max={field.max}
            className={baseClasses}
          />
        );
    }
  };

  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fields.map((field) => (
          <div
            key={field.id}
            className={`space-y-2 ${
              field.type === "textarea" ? "md:col-span-2 lg:col-span-3" : ""
            }`}
          >
            {field.type !== "checkbox" && (
              <label
                htmlFor={field.id}
                className="block text-sm font-medium text-gray-700"
              >
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            {renderField(field)}
          </div>
        ))}
      </div>
    </div>
  );
};

// Enhanced Attribute Component
interface AttributeValue {
  id?: number;
  value: string;
  isVariant: boolean;
}

interface EnhancedAttributeProps {
  attribute: any;
  values: AttributeValue[];
  onChange: (attributeId: number, values: AttributeValue[]) => void;
  onRemove: (attributeId: number) => void;
}

export const EnhancedAttributeInput: React.FC<EnhancedAttributeProps> = ({
  attribute,
  values,
  onChange,
  onRemove,
}) => {
  const [newValue, setNewValue] = useState("");
  const [isVariant, setIsVariant] = useState(false);

  const addValue = () => {
    if (!newValue.trim()) return;

    const newAttributeValue: AttributeValue = {
      value: newValue.trim(),
      isVariant,
    };

    onChange(attribute.id, [...values, newAttributeValue]);
    setNewValue("");
    setIsVariant(false);
  };

  const removeValue = (index: number) => {
    const updatedValues = values.filter((_, i) => i !== index);
    onChange(attribute.id, updatedValues);
  };

  const updateValue = (
    index: number,
    field: keyof AttributeValue,
    value: any
  ) => {
    const updatedValues = values.map((val, i) =>
      i === index ? { ...val, [field]: value } : val
    );
    onChange(attribute.id, updatedValues);
  };

  const isEnumType = attribute.data_type === "enum";

  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {attribute.name}
          </h3>
          <p className="text-sm text-gray-600 capitalize">
            Type: {attribute.data_type}
          </p>
        </div>
        <button
          onClick={() => onRemove(attribute.id)}
          className="text-red-500 hover:text-red-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Display existing values */}
      {values.length > 0 && (
        <div className="mb-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Values:</h4>
          {values.map((val, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-white p-3 rounded border"
            >
              <input
                type="text"
                value={val.value}
                onChange={(e) => updateValue(index, "value", e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter value"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={val.isVariant}
                  onChange={(e) =>
                    updateValue(index, "isVariant", e.target.checked)
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Variant</span>
              </label>
              <button
                onClick={() => removeValue(index)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add new value */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Add New Value:</h4>
        <div className="flex gap-3">
          {isEnumType ? (
            <select
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Select a value</option>
              {attribute.possible_values?.map((val: string) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={attribute.data_type === "number" ? "number" : "text"}
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder={`Enter ${attribute.name.toLowerCase()}`}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}

          <label className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-md">
            <input
              type="checkbox"
              checked={isVariant}
              onChange={(e) => setIsVariant(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Variant</span>
          </label>

          <button
            onClick={addValue}
            disabled={!newValue.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
