import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "next-themes";
import { store } from "./redux/store";
import { initializeAuth } from "./redux/slices/user/authSlice";
import { AppRouter } from "./routes/AppRouter";
// import { ConnectionStatus } from "@/components/ConnectionStatus";
import { Toaster } from "@/components/ui/sonner";
import ReduxDebugger from "./components/ui/ReduxDebugger";

function App() {
  useEffect(() => {
    // Initialize auth state on app start
    store.dispatch(initializeAuth());
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <BrowserRouter>
          <AppRouter />
          <Toaster />
          {/* Redux State Debugger (only shown in development) */}
          <ReduxDebugger />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
