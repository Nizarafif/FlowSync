import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../../store';
import { authService } from '../../services/supabase';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Mail, ArrowLeft, ArrowRight } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const loginStore = useAppStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'alex@flowsync.io',
      name: 'Alex Rivera',
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      // Call Supabase / Mock authenticator service
      await authService.signIn(data.email);
      // Save user to Zustand store
      loginStore(data.email, data.name);
      // Navigate to main application dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center sm:text-left">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-2">
          <ArrowLeft className="h-3 w-3" />
          Back to Home
        </Link>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Sign In to FlowSync</h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Enter your name and email to access your workspace instantly.
        </p>
      </div>

      {authError && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register('name')}
          label="Your Name"
          placeholder="e.g. Alex Rivera"
          error={errors.name?.message}
          className="text-white"
        />

        <Input
          {...register('email')}
          label="Email Address"
          type="email"
          placeholder="e.g. alex@flowsync.io"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          className="text-white"
        />

        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full justify-center mt-6"
        >
          Sign In
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <div className="text-center text-xs text-slate-400 pt-2 border-t border-white/5">
        Don't have an account?{' '}
        <Link to="/auth/register" className="text-primary hover:underline font-semibold">
          Create an Account
        </Link>
      </div>
    </div>
  );
};
export default Login;
