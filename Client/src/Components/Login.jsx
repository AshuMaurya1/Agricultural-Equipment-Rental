import React from 'react'
import { useAppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Login = () => {

    const { setShowLogin, setToken, axios} = useAppContext()
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
        try{
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
    <div onClick={() => !isSubmitting && setShowLogin(false)} className="fixed inset-0 z-100 flex items-start sm:items-center justify-center overflow-y-auto p-4 text-sm text-gray-500 bg-black/50">

       
        <form onSubmit={onsubmitHandler} onClick={(e) => e.stopPropagation()} className="my-auto flex w-full max-w-sm flex-col gap-4 items-start p-5 sm:p-8 sm:py-12 text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white">
            <p className="text-2xl font-medium m-auto">
                <span className="text-primary">User</span> {state === "login" ? "Login" : state === "register" ? "Sign Up" : state === 'forgot' ? 'Password Reset' : 'Two-Factor Check'}
            </p>
            {state === "register" && (
                <div className="w-full">
                    <p>Name</p>
                    <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required disabled={isSubmitting} />
                </div>
            )}
            {state !== 'two-factor' && <div className="w-full ">
                <p>Email</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="email" required disabled={isSubmitting} />
            </div>}
            {state !== 'forgot' && state !== 'two-factor' && <div className="w-full ">
                <p>Password</p>
                <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="password" minLength={state === 'register' ? 8 : undefined} required disabled={isSubmitting} />
            </div>}
            {state === 'two-factor' && <div className="w-full"><p>Authenticator code</p><input value={twoFactorCode} onChange={(e) => setTwoFactorCode(e.target.value)} className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" inputMode="numeric" maxLength="6" required autoFocus disabled={isSubmitting} /></div>}
            {state === "register" ? (
                <p>
                    Already have account? <span onClick={() => !isSubmitting && setState("login")} className="text-primary cursor-pointer">click here</span>
                </p>
            ) : state === 'login' ? (
                <p>
                    <span onClick={() => !isSubmitting && setState('forgot')} className="text-primary cursor-pointer">Forgot password?</span><br/>
                    Create an account? <span onClick={() => !isSubmitting && setState("register")} className="text-primary cursor-pointer">click here</span>
                </p>
            ) : state === 'forgot' ? <p>Remembered it? <span onClick={() => !isSubmitting && setState('login')} className="text-primary cursor-pointer">Login</span></p> : null}
            <button disabled={isSubmitting} className="flex min-h-10 items-center justify-center gap-2 bg-primary hover:bg-blue-800 transition-all text-white w-full py-2 rounded-md cursor-pointer disabled:cursor-not-allowed disabled:opacity-70">
                {isSubmitting && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />}
                {isSubmitting ? (state === "register" ? "Creating account..." : state === 'forgot' ? 'Sending link...' : state === 'two-factor' ? 'Verifying...' : 'Logging in...') : (state === "register" ? "Create Account" : state === 'forgot' ? 'Send reset link' : state === 'two-factor' ? 'Verify code' : 'Login')}
            </button>
        </form>

    </div>
  )
}
export default Login

