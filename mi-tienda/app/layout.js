import "./globals.css";
import Link from "next/link";
import { TABLAS } from "@/lib/tablas";

export const metadata = {
  title: "Mi Tienda",
  description: "Administración de la tienda",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="bg-indigo-700 text-white shadow">
          <nav className="mx-auto flex max-w-6xl items-center gap-6 p-4">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold">
              <svg width="32" height="32" viewBox="0 0 32 32" aria-label="Logo">
                <rect width="32" height="32" rx="8" fill="white" />
                <text x="16" y="23" fontSize="20" textAnchor="middle" fill="#4338ca" fontWeight="bold">T</text>
              </svg>
              Mi Tienda
            </Link>
            <ul className="flex gap-4">
              {Object.entries(TABLAS).map(([key, t]) => (
                <li key={key}>
                  <Link href={`/${key}`} className="rounded px-3 py-2 hover:bg-indigo-600">
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl p-6">{children}</main>
      </body>
    </html>
  );
}
