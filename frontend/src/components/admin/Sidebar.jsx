import { useNavigate } from 'react-router-dom';
import { ACCENT } from '../../lib/constants.js';

const NAV = [
  { key: 'overview', icon: '▧', label: 'Overview' },
  { key: 'feedback', icon: '❰', label: 'Feedback' },
];

export default function Sidebar({ tab, onTab, total }) {
  const navigate = useNavigate();

  return (
    <nav className="flex-[1_1_210px] max-w-[230px] min-w-[190px] bg-[#141519] border-r border-[rgba(255,255,255,0.06)] flex flex-col p-[22px_14px] box-border gap-[6px]">
      <div className="flex items-center gap-[10px] px-[10px] pb-5">
        <div
          className="w-7 h-7 rounded-[8px] flex items-center justify-center font-bold text-[15px] text-[#141414]"
          style={{ background: ACCENT }}
        >
          A
        </div>
        <span className="font-semibold text-[15px]">Acowale</span>
      </div>

      {NAV.map((n) => {
        const active = tab === n.key;
        return (
          <button
            key={n.key}
            onClick={() => onTab(n.key)}
            className="flex items-center gap-[11px] min-h-[44px] px-3 rounded-[10px] border-0 text-[14px] font-[inherit] cursor-pointer text-left w-full box-border transition-colors hover:bg-[rgba(255,255,255,0.06)]"
            style={{
              background: active ? 'rgba(255,107,44,0.14)' : 'transparent',
              color: active ? ACCENT : 'rgba(235,236,240,0.65)',
              fontWeight: active ? 600 : 500,
            }}
          >
            <span className="text-[15px] w-[18px] text-center">{n.icon}</span>
            {n.label}
            {n.key === 'feedback' && total != null && (
              <span className="ml-auto text-[11px] font-semibold bg-[rgba(255,255,255,0.09)] rounded-full px-2 py-[2px] text-[rgba(235,236,240,0.7)]">
                {total}
              </span>
            )}
          </button>
        );
      })}

      <div className="mt-auto flex flex-col gap-[10px] pt-4 border-t border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-[10px] px-[10px]">
          <div className="w-[30px] h-[30px] rounded-full bg-[#2a2c33] flex items-center justify-center text-[12px] font-semibold text-[rgba(235,236,240,0.8)]">
            CM
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
              Crisbin M.
            </div>
            <div className="text-[11px] text-[rgba(235,236,240,0.4)]">Admin</div>
          </div>
        </div>
        <button
          onClick={() => navigate('/admin/login')}
          className="min-h-[38px] rounded-[8px] border border-[rgba(255,255,255,0.1)] bg-transparent text-[rgba(235,236,240,0.6)] text-[13px] font-[inherit] cursor-pointer transition-colors hover:border-[rgba(255,255,255,0.3)] hover:text-[#ebecf0]"
        >
          Log out
        </button>
      </div>
    </nav>
  );
}
