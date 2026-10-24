import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="inline-flex items-center">
      <Image
        src="/images/BandUp_Logo.png"
        alt="BandUp"
        width={120}
        height={40}
        priority
        className="h-8 w-auto md:h-10"
      />
    </Link>
  );
}