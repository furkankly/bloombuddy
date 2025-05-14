import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="w-full p-4 rounded-lg shadow-md flex items-center justify-between">
        <Link
          href="/"
          className="text-white font-bold text-xl flex items-center space-x-2"
        >
          <span className="text-purple-600">BloomBuddy</span>
        </Link>
        <div className="hidden md:flex space-x-4 text-white">
          <Link href="/plants" className="hover:text-purple-200">
            Plant Collection
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}
