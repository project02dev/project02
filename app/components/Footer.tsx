import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-900 mt-16 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <Image src={"/favicon.png"} alt="Project02" width={32} height={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">PROJECT02</h3>
                <p className="text-xs text-gray-500 -mt-1 font-medium">
                  Academic Marketplace
                </p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              The premier academic marketplace connecting students with verified
              project creators worldwide.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-500 hover:text-gray-900 transition-colors"
                aria-label="Twitter"
              >
                <span className="sr-only">Twitter</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 12 7.47v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-900 transition-colors"
                aria-label="GitHub"
              >
                <span className="sr-only">GitHub</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.46-1.2-1.13-1.52-1.13-1.52-.93-.65.07-.64.07-.64 1.03.07 1.57 1.08 1.57 1.08.91 1.6 2.39 1.14 2.97.87.09-.68.36-1.14.65-1.4-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.32.1-2.75 0 0 .84-.27 2.75 1.05a9.2 9.2 0 0 1 5 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.43.2 2.49.1 2.75.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.37.33.69.98.69 1.98 0 1.43-.01 2.58-.01 2.93 0 .27.18.6.69.49A10.04 10.04 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" clipRule="evenodd"/></svg>
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-900 transition-colors"
                aria-label="LinkedIn"
              >
                <span className="sr-only">LinkedIn</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.94 6.5A2.44 2.44 0 1 1 4.5 4.06 2.44 2.44 0 0 1 6.94 6.5ZM4.75 8.25h4.38v10.5H4.75Zm6.13 0h4.2v1.44h.06a4.6 4.6 0 0 1 4.14-2.27c4.43 0 5.25 2.92 5.25 6.72v4.61h-4.38v-4.09c0- .98-.02-2.24-1.36-2.24-1.36 0-1.57 1.06-1.57 2.16v4.17h-4.38Z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">For Students</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/explore"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Browse Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/explore?category=custom"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Request Custom Project
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">For Creators</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/create-project"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Create Project
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Become a Creator
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Creator Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/creator-guide"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Creator Guide
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Contact Support
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Project02. All rights reserved.
            </p>
            {/* Removed emojis and operational status per request */}
            <div className="mt-4 md:mt-0">
             
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
