import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

/**
 * Redux State Debugger Component
 * 
 * A component that allows viewing Redux state directly in the UI.
 * Only shows up in development mode.
 */
const ReduxDebugger: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [selectedSlice, setSelectedSlice] = useState<string | null>(null);
  
  // Get the entire Redux state
  const reduxState = useSelector((state: RootState) => state);
  
  // Only render in development mode
  if (!import.meta.env.DEV) {
    return null;
  }
  
  // Get all available slices
  const slices = Object.keys(reduxState);
  
  // Filter slices based on search input
  const filteredSlices = slices.filter(slice => 
    slice.toLowerCase().includes(filter.toLowerCase())
  );
  
  // Get the data for the selected slice
  const sliceData = selectedSlice ? reduxState[selectedSlice as keyof typeof reduxState] : null;
  
  return (
    <div 
      style={{
        position: 'fixed',
        bottom: isOpen ? '0' : '-400px',
        right: '0',
        width: '400px',
        height: '400px',
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '8px 0 0 0',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
        transition: 'bottom 0.3s ease',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div 
        style={{
          padding: '8px 16px',
          backgroundColor: '#343a40',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer'
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>Redux State Debugger</div>
        <button 
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          {isOpen ? '▼' : '▲'}
        </button>
      </div>
      
      {/* Content */}
      <div style={{ display: 'flex', height: 'calc(100% - 40px)', overflow: 'hidden' }}>
        {/* Left sidebar - Redux slices */}
        <div style={{ width: '35%', borderRight: '1px solid #dee2e6', overflow: 'auto' }}>
          <input
            type="text"
            placeholder="Filter slices..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: 'none',
              borderBottom: '1px solid #dee2e6'
            }}
          />
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {filteredSlices.map(slice => (
              <li 
                key={slice}
                style={{
                  padding: '8px 16px',
                  cursor: 'pointer',
                  backgroundColor: selectedSlice === slice ? '#e9ecef' : 'transparent'
                }}
                onClick={() => setSelectedSlice(slice)}
              >
                {slice}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Right content - State data */}
        <div style={{ width: '65%', overflow: 'auto', padding: '8px' }}>
          {selectedSlice ? (
            <pre style={{ margin: 0, fontSize: '12px' }}>
              {JSON.stringify(sliceData, null, 2)}
            </pre>
          ) : (
            <div style={{ padding: '16px', color: '#6c757d' }}>
              Select a Redux slice to view its state
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReduxDebugger;
