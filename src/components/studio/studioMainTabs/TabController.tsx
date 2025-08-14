import { useInspirationTab } from "@/hooks/useInspirationTab";

export function TabController() {
  const { currentTab, changeTab, isTabActive } = useInspirationTab();

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Tab Controller</h3>
      
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Current Tab: <span className="font-medium">{currentTab}</span></p>
        
        <div className="flex gap-2">
          <button
            onClick={() => changeTab("chat")}
            className={`px-3 py-1 rounded text-sm ${
              isTabActive("chat") 
                ? "bg-blue-500 text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Go to Chat
          </button>
          
          <button
            onClick={() => changeTab("renovation")}
            className={`px-3 py-1 rounded text-sm ${
              isTabActive("renovation") 
                ? "bg-blue-500 text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Go to Play
          </button>
          
          <button
            onClick={() => changeTab("history")}
            className={`px-3 py-1 rounded text-sm ${
              isTabActive("history") 
                ? "bg-blue-500 text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Go to History
          </button>
        </div>
        
        <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
          <p><strong>Tab Status:</strong></p>
          <ul className="mt-1 space-y-1">
            <li>Chat: {isTabActive("chat") ? "✅ Active" : "❌ Inactive"}</li>
            <li>Play: {isTabActive("renovation") ? "✅ Active" : "❌ Inactive"}</li>
            <li>History: {isTabActive("history") ? "✅ Active" : "❌ Inactive"}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
