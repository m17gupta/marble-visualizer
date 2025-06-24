import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "next-themes";
import { store } from "./redux/store";
import { initializeAuth } from "./redux/slices/authSlice";
import { AppRouter } from "./routes/AppRouter";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { Toaster } from "@/components/ui/sonner";

function App() {
  useEffect(() => {
    // Initialize auth state on app start
    store.dispatch(initializeAuth());
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <BrowserRouter>
          {/* Show connection status in development
          {import.meta.env.DEV && (
            <div className="fixed top-[54px] right-4 z-50 w-80">
              <ConnectionStatus />
            </div>
          )} */}

          <AppRouter />
          <Toaster />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
