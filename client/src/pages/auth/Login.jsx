import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../state/useAuth';

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState(null);

  function onChange(e) {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);
    try {
      await login(form);
      nav('/');
    } catch (e) {
      setErr(e?.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div className="max-w-md border rounded-2xl p-6">
      <h2 className="text-2xl font-bold">Login</h2>
      <p className="text-sm text-slate-600 mt-1">Use seeded: user@lankatrips.lk / User@123</p>

      <form onSubmit={onSubmit} className="mt-5 space-y-3">
        <div>
          <label className="text-sm">Email</label>
          <input name="email" value={form.email} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="text-sm">Password</label>
          <input type="password" name="password" value={form.password} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2" />
        </div>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button className="w-full px-4 py-2 rounded-md bg-slate-900 text-white">Login</button>
      </form>

      <p className="text-sm text-slate-600 mt-4">
        No account? <Link className="underline" to="/register">Register</Link>
      </p>
    </div>
  );
}
