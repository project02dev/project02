"use client";
import { useState, useEffect, Fragment, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
  FiHome,
  FiChevronDown,
} from "react-icons/fi";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  requiresAuth?: boolean;
  roleRestricted?: "student" | "creator";
  isCta?: boolean;
}

export default function Header() {
  const [user, loading] = useAuthState(auth);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<"student" | "creator" | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Navigation items configuration
  const navItems: NavItem[] = [
    { href: "/", label: "Home", icon: <FiHome className="w-4 h-4" /> },
    {
      href: "/explore",
      label: "Explore",
      icon: <FiSearch className="w-4 h-4" />,
    },
    {
      href: "/creators",
      label: "Creators",
      icon: <FiUsers className="w-4 h-4" />,
      roleRestricted: "student",
    },
    {
      href: "/messages",
      label: "Messages",
      icon: <FiMessageCircle className="w-4 h-4" />,
      requiresAuth: true,
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <FiBarChart className="w-4 h-4" />,
    },
    {
      href: "/create-project",
      label: "Create Project",
      icon: <FiPlus className="w-4 h-4" />,
      requiresAuth: true,
      isCta: true,
    },
  ];

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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

  const handleSignOut = useCallback(async () => {
    try {
      await signOut(auth);
      router.push("/login");
      setMobileMenuOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, [router]);

  const shouldShowNavItem = useCallback(
    (item: NavItem) => {
      if (item.requiresAuth && !user) return false;
      if (item.roleRestricted && userRole !== item.roleRestricted) return false;
      return true;
    },
    [user, userRole]
  );

  const isActivePath = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50 shadow-sm h-16" />
    );
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl border-b border-gray-200/60 shadow-lg"
          : "bg-white/90 backdrop-blur-md border-b border-gray-100/50"
      }`}
    >
      <div className="container flex items-center justify-between px-4 lg:px-6 mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-3 group transition-transform duration-200 hover:scale-105"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="relative">
            <Image src={"/favicon.png"} alt="po2" width={50} height={50} />
          </div>
          <div className="hidden sm:block">
            <div className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              PROJECT02
            </div>
            <div className="text-xs text-gray-500 -mt-1 font-medium">
              Academic Marketplace
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navItems.map(
            (item) =>
              shouldShowNavItem(item) && (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    item.isCta
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700 transform hover:-translate-y-0.5"
                      : isActivePath(item.href)
                      ? "text-blue-600 bg-blue-50/80 border border-blue-100"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50/80 border border-transparent"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              )
          )}
        </nav>

        {/* Desktop Auth Section */}
        <div className="hidden lg:flex items-center space-x-3">
          {loading ? (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            </div>
          ) : user ? (
            <>
              <NotificationCenter />

              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50/80 transition-all duration-200 group border border-transparent hover:border-gray-200">
                  <div className="relative">
                    {user.photoURL ? (
                      <Image
                        width={40}
                        height={40}
                        className="rounded-xl ring-2 ring-gray-100 group-hover:ring-blue-100 transition-all duration-200"
                        src={user.photoURL}
                        alt="User avatar"
                        priority
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold shadow-md group-hover:shadow-lg transition-all duration-200">
                        {user.displayName?.charAt(0) || user.email?.charAt(0)}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {user.displayName || user.email?.split("@")[0]}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                      Online
                    </div>
                  </div>
                  <FiChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="transform opacity-0 scale-95 translate-y-2"
                  enterTo="transform opacity-100 scale-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-2xl bg-white/95 backdrop-blur-xl py-3 shadow-xl ring-1 ring-gray-200/50 border border-gray-100 focus:outline-none">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user.displayName || user.email?.split("@")[0]}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>

                    <div className="py-2">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/dashboard"
                            className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 ${
                              active
                                ? "bg-blue-50/80 text-blue-600"
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
                                ? "bg-blue-50/80 text-blue-600"
                                : "text-gray-700"
                            }`}
                          >
                            <FiUser className="w-4 h-4 mr-3" />
                            Profile Settings
                          </Link>
                        )}
                      </Menu.Item>
                    </div>

                    <div className="border-t border-gray-100 pt-2">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleSignOut}
                            className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg ${
                              active
                                ? "bg-red-50/80 text-red-600"
                                : "text-gray-700"
                            }`}
                          >
                            <FiLogOut className="w-4 h-4 mr-3" />
                            Sign Out
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                href="/login"
                className="px-5 py-2.5 text-gray-600 hover:text-blue-600 font-medium transition-all duration-200 hover:bg-gray-50/80 rounded-xl"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2.5 text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden items-center space-x-3">
          {user && <NotificationCenter />}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-gray-50/80 transition-all duration-200 border border-transparent hover:border-gray-200"
          >
            {mobileMenuOpen ? (
              <FiX className="w-5 h-5" />
            ) : (
              <FiMenu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <Transition
        show={mobileMenuOpen}
        as={Fragment}
        enter="transition ease-out duration-300"
        enterFrom="transform opacity-0 -translate-y-4"
        enterTo="transform opacity-100 translate-y-0"
        leave="transition ease-in duration-250"
        leaveFrom="transform opacity-100 translate-y-0"
        leaveTo="transform opacity-0 -translate-y-4"
      >
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200/60 shadow-xl">
          <div className="container px-4 py-6 mx-auto space-y-3">
            {/* Mobile Navigation Items */}
            <div className="space-y-2">
              {navItems.map(
                (item) =>
                  shouldShowNavItem(item) && (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                        item.isCta
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                          : isActivePath(item.href)
                          ? "text-blue-600 bg-blue-50/80 border border-blue-100"
                          : "text-gray-600 hover:text-blue-600 hover:bg-gray-50/80"
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  )
              )}
            </div>

            {/* Mobile Auth Section */}
            {!loading && !user && (
              <div className="pt-4 border-t border-gray-200/60 space-y-3">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-gray-50/80 rounded-xl font-medium text-center transition-all duration-200"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-medium text-center shadow-lg transition-all duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile User Info */}
            {user && (
              <div className="pt-4 border-t border-gray-200/60 space-y-3">
                <div className="px-4 py-3 bg-gray-50/80 rounded-xl">
                  <p className="text-sm font-semibold text-gray-900">
                    {user.displayName || user.email?.split("@")[0]}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 text-red-600 hover:bg-red-50/80 rounded-xl font-medium transition-all duration-200"
                >
                  <FiLogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </Transition>
    </header>
  );
}
