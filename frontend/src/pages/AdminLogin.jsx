import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ACCENT } from '../lib/constants.js';

const field =
  'bg-[#101114] border border-[rgba(255,255,255,0.1)] rounded-[10px] px-[14px] py-[12px] text-[15px] text-[#ebecf0] font-[inherit] min-h-[44px] box-border';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function signIn(e) {
    e.preventDefault();
    // Prototype gate (documented in DECISIONS): any credentials proceed.
    navigate('/admin');
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 pb-24 box-border">
      <div className="w-full max-w-[380px] animate-fade-up">
        <div className="flex flex-col items-center gap-[14px] mb-7">
          <div
            className="w-11 h-11 rounded-[12px] flex items-center justify-center font-bold text-[22px] text-[#141414]"
            style={{ background: ACCENT }}
          >
            A
          </div>
          <div className="text-center">
            <div className="text-[20px] font-bold">Admin Console</div>
            <div className="text-[13px] text-[rgba(235,236,240,0.45)] mt-1">
              Sign in to view feedback analytics
            </div>
          </div>
        </div>

        <form
          onSubmit={signIn}
          className="bg-[#17181d] border border-[rgba(255,255,255,0.07)] rounded-[16px] p-[26px] flex flex-col gap-[18px] box-border"
        >
          <div className="flex flex-col gap-[7px]">
            <label className="text-[13px] font-semibold text-[rgba(235,236,240,0.8)]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@acowale.com"
              className={field}
            />
          </div>
          <div className="flex flex-col gap-[7px]">
            <label className="text-[13px] font-semibold text-[rgba(235,236,240,0.8)]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={field}
            />
          </div>
          <button
            type="submit"
            className="min-h-[46px] rounded-[10px] border-0 text-[15px] font-semibold text-[#141414] cursor-pointer mt-1 transition hover:brightness-110"
            style={{ background: ACCENT }}
          >
            Sign in
          </button>
          <div className="text-center text-[12px] text-[rgba(235,236,240,0.35)]">
            Prototype — any credentials work
          </div>
        </form>
      </div>
    </div>
  );
}
