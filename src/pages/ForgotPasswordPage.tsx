import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft } from 'lucide-react';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) {
                toast({
                    title: 'Error',
                    description: error.message,
                    variant: 'destructive'
                });
            } else {
                setSent(true);
                toast({
                    title: 'Password reset email sent',
                    description: 'Please check your email for a password reset link'
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'An unexpected error occurred',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-center">Check Your Email</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <p className="text-muted-foreground">
                            We've sent a password reset link to {email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Didn't receive the email? Check your spam folder or try again.
                        </p>
                        <div className="space-y-2">
                            <Button
                                variant="outline"
                                onClick={() => setSent(false)}
                                className="w-full"
                            >
                                Try Again
                            </Button>
                            <Button
                                variant="link"
                                onClick={() => navigate('/auth')}
                                className="w-full"
                            >
                                Back to Sign In
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate('/auth')}
                        >
                            <ArrowLeft size={20} />
                        </Button>
                        <CardTitle>Reset Password</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>
                        </div>
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ForgotPasswordPage;