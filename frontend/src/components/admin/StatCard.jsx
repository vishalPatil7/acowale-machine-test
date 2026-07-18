export default function StatCard({ label, value, sub, subColor }) {
  return (
    <div className="bg-[#17181d] border border-[rgba(255,255,255,0.07)] rounded-[14px] px-5 py-[18px] box-border">
      <div className="text-[12.5px] font-medium text-[rgba(235,236,240,0.5)]">{label}</div>
      <div className="text-[30px] font-bold tracking-[-0.5px] mt-[6px]">{value}</div>
      <div className="text-[12px] mt-1" style={{ color: subColor }}>
        {sub}
      </div>
    </div>
  );
}
