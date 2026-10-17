import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useAppContext } from '../context/AppContext'

const formatDate = (value) => value ? new Date(value).toLocaleString() : 'Never'

const SecuritySessions = () => {
  const { axios, user, navigate, clearLocalSession, fetchUser } = useAppContext()
  const [sessions, setSessions] = useState([])
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [twoFactorSetup, setTwoFactorSetup] = useState(null)
  const [twoFactorCode, setTwoFactorCode] = useState('')

  const loadSessions = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/user/sessions')
      if (data.success) setSessions(data.sessions)
      else toast.error(data.message || 'Could not load sessions')
      const auditResponse = await axios.get('/api/user/audit-logs')
      if (auditResponse.data.success) setLogs(auditResponse.data.logs)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not load sessions')
    } finally {
      setLoading(false)
    }
  }, [axios])

  useEffect(() => {
    if (user) loadSessions()
  }, [user, loadSessions])

  const revoke = async (session) => {
    try {
      const { data } = await axios.delete(`/api/user/sessions/${session.sessionId}`)
      if (!data.success) return toast.error(data.message)
      if (session.current) {
        clearLocalSession()
        navigate('/')
      } else {
        toast.success('Device signed out')
        loadSessions()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const logoutAll = async () => {
    if (!window.confirm('Sign out from every device, including this one?')) return
    try {
      const { data } = await axios.post('/api/user/logout-all')
      if (!data.success) return toast.error(data.message)
      clearLocalSession()
      toast.success('Signed out from all devices')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const sendVerification = async () => {
    try {
      const { data } = await axios.post('/api/user/email-verification')
      data.success ? toast.success(data.message) : toast.error(data.message)
    } catch (error) { toast.error(error.response?.data?.message || error.message) }
  }

  const startTwoFactor = async () => {
    try {
      const { data } = await axios.post('/api/user/2fa/setup')
      if (!data.success) return toast.error(data.message)
      setTwoFactorSetup(data)
    } catch (error) { toast.error(error.response?.data?.message || error.message) }
  }

  const confirmTwoFactor = async () => {
    try {
      const { data } = await axios.post('/api/user/2fa/enable', { code: twoFactorCode })
      if (!data.success) return toast.error(data.message)
      toast.success(data.message)
      setTwoFactorSetup(null)
      setTwoFactorCode('')
      fetchUser()
      loadSessions()
    } catch (error) { toast.error(error.response?.data?.message || error.message) }
  }

  const disableTwoFactor = async () => {
    const code = window.prompt('Enter the current 6-digit authenticator code to disable 2FA')
    if (!code) return
    try {
      const { data } = await axios.post('/api/user/2fa/disable', { code })
      if (!data.success) return toast.error(data.message)
      toast.success(data.message)
      fetchUser()
      loadSessions()
    } catch (error) { toast.error(error.response?.data?.message || error.message) }
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 min-h-[65vh]">
      <div className="flex items-start justify-between gap-5 mb-7">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security Sessions</h1>
          <p className="text-sm text-gray-500 mt-1">Review devices with access to your account and revoke any you do not recognize.</p>
        </div>
        <button onClick={logoutAll} className="shrink-0 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">Logout all</button>
      </div>

      <section className="border border-gray-200 rounded-xl p-5 bg-white mb-7">
        <h2 className="font-semibold text-gray-900">Account protection</h2>
        {!user?.emailVerified ? <div className="mt-3 flex flex-wrap items-center gap-3"><p className="text-sm text-amber-700">Your email address is not verified.</p><button onClick={sendVerification} className="text-sm font-semibold text-primary">Send verification email</button></div> : <p className="text-sm text-green-700 mt-2">Email address verified</p>}
        {user?.role === 'owner' && <div className="border-t border-gray-100 mt-4 pt-4"><div className="flex flex-wrap justify-between gap-3"><div><h3 className="text-sm font-semibold text-gray-800">Two-factor authentication</h3><p className="text-xs text-gray-500 mt-1">Require an authenticator-app code when signing in.</p></div>{user.twoFactorEnabled ? <button onClick={disableTwoFactor} className="text-sm font-semibold text-red-600">Disable 2FA</button> : <button onClick={startTwoFactor} className="text-sm font-semibold text-primary">Set up 2FA</button>}</div>
        {twoFactorSetup && <div className="mt-4 bg-blue-50 rounded-lg p-4 text-sm"><p>Add this setup key to Google Authenticator, Authy, or another TOTP app:</p><code className="block break-all bg-white border border-blue-100 rounded mt-2 p-2 text-xs">{twoFactorSetup.secret}</code><p className="mt-3">Then enter the app's current code to enable it.</p><div className="flex gap-2 mt-2"><input value={twoFactorCode} onChange={(e) => setTwoFactorCode(e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-36" inputMode="numeric" maxLength="6" placeholder="123456"/><button onClick={confirmTwoFactor} className="bg-primary text-white px-3 rounded font-semibold">Confirm</button></div></div>}</div>}
      </section>

      {loading ? <p className="text-gray-500">Loading sessions…</p> : (
        <div className="space-y-3">
          {sessions.filter((session) => !session.revokedAt).map((session) => (
            <article key={session.sessionId} className="border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
              <div>
                <div className="flex items-center gap-2"><h2 className="font-semibold text-gray-800">{session.deviceName}</h2>{session.current && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Current device</span>}</div>
                <p className="text-xs text-gray-500 mt-1">IP: {session.ipAddress || 'Unavailable'} · Last active: {formatDate(session.lastActiveAt)}</p>
                {session.suspicious && <p className="text-xs text-amber-700 mt-1">New device sign-in detected — verify this device.</p>}
              </div>
              <button onClick={() => revoke(session)} className="text-sm font-semibold text-red-600 hover:text-red-700">{session.current ? 'Logout' : 'Revoke access'}</button>
            </article>
          ))}
          {!sessions.some((session) => !session.revokedAt) && <p className="text-gray-500">No active sessions found.</p>}
        </div>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Recent security activity</h2>
        <div className="space-y-2">{logs.map((log) => <div key={log._id} className="text-sm border border-gray-100 rounded-lg p-3"><span className="font-medium text-gray-800">{log.action.replaceAll('_', ' ')}</span><span className="text-gray-500"> · {formatDate(log.createdAt)}{log.ipAddress ? ` · ${log.ipAddress}` : ''}</span></div>)}{!logs.length && !loading && <p className="text-sm text-gray-500">No security activity yet.</p>}</div>
      </section>
    </main>
  )
}

export default SecuritySessions
