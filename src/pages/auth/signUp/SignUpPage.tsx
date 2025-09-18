import { useState, useEffect } from "react";
import bgImage from "../../../../public/assets/marble/pexels-itsterrymag-2631746.jpg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AppDispatch, RootState } from "@/redux/store";
import { signUpUser, clearError } from "@/redux/slices/user/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Eye,
  EyeOff,
  Mail,
  Lock,
  UserPlus,
  ArrowLeft,
  User,
  Phone,

} from "lucide-react";
import { setProfile } from "@/redux/slices/user/userProfileSlice";
import GetPlanFeatures from "@/components/planfeatures/GetPlanFeatures";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Navigation from "@/components/homepage/new/Navigation";

// Form validation schema
const signUpSchema = z
  .object({
    full_name: z
      .string()
      .min(1, "Full name is required")
      .min(2, "Full name must be at least 2 characters")
      .max(50, "Full name must be less than 50 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one lowercase letter, one uppercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    phone: z
      .string()
      .optional()
      .refine((phone) => {
        if (!phone || phone.trim() === '') return true;
        return /^[+]?[\d\s\-()]{10,}$/.test(phone);
      }, "Please enter a valid phone number"),
    role: z
      .enum(["admin", "designer", "viewer", "vendor", "user"])
      .optional()
      .default("user"),
    dob: z
      .string()
      .optional()
      .refine((date) => {
        if (!date) return true;
        const birthDate = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        return age >= 13 && age <= 120;
      }, "You must be at least 13 years old"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

const roleOptions = [
  { value: "user", label: "User", description: "Basic user access" },
  // { value: "designer", label: "Designer", description: "Design and create projects" },
  // { value: "viewer", label: "Viewer", description: "View-only access" },
  // { value: "vendor", label: "Vendor", description: "Material supplier" },
  // { value: "admin", label: "Admin", description: "Administrative access" },
];

export function SignUpPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const [showPassword, setShowPassword] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      role: "user",
      dob: "",
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

  const onSubmit = async (values: SignUpFormValues) => {
    dispatch(clearError());
    
    const signUpData = {
      email: values.email,
      password: values.password,
      full_name: values.full_name,
      phone: values.phone,
      role: values.role,
    };

    const result = await dispatch(signUpUser(signUpData));
      console.log("Sign up result:", result);
    if (signUpUser.fulfilled.match(result)) {
      if (result.payload.profile) {
        // Handle error from signUpUser
        dispatch(setProfile(result.payload.profile));
      }
      
      navigate("/projects", { replace: true });
    }
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
                <CardHeader className="space-y-4 pb-6 pt-6">
                  <div
                    className="w-12 flex items-center justify-center m-auto cursor-pointer"
                    // onClick={handleHomeClick}
                    >
                    <img
                      src={marbleLogo}
                      title="https://betadzinly.s3.us-east-2.amazonaws.com/assets/images/logo-icon.svg"
                      alt="Dzinly Logo"></img>
                  </div>
                  {/* </motion.div> */}
                  <div className="text-center space-y-2">
                    <CardTitle className="text-2xl font-bold">Create Account </CardTitle>

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
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Full Name *
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            placeholder="Enter your full name"
                            className="pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                            disabled={isLoading}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Email Address *
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            type="email"
                            placeholder="Enter your email"
                            className="pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                            disabled={isLoading}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                  {/* Role */}
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Account Type
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={isLoading}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Select your role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {roleOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  <div>
                                    <div className="font-medium">{option.label}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {option.description}
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                      <FormLabel className="text-sm font-medium">
                        Password *
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            className="pl-10 pr-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                          >
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

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Confirm Password *
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            className="pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                            disabled={isLoading}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Advanced Options Toggle */}
                <div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-xs text-muted-foreground hover:text-primary p-0 h-auto"
                  >
                    {showAdvanced ? "Hide" : "Show"} Advanced Options
                  </Button>
                </div>

                {/* Advanced Options */}
                {showAdvanced && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 border-t pt-4"
                  >
                    {/* Phone */}
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Phone Number (Optional)
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                {...field}
                                type="tel"
                                placeholder="Enter your phone number"
                                className="pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                disabled={isLoading}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                  

                    {/* Date of Birth */}
                    {/* <FormField
                      control={form.control}
                      name="dob"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Date of Birth (Optional)
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                {...field}
                                type="date"
                                className="pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                disabled={isLoading}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    /> */}
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="pt-0"
                >
                  <Button
                    type="submit"
                    className="w-full h-11 text-sm font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Create Account

                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </Form>

            {/* Terms and Privacy */}
            {/* <div className="text-center text-xs text-muted-foreground">
              <p>
                By creating an account, you agree to our{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div> */}

            {/* Already have account */}
            <div className="text-center text-sm text-muted-foreground m-0 p-0">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                Sign in here
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
