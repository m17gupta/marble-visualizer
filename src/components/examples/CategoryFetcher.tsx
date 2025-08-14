import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchAllCategories } from '@/redux/slices/swatch/FilterSwatchSlice';

const CategoryFetcher: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { category, isLoading, isFeetching } = useSelector((state: RootState) => state.filterSwatch);

  // Example: Fetch categories by name
  useEffect(() => {
    const categoryNames = ['Paint', 'Primer', 'Stain']; // Example category names
    dispatch(fetchAllCategories(categoryNames));
  }, [dispatch]);

  const handleFetchSpecificCategories = () => {
    const specificCategories = ['Exterior Paint', 'Interior Paint'];
    dispatch(fetchAllCategories(specificCategories));
  };

  if (isLoading || isFeetching) {
    return <div>Loading categories...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Fetched Categories</h2>
      
      <button 
        onClick={handleFetchSpecificCategories}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Fetch Specific Categories
      </button>

      {category && category.length > 0 ? (
        <ul className="space-y-2">
          {category.map((cat) => (
            <li key={cat.id} className="p-2 border rounded">
              <h3 className="font-semibold">{cat.title}</h3>
              <p className="text-sm text-gray-600">{cat.description}</p>
              <span className={`text-xs px-2 py-1 rounded ${cat.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {cat.status ? 'Active' : 'Inactive'}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No categories found</p>
      )}
    </div>
  );
};

export default CategoryFetcher;
