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

    const onsubmitHandler = async (event) => {
        event.preventDefault();
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
        }
    }

  return (
    <div onClick={() => setShowLogin(false)} className="fixed inset-0 z-100 flex items-center justify-center text-sm text-gray-500 bg-black/50">

       
        <form onSubmit={onsubmitHandler} onClick={(e) => e.stopPropagation()} className="flex flex-col gap-4 items-start p-8 py-12 w-80 sm:w-88 text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white">
            <p className="text-2xl font-medium m-auto">
                <span className="text-primary">User</span> {state === "login" ? "Login" : state === "register" ? "Sign Up" : state === 'forgot' ? 'Password Reset' : 'Two-Factor Check'}
            </p>
            {state === "register" && (
                <div className="w-full">
                    <p>Name</p>
                    <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
                </div>
            )}
            {state !== 'two-factor' && <div className="w-full ">
                <p>Email</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="email" required />
            </div>}
            {state !== 'forgot' && state !== 'two-factor' && <div className="w-full ">
                <p>Password</p>
                <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="password" minLength={state === 'register' ? 8 : undefined} required />
            </div>}
            {state === 'two-factor' && <div className="w-full"><p>Authenticator code</p><input value={twoFactorCode} onChange={(e) => setTwoFactorCode(e.target.value)} className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" inputMode="numeric" maxLength="6" required autoFocus /></div>}
            {state === "register" ? (
                <p>
                    Already have account? <span onClick={() => setState("login")} className="text-primary cursor-pointer">click here</span>
                </p>
            ) : state === 'login' ? (
                <p>
                    <span onClick={() => setState('forgot')} className="text-primary cursor-pointer">Forgot password?</span><br/>
                    Create an account? <span onClick={() => setState("register")} className="text-primary cursor-pointer">click here</span>
                </p>
            ) : state === 'forgot' ? <p>Remembered it? <span onClick={() => setState('login')} className="text-primary cursor-pointer">Login</span></p> : null}
            <button className="bg-primary hover:bg-blue-800 transition-all text-white w-full py-2 rounded-md cursor-pointer">
                {state === "register" ? "Create Account" : state === 'forgot' ? 'Send reset link' : state === 'two-factor' ? 'Verify code' : 'Login'}
            </button>
        </form>

    </div>
  )
}
export default Login

