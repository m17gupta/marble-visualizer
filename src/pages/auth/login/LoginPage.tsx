import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AppDispatch, RootState } from "@/redux/store";
import { loginUser, clearError, AuthState } from "@/redux/slices/user/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import bgImage from "../../../../public/assets/marble/pexels-itsterrymag-2631746.jpg";
import marbleLogo from "../../../../public/assets/marble/main-favicons.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import italian from "../../../../public/assets/marble/italian-marble.jpg";
import GetPlanFeatures from "@/components/planfeatures/GetPlanFeatures";
import Navigation from "@/components/homepage/new/Navigation";

// Form validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
const { isLoading, isAuthenticated, error } = useSelector(
  (state: { auth: AuthState }) => state.auth
);

  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/projects", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear error when form values change
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (values: LoginFormValues) => {
    dispatch(clearError());
    const result = await dispatch(
      loginUser({
        email: values.email,
        password: values.password,
      })
    );

    if (loginUser.fulfilled.match(result)) {
      // dispatch(addbreadcrumb("Projects"));
      navigate("/projects", { replace: true });
    }
  };

  const handleHomeClick = () => {
    console.log("Navigating to home");
    navigate("/", { replace: false });
  };

  return (
    <>


<Navigation/>

      <GetPlanFeatures/>
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[60%_40%] bg-muted/20">
          {/* Left: Image */}
          <div className="hidden lg:block h-full w-full">
            <LazyLoadImage
              src={bgImage}
              alt="Login visual"
              className="object-cover h-full w-full"
            />
          </div>

          {/* Right: Login Card */}
          <div className="flex items-center justify-center px-6 py-10">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-md">
              <Card className="border-0 bg-card/50 shadow-none backdrop-blur-sm">
                <CardHeader className="space-y-4 pb-8 pt-8">
                  <div
                    className="w-12 flex items-center justify-center m-auto cursor-pointer"
                    onClick={handleHomeClick}>
                    <img
                      src={marbleLogo}
                      title="https://betadzinly.s3.us-east-2.amazonaws.com/assets/images/logo-icon.svg"
                      alt="Dzinly Logo"></img>
                  </div>
                  {/* </motion.div> */}
                  <div className="text-center space-y-2">
                    <CardTitle className="text-2xl font-bold">Login </CardTitle>
                    <CardDescription className="text-muted-foreground ">
                      Hello! let's join with us
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.3 }}>
                      <Alert variant="destructive">
                        <AlertDescription className="text-sm">
                          {error}
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4">
                      {/* Email */}
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email*</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  {...field}
                                  type="email"
                                  placeholder="carlos@dzinly.com"
                                  className="pl-10 h-11"
                                  disabled={isLoading}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />

                      {/* Password */}
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password*</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  {...field}
                                  type={showPassword ? "text" : "password"}
                                  placeholder="••••••••"
                                  className="pl-10 pr-10 h-11"
                                  disabled={isLoading}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-11 px-3"
                                  onClick={() => setShowPassword(!showPassword)}
                                  disabled={isLoading}>
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />

                      {/* Submit */}
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}>
                        <Button
                          type="submit"
                          className="w-full h-11 text-sm font-medium"
                          disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Signing in...
                            </>
                          ) : (
                            <>
                              <LogIn className="mr-2 h-4 w-4" />
                              Log In
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </form>
                  </Form>

                  {/* Forgot + Create */}
                  <div className="text-center text-sm">
                    <Link
                      to="/forgot-password"
                      className="text-blue-600 hover:underline">
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    Don’t have an account?{" "}
                    <Link
                      to="/signup"
                      className="text-primary hover:underline font-medium">
                      Create Account 
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
    </>
  );
}
