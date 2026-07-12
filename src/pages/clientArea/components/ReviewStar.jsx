export default function ReviewStar({ active, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-8 w-8 items-center justify-center border-0 bg-transparent p-0 transition-transform hover:scale-105 focus:outline-none"
      aria-label={label}
    >
      <span
        aria-hidden="true"
        className={`text-[26px] leading-none transition-opacity ${active ? 'text-primary opacity-100' : 'text-primary opacity-25'}`}
      >
        {'\u2605'}
      </span>
    </button>
  );
}
