// Interactive 1-5 star picker used on the public form.
export default function StarRating({ value, onChange }) {
  return (
    <div className="flex gap-[6px] items-center">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          onClick={() => onChange(n)}
          className="w-11 h-11 border-0 bg-transparent cursor-pointer text-[28px] leading-none p-0 transition-transform hover:scale-110"
          style={{ color: n <= value ? '#FBBF24' : 'rgba(255,255,255,0.18)' }}
        >
          ★
        </button>
      ))}
    </div>
  );
}
