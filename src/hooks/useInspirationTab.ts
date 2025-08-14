import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { AppDispatch, RootState } from '@/redux/store';
import { setCurrentInspTab } from '@/redux/slices/InspirationalSlice/InspirationTabSlice';

export const useInspirationTab = (defaultTab: string = 'chat') => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentInspTab } = useSelector((state: RootState) => state.inspirationTab);
  const [currentTab, setCurrentTab] = useState<string>(defaultTab);

  // Sync local state with Redux state
  useEffect(() => {
    if (currentInspTab) {
      setCurrentTab(currentInspTab);
    } else {
      setCurrentTab(defaultTab);
      dispatch(setCurrentInspTab(defaultTab));
    }
  }, [currentInspTab, defaultTab, dispatch]);

  // Handle tab change
  const handleTabChange = useCallback((value: string) => {
    setCurrentTab(value);
    dispatch(setCurrentInspTab(value));
  }, [dispatch]);

  // Programmatically change tab
  const changeTab = useCallback((tabValue: string) => {
    handleTabChange(tabValue);
  }, [handleTabChange]);

  return {
    currentTab,
    handleTabChange,
    changeTab,
    isTabActive: (tabValue: string) => currentTab === tabValue,
  };
};
