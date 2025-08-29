import React, { useState, useRef, useEffect } from 'react';

// Main component for the Layer and Segment Tab
const LayerSegTab = () => {
    // Initial state for the layers, mimicking the provided image
    const initialLayers = [
        { id: 1, name: 'Gutter-GU1', color: '#3b82f6' },
        { id: 2, name: 'Wall-WL5', color: '#2dd4bf' },
        { id: 3, name: 'Wall-WL4', color: '#2dd4bf' },
        { id: 4, name: 'Wall-WL2', color: '#2dd4bf' },
        { id: 5, name: 'Wall-WL3', color: '#2dd4bf' },
        { id: 6, name: 'Wall-WL1', color: '#2dd4bf' },
        { id: 7, name: 'Column-CL1', color: '#3b82f6' },
        { id: 8, name: 'Roof-RF1', color: '#facc15' },
        { id: 9, name: 'Roof-RF2', color: '#facc15' },
        { id: 10, name: 'Trim-TR2', color: '#f97316' },
        { id: 11, name: 'Trim-TR3', color: '#f97316' },
        { id: 12, name: 'Trim-TR1', color: '#f97316' },
        { id: 13, name: 'Trim-TR4', color: '#f97316' },
        { id: 14, name: 'Trim-TR5', color: '#f97316' },
    ];

    const [layers, setLayers] = useState(initialLayers);
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

    // Ref for the dropdown menu to detect outside clicks
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    // --- New Drag and Drop Handlers for a Smoother Experience ---

    const handleDragStart = (e: React.DragEvent<HTMLLIElement>, index: number) => {
        setDraggedItemIndex(index);
        // This makes the drag operation look better
        e.dataTransfer.effectAllowed = 'move';
        // Hides the default drag ghost image
        e.dataTransfer.setDragImage(e.currentTarget, -10, -10); 
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLLIElement>, index: number) => {
        e.preventDefault(); // Necessary to allow dropping
        if (draggedItemIndex === null || draggedItemIndex === index) {
            return; // Don't replace the item with itself
        }
    
        // Create a new copy of the layers array
        const items = [...layers];
        // Remove the dragged item from its original position
        const [draggedItemContent] = items.splice(draggedItemIndex, 1);
        // Insert the dragged item into the new position
        items.splice(index, 0, draggedItemContent);
    
        // Update the state with the new order and update the index of the item being dragged
        setLayers(items);
        setDraggedItemIndex(index);
    };
    
    const handleDragEnd = () => {
        // Reset the dragged item index when the drag operation ends
        setDraggedItemIndex(null);
    };

    // --- End of New Drag and Drop Handlers ---

    // Function to toggle the dropdown menu visibility
    const toggleDropdown = (id: number) => {
        setOpenDropdownId(openDropdownId === id ? null : id);
    };

    // Effect to handle clicks outside the dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdownId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    // SVG Icon Components
    const DragHandleIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-move text-gray-500">
             <polyline points="15 3 21 3 21 9"></polyline>
             <polyline points="9 21 3 21 3 15"></polyline>
             <line x1="21" y1="3" x2="14" y2="10"></line>
             <line x1="3" y1="21" x2="10" y2="14"></line>
        </svg>
    );

    const MoreIcon = () => (
         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
             <circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle>
         </svg>
    );

    // Dropdown menu component
    const DropdownMenu = ({ layerId }: { layerId: number }) => {
        const menuItems = [
            'Bring to Front', 'Send to Back', 'Bring Forward', 
            'Send Backward', 'Duplicate Object', 'Delete'
        ];
        
        const handleItemClick = (item: string) => {
            console.log(`${item} clicked for layer ID: ${layerId}`);
            setOpenDropdownId(null); // Close dropdown after action
        };

        return (
            <div ref={dropdownRef} className="absolute right-2 top-14 z-10 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                <ul className="py-1">
                    {menuItems.map((item, index) => (
                         <li key={index} 
                             onClick={() => handleItemClick(item)}
                             className={`px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer ${item === 'Delete' ? 'text-red-600 hover:bg-red-50' : ''}`}
                         >
                            {item}
                         </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div className="w-full  mx-auto border border-gray-200 font-sans">
          
            <ul className="py-2">
                {layers.map((layer, index) => (
                    <li
                        key={layer.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`flex items-center justify-between px-4 py-3 transition-all duration-200 ease-in-out relative
                            ${draggedItemIndex === index ? 'opacity-50 bg-blue-100 shadow-lg scale-105' : 'bg-white hover:bg-gray-50'}`
                        }
                    >
                        <div className="flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: layer.color }}></span>
                            <span className="text-gray-800">{layer.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <DragHandleIcon />
                            <button onClick={() => toggleDropdown(layer.id)} className="focus:outline-none">
                                <MoreIcon />
                            </button>
                        </div>
                        {openDropdownId === layer.id && <DropdownMenu layerId={layer.id} />}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default LayerSegTab;

