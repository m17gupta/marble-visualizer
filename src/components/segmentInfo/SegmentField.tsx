import React, { useState } from 'react';
import { Edit2, Copy, Check } from 'lucide-react';
import { SegmentFieldProps } from './types';

export const SegmentField: React.FC<SegmentFieldProps> = ({
  field,
  onEdit,
  onCopy
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(field.value.toString());
  const [copied, setCopied] = useState(false);

  const handleEdit = () => {
    if (field.editable && onEdit) {
      onEdit(field.key, editValue);
      setIsEditing(false);
    }
  };

  const handleCopy = async () => {
    if (field.copyable && onCopy) {handleCopy
      onCopy(field.value.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(field.value.toString());
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-200 hover:bg-gray-50">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {field.label}
        </label>
        {isEditing ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={handleEdit}
            className="w-full px-2 py-1 text-sm border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        ) : (
          <div className="text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
            {field.value}
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2 ml-4">
        {field.editable && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
        )}
        
        {field.copyable && (
          <button
            onClick={handleCopy}
            className="p-1 text-gray-500 hover:text-green-600 transition-colors"
            title="Copy"
          >
            {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
          </button>
        )}
      </div>
    </div>
  );
};