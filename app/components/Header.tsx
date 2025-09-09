"use client";
import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { auth, db } from "@/lib/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Menu, Transition } from "@headlessui/react";
import { doc, getDoc } from "firebase/firestore";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import {
  FiMenu,
  FiX,
  FiSearch,
  FiBarChart,
  FiPlus,
  FiUser,
  FiLogOut,
  FiUsers,
  FiMessageCircle,
} from "react-icons/fi";

export default function Header() {
  const [user, loading] = useAuthState(auth);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<"student" | "creator" | null>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      } else {
        setUserRole(null);
      }
    };

    fetchUserRole();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Prevent hydration issues by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="container flex items-center justify-between px-4 py-3 mx-auto">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <Image src="/favicon.png" alt="Logo" width={40} height={40} />
          </div>
          <div className="hidden sm:block">
            <div className="text-xl font-bold text-gray-900">PROJECT02</div>
            <div className="text-xs text-gray-500 -mt-1">
              Academic Marketplace
            </div>
          </div>
        </Link>

        <nav className="hidden space-x-1 md:flex">
          <Link
            href="/explore"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 font-medium"
          >
            <FiSearch className="w-4 h-4" />
            Explore
          </Link>

          {userRole === "student" && (
            <Link
              href="/creators"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 font-medium"
            >
              <FiUsers className="w-4 h-4" />
              Creators
            </Link>
          )}

          {user && (
            <Link
              href="/messages"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 font-medium"
            >
              <FiMessageCircle className="w-4 h-4" />
              Messages
            </Link>
          )}

          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 font-medium"
          >
            <FiBarChart className="w-4 h-4" />
            Dashboard
          </Link>

          {user && (
            <Link
              href="/create-project"
              className="flex items-center gap-2 px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              <FiPlus className="w-4 h-4" />
              Create Project
            </Link>
          )}
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
          >
            {mobileMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {loading ? (
            <div className="w-8 h-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          ) : user ? (
            <>
              <NotificationCenter />

              <Menu as="div" className="relative ml-3">
                <Menu.Button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 group">
                  <div className="relative">
                    {user.photoURL ? (
                      <Image
                        width={36}
                        height={36}
                        className="rounded-full ring-2 ring-indigo-100 group-hover:ring-indigo-200 transition-all duration-200"
                        src={user.photoURL}
                        alt="User avatar"
                        priority
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold shadow-md group-hover:shadow-lg transition-all duration-200">
                        {user.displayName?.charAt(0) || user.email?.charAt(0)}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="hidden md:block">
                    <div className="text-sm font-medium text-gray-900">
                      {user.displayName || user.email?.split("@")[0]}
                    </div>
                    <div className="text-xs text-gray-500">Online</div>
                  </div>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-3 w-56 origin-top-right rounded-xl bg-white/95 backdrop-blur-md py-2 shadow-xl ring-1 ring-gray-200/50 border border-gray-100 focus:outline-none">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user.displayName || user.email?.split("@")[0]}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>

                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/dashboard"
                          className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 ${
                            active
                              ? "bg-indigo-50 text-indigo-600"
                              : "text-gray-700"
                          }`}
                        >
                          <FiBarChart className="w-4 h-4 mr-3" />
                          Dashboard
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/profile"
                          className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 ${
                            active
                              ? "bg-indigo-50 text-indigo-600"
                              : "text-gray-700"
                          }`}
                        >
                          <FiUser className="w-4 h-4 mr-3" />
                          Profile Settings
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/create-project"
                          className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 ${
                            active
                              ? "bg-indigo-50 text-indigo-600"
                              : "text-gray-700"
                          }`}
                        >
                          <FiPlus className="w-4 h-4 mr-3" />
                          Create Project
                        </Link>
                      )}
                    </Menu.Item>

                    <div className="border-t border-gray-100 mt-2"></div>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleSignOut}
                          className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-all duration-200 ${
                            active ? "bg-red-50 text-red-600" : "text-gray-700"
                          }`}
                        >
                          <FiLogOut className="w-4 h-4 mr-3" />
                          Sign Out
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                href="/login"
                className="px-4 py-2 text-gray-600 hover:text-indigo-600 font-medium transition-all duration-200 hover:bg-indigo-50 rounded-lg"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2 text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/explore"
              className="block px-4 py-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiSearch className="w-4 h-4 inline mr-2" />
              Explore Projects
            </Link>

            {userRole === "student" && (
              <Link
                href="/creators"
                className="block px-4 py-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiUsers className="w-4 h-4 inline mr-2" />
                Creators
              </Link>
            )}

            {user && (
              <Link
                href="/messages"
                className="block px-4 py-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiMessageCircle className="w-4 h-4 inline mr-2" />
                Messages
              </Link>
            )}

            <Link
              href="/dashboard"
              className="block px-4 py-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiBarChart className="w-4 h-4 inline mr-2" />
              Dashboard
            </Link>
            {user && (
              <Link
                href="/create-project"
                className="block px-4 py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium text-center transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiPlus className="w-4 h-4 inline mr-2" />
                Create Project
              </Link>
            )}

            {!user && (
              <div className="space-y-3 pt-3 border-t border-gray-200">
                <Link
                  href="/login"
                  className="block px-4 py-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 font-medium text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="block px-4 py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium text-center transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
