export default function HamburgerMenu() {
  return (
    <button
      type="button"
      aria-label="Open menu"
      className="flex size-10 items-center justify-center md:hidden border-1 rounded-lg "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="size-6"
        aria-hidden="true"
      >
        <path d="M4 7h16M4 12h16M4 17h16" />
      </svg>
    </button>
  );
}