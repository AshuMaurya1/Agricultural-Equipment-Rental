import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAppContext } from '../context/AppContext'

const ResetPassword = () => {
  const { axios } = useAppContext()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const submit = async (event) => {
    event.preventDefault()
    if (password !== confirmPassword) return toast.error('Passwords do not match')
    try {
      const { data } = await axios.post('/api/user/reset-password', { token: params.get('token'), password })
      if (!data.success) return toast.error(data.message)
      toast.success(data.message)
      navigate('/')
    } catch (error) { toast.error(error.response?.data?.message || error.message) }
  }

  return <main className="max-w-md mx-auto px-6 py-16 min-h-[65vh]"><h1 className="text-2xl font-bold text-gray-900">Set a new password</h1><form onSubmit={submit} className="mt-6 space-y-4"><input className="border border-gray-300 p-3 rounded-lg w-full" type="password" minLength="8" placeholder="New password (at least 8 characters)" value={password} onChange={(e) => setPassword(e.target.value)} required/><input className="border border-gray-300 p-3 rounded-lg w-full" type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/><button className="bg-primary text-white rounded-lg px-4 py-2 w-full font-semibold">Reset password</button></form></main>
}

export default ResetPassword
