
import Image from "next/image";
import Link from "next/link";

const letters = "BandUp".split("");

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="BandUp home"
      className="inline-flex items-center"
    >
      <style>{`
        @keyframes bandup-bounce {
          0%, 88%, 100% { transform: translateY(0); }
          2% { transform: translateY(-5px); }
          4% { transform: translateY(0); }
          6% { transform: translateY(-3px); }
          8% { transform: translateY(0); }
        }

        .bandup-letter {
          animation: bandup-bounce 10s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .bandup-letter {
            animation: none;
          }
        }
      `}</style>

      <Image
        src="/images/BandUp_Logo_RAW.png"
        alt=""
        width={40}
        height={40}
        priority
        className="h-8 w-auto md:h-10"
      />
      <span
        aria-hidden="true"
        className="inline-flex text-3xl font-extrabold leading-none tracking-tight"
      >
        {letters.map((letter, index) => (
          <span
            key={`${letter}-${index}`}
            className={`bandup-letter inline-block font-bold ${index < 4
              ? "text-[#16448d]"
              : "text-[rgba(2,82,201,1)]"
              }`}
            style={{
              animationDelay: `${index * 80}ms`,
              fontFamily: "Roboto, sans-serif",
            }}
          >
            {letter}
          </span>
        ))}
      </span>
    </Link>
  );
}
