import { Eye, EyeOff, LoaderCircle, LockKeyhole, LogIn, Mail } from 'lucide-react';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { saveProfile } from '../lib/api';
import { isFirebaseConfigured } from '../lib/firebase';

export default function AuthPage() {
  const { user, signIn, signUp, signInWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (user) {
    return <Navigate to="/app" replace />;
  }

  const primaryLabel = mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link';

  const openSignup = () => setMode('signup');
  const openSignin = () => setMode('signin');
  const openReset = () => setMode('reset');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (mode === 'signin') {
        await signIn(email, password);
        navigate('/app');
      } else if (mode === 'signup') {
        if (!name.trim()) {
          throw new Error('Name is required for sign up');
        }

        if (password !== confirmPassword) {
          throw new Error('Password and confirm password must match');
        }

        await signUp(email, password);
        await saveProfile({ email, displayName: name.trim() });
        navigate('/app');
      } else {
        await resetPassword(email);
        setMessage('Password reset email sent.');
      }
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-shell min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="auth-frame w-full rounded-[2.3rem] p-4 sm:p-6 lg:p-7">
          <div className="grid gap-5 lg:grid-cols-[1.12fr_0.88fr] lg:items-stretch">
            <section className="auth-left-panel overflow-hidden rounded-[1.8rem] border border-slate-900/20 bg-slate-950">
              <div className="auth-image-panel h-[320px] w-full sm:h-[460px] lg:h-full lg:min-h-[560px]" />
            </section>

            <section className="auth-right-panel rounded-[1.8rem] border border-slate-900/30 bg-white p-3 sm:p-4">
              <div className="auth-right-top rounded-[1.45rem] border border-white/10 p-3 sm:p-4">
                {!isFirebaseConfigured ? (
                  <div className="mb-4 rounded-2xl border border-amber-300/30 bg-amber-400/10 p-3 text-xs text-amber-100">
                    Firebase environment variables are not configured yet.
                  </div>
                ) : null}

                <div className="auth-mode-switch mb-4 rounded-full border border-white/10 bg-white/5 p-1">
                  <div className="auth-mode-grid grid grid-cols-3 gap-1">
                    {[
                      { key: 'signin', label: 'Sign In' },
                      { key: 'signup', label: 'Sign Up' },
                      { key: 'reset', label: 'Forgot' }
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setMode(item.key as typeof mode)}
                        className={`auth-mode-btn rounded-full px-3 py-3 text-xs font-semibold transition sm:px-4 sm:text-sm ${mode === item.key ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  {mode === 'signup' ? (
                    <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/80">
                      <span className="text-sm">@</span>
                      <input
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Full name"
                        className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                      />
                    </label>
                  ) : null}

                  <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/80">
                    <Mail size={16} />
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Email address"
                      className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                    />
                  </label>

                  {mode !== 'reset' ? (
                    <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/80">
                      <LockKeyhole size={16} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Password"
                        className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        className="text-slate-300 transition hover:text-white"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </label>
                  ) : null}

                  {mode === 'signup' ? (
                    <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/80">
                      <LockKeyhole size={16} />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        placeholder="Confirm password"
                        className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((current) => !current)}
                        className="text-slate-300 transition hover:text-white"
                        aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                        title={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </label>
                  ) : null}

                  {error ? <p className="rounded-2xl border border-rose-300/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error}</p> : null}
                  {message ? <p className="rounded-2xl border border-emerald-300/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">{message}</p> : null}

                  <button
                    type="submit"
                    disabled={loading}
                    className="auth-primary-btn inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:opacity-70"
                  >
                    {loading ? <LoaderCircle size={16} className="animate-spin" /> : <LogIn size={16} />}
                    {primaryLabel}
                  </button>
                </form>
              </div>

              <div className="auth-or-divider py-4 text-center font-['Orbitron'] text-5xl leading-none tracking-[0.14em] text-slate-200">OR</div>

              <div className="flex justify-center pb-2">
                <button
                  type="button"
                  onClick={async () => {
                    await signInWithGoogle();
                    navigate('/app');
                  }}
                  aria-label="Continue with Google"
                  title="Continue with Google"
                  className="google-round-btn"
                >
                  <img src="/google.png" alt="Google" className="google-round-icon" />
                </button>
              </div>

              <div className="auth-helper-row mt-4 flex items-center justify-center gap-3 text-sm text-slate-300">
                {mode === 'signup' ? (
                  <button type="button" onClick={openSignin} className="font-semibold text-slate-200 hover:text-white">
                    Already have an account?
                  </button>
                ) : (
                  <button type="button" onClick={openSignup} className="font-semibold text-slate-200 hover:text-white">
                    Need an account?
                  </button>
                )}

                <button type="button" onClick={openReset} className="font-semibold text-cyan-300 hover:text-cyan-200">
                  Forgot
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}