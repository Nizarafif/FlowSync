import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../../store';
import { authService } from '../../services/supabase';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Mail, ArrowLeft, ArrowRight, Building } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().min(2, 'Company name must be at least 2 characters'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const registerStore = useAppStore((state) => state.register);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      // Call Supabase SignUp API
      await authService.signUp(data.email, data.name);
      // Register in Zustand store
      registerStore(data.email, data.name, data.company);
      // Direct user to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed. Please try again.');
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
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Create your Account</h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Start managing your workspace projects instantly.
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
          label="Your Full Name"
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

        <Input
          {...register('company')}
          label="Company Name"
          placeholder="e.g. FlowSync Inc."
          leftIcon={<Building className="h-4 w-4" />}
          error={errors.company?.message}
          className="text-white"
        />

        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full justify-center mt-6"
        >
          Create Workspace
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <div className="text-center text-xs text-slate-400 pt-2 border-t border-white/5">
        Already have an account?{' '}
        <Link to="/auth/login" className="text-primary hover:underline font-semibold">
          Sign In
        </Link>
      </div>
    </div>
  );
};
export default Register;
