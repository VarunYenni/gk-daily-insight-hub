import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/components/auth/AuthProvider";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

import HomePage from "./pages/HomePage";
import AuthPage from "@/components/auth/AuthPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import SummaryPage from "./pages/SummaryPage";
import BookmarksPage from "./pages/BookmarksPage";
import QuizPage from "./pages/QuizPage";
import DigestsPage from "./pages/DigestsPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-background">
              <Header />
              <main className="min-h-screen">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/summary/:id" element={<SummaryPage />} />
                  <Route 
                    path="/bookmarks" 
                    element={
                      <ProtectedRoute>
                        <BookmarksPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/quiz" 
                    element={
                      <ProtectedRoute>
                        <QuizPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/digests" 
                    element={
                      <ProtectedRoute>
                        <DigestsPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route
                    path="/forgot-password"
                    element={
                      <ForgotPasswordPage />
                    }
                  />
                    <Route
                        path="/reset-password"
                        element={
                         <ResetPasswordPage />
                        }
                    />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Navigation />
            </div>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
