"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner"; // Assuming Sonner is installed via Shadcn
import { Loader2 } from "lucide-react";

export function AuthCard() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // --- Sign In Logic ---
        const { error } = await authClient.signIn.email({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw new Error(error.message || "Login failed");
        
        toast.success("Welcome back to QuizMint!");
        router.push("/admin"); // Redirect to dashboard
      } else {
        // --- Sign Up Logic ---
        const { error } = await authClient.signUp.email({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        if (error) throw new Error(error.message || "Registration failed");
        
        toast.success("Account created successfully!");
        router.push("/admin");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-muted/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight text-center">
          {isLogin ? "Welcome back" : "Create an account"}
        </CardTitle>
        <CardDescription className="text-center">
          {isLogin ? "Enter your email to access your quizzes" : "Get started with interactive quizzes today"}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="John Doe" 
                required 
                disabled={isLoading}
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@example.com" 
              required 
              disabled={isLoading}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {isLogin && (
                <button type="button" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Forgot password?
                </button>
              )}
            </div>
            <Input 
              id="password" 
              type="password" 
              required 
              disabled={isLoading}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isLogin ? "Sign In" : "Sign Up"}
          </Button>
        </form>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-4 border-t px-6 py-4">
        <div className="text-sm text-center text-muted-foreground">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-primary hover:underline"
            disabled={isLoading}
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}
