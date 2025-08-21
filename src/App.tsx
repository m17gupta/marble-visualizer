import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "next-themes";
import { store } from "./redux/store";
import { initializeAuth } from "./redux/slices/authSlice";
import { AppRouter } from "./routes/AppRouter";
// import { ConnectionStatus } from "@/components/ConnectionStatus";
import { Toaster } from "@/components/ui/sonner";
import ReduxDebugger from "./components/ui/ReduxDebugger";

function App() {
  useEffect(() => {
    // Initialize auth state on app start
    store.dispatch(initializeAuth());
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "http://localhost:3001/embed/anythingllm-chat-widget.min.js";
    script.async = true;
    script.setAttribute(
      "data-embed-id",
      "95f4f753-0fc8-407e-a0dc-b7e1fa86c812"
    );
    script.setAttribute("data-base-api-url", "http://localhost:3001/api/embed");

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // cleanup when component unmounts
    };
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
