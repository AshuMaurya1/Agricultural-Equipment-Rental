import React from 'react'
import { useAppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Login = () => {
    const { setShowLogin, setToken, axios } = useAppContext()
    const navigate = useNavigate()
    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [twoFactorCode, setTwoFactorCode] = React.useState("");
    const [challengeToken, setChallengeToken] = React.useState("");
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const onsubmitHandler = async (event) => {
        event.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            if (state === 'forgot') {
                const { data } = await axios.post('/api/user/forgot-password', { email })
                if (data.success) {
                    toast.success(data.message)
                    setState('login')
                } else toast.error(data.message)
                return
            }
            if (state === 'two-factor') {
                const { data } = await axios.post('/api/user/login/2fa', { challengeToken, code: twoFactorCode })
                if (!data.success) return toast.error(data.message)
                setToken(data.token)
                setShowLogin(false)
                navigate('/')
                return
            }
            const { data } = await axios.post(`/api/user/${state}`, { name, email, password })
            if (data.requiresTwoFactor) {
                setChallengeToken(data.challengeToken)
                setState('two-factor')
                return
            }
            if (data.success) {
                setToken(data.token)
                setShowLogin(false)
                if (data.suspiciousLogin) {
                    toast('New device detected. Review your active sessions in Security Sessions.', { icon: '⚠️' })
                }
                navigate('/')
            } else {
                toast.error(data.message || 'Authentication failed')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div onClick={() => !isSubmitting && setShowLogin(false)} className="fixed inset-0 z-100 flex items-start sm:items-center justify-center overflow-y-auto p-4 text-sm text-stone-600 bg-black/60 backdrop-blur-xs">
            <form onSubmit={onsubmitHandler} onClick={(e) => e.stopPropagation()} className="my-auto flex w-full max-w-sm flex-col gap-4 items-start p-6 sm:p-8 text-stone-600 rounded-3xl shadow-2xl border border-stone-200 bg-white">
                <p className="text-2xl font-black m-auto text-slate-900">
                    <span className="text-emerald-700">Tractor</span>{state === "login" ? "Hub Login" : state === "register" ? "Hub Sign Up" : state === 'forgot' ? "Hub Reset" : "Security Check"}
                </p>
                {state === "register" && (
                    <div className="w-full">
                        <p className="text-xs font-bold text-stone-700 mb-1">Full Name</p>
                        <input onChange={(e) => setName(e.target.value)} value={name} placeholder="Farmer Name" className="border border-stone-200 rounded-xl w-full p-2.5 text-xs outline-none focus:border-emerald-600 bg-stone-50" type="text" required disabled={isSubmitting} />
                    </div>
                )}
                {state !== 'two-factor' && (
                    <div className="w-full">
                        <p className="text-xs font-bold text-stone-700 mb-1">Email Address</p>
                        <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="kisan@example.com" className="border border-stone-200 rounded-xl w-full p-2.5 text-xs outline-none focus:border-emerald-600 bg-stone-50" type="email" required disabled={isSubmitting} />
                    </div>
                )}
                {state !== 'forgot' && state !== 'two-factor' && (
                    <div className="w-full">
                        <p className="text-xs font-bold text-stone-700 mb-1">Password</p>
                        <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="••••••••" className="border border-stone-200 rounded-xl w-full p-2.5 text-xs outline-none focus:border-emerald-600 bg-stone-50" type="password" minLength={state === 'register' ? 8 : undefined} required disabled={isSubmitting} />
                    </div>
                )}
                {state === 'two-factor' && (
                    <div className="w-full">
                        <p className="text-xs font-bold text-stone-700 mb-1">Authenticator Code (6 digits)</p>
                        <input value={twoFactorCode} onChange={(e) => setTwoFactorCode(e.target.value)} className="border border-stone-200 rounded-xl w-full p-2.5 text-xs outline-none focus:border-emerald-600 bg-stone-50" inputMode="numeric" maxLength="6" required autoFocus disabled={isSubmitting} />
                    </div>
                )}
                {state === "register" ? (
                    <p className="text-xs">
                        Already have an account? <span onClick={() => !isSubmitting && setState("login")} className="text-emerald-700 font-bold cursor-pointer hover:underline">Log in here</span>
                    </p>
                ) : state === 'login' ? (
                    <p className="text-xs">
                        <span onClick={() => !isSubmitting && setState('forgot')} className="text-emerald-700 font-bold cursor-pointer hover:underline">Forgot password?</span><br/>
                        Need an account? <span onClick={() => !isSubmitting && setState("register")} className="text-emerald-700 font-bold cursor-pointer hover:underline">Register here</span>
                    </p>
                ) : state === 'forgot' ? (
                    <p className="text-xs">Remembered it? <span onClick={() => !isSubmitting && setState('login')} className="text-emerald-700 font-bold cursor-pointer hover:underline">Login</span></p>
                ) : null}
                <button disabled={isSubmitting} className="flex min-h-11 items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 transition-all text-white w-full py-2.5 rounded-2xl font-extrabold cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 shadow-sm shadow-emerald-700/20 text-xs">
                    {isSubmitting && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />}
                    {isSubmitting ? (state === "register" ? "Creating account..." : state === 'forgot' ? 'Sending link...' : state === 'two-factor' ? 'Verifying...' : 'Logging in...') : (state === "register" ? "Create Account" : state === 'forgot' ? 'Send reset link' : state === 'two-factor' ? 'Verify code' : 'Sign In')}
                </button>
            </form>
        </div>
    )
}

export default Login
