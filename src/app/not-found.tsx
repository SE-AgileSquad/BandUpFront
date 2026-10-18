import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-purple-50 to-white py-16">
        <div className="text-center px-4">
          <p className="text-2xl text-gray-700 mb-8">صفحه مورد نظر یافت نشد</p>
          <Link
            href="/"
            className="inline-block mb-4 bg-blue-600 text-white px-8 py-3 rounded-full font-semibold transition-all hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-lg"
          >
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </main>
    </div>
  );
}
