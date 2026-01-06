import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../state/useAuth';

export default function Register() {
  const nav = useNavigate();
  const { register: doRegister } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState(null);

  function onChange(e) {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);
    try {
      await doRegister(form);
      nav('/');
    } catch (e) {
      setErr(e?.response?.data?.message || 'Register failed');
    }
  }

  return (
    <div className="max-w-md border rounded-2xl p-6">
      <h2 className="text-2xl font-bold">Register</h2>

      <form onSubmit={onSubmit} className="mt-5 space-y-3">
        <div>
          <label className="text-sm">Name</label>
          <input name="name" value={form.name} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="text-sm">Email</label>
          <input name="email" value={form.email} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="text-sm">Password</label>
          <input type="password" name="password" value={form.password} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2" />
        </div>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button className="w-full px-4 py-2 rounded-md bg-slate-900 text-white">Create account</button>
      </form>

      <p className="text-sm text-slate-600 mt-4">
        Already have an account? <Link className="underline" to="/login">Login</Link>
      </p>
    </div>
  );
}
