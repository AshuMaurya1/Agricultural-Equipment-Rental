import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const VerifyEmail = () => {
  const { axios } = useAppContext()
  const [params] = useSearchParams()
  const [message, setMessage] = useState('Verifying your email…')
  const submitted = useRef(false)

  useEffect(() => {
    if (submitted.current) return
    submitted.current = true
    axios.post('/api/user/verify-email', { token: params.get('token') })
      .then(({ data }) => setMessage(data.message || 'Email verified successfully'))
      .catch((error) => setMessage(error.response?.data?.message || 'Verification failed'))
  }, [axios, params])

  return <main className="max-w-md mx-auto px-6 py-16 min-h-[65vh]"><h1 className="text-2xl font-bold text-gray-900">Email verification</h1><p className="mt-3 text-gray-600">{message}</p></main>
}

export default VerifyEmail
