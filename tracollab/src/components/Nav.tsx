'use client';

import { useRouter } from "next/navigation";
import { useAuth } from '@/context/authContext';
import Link from 'next/link';

export default function Nav() {
    const { user, setUser } = useAuth();
    const router = useRouter();

    const handleLogout = async() => {
        try {
            const response = await fetch('/api/logout');
            if (response.status === 200) {
                router.push('/login');
                setUser(null);
            } else {
                console.error("Logout failed");
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }

    return (
        <nav
            className="relative flex w-full items-center justify-between h-16 shadow-dark-mild dark:bg-body-dark"
            data-twe-navbar-ref
        >
          <div className="flex-1 h-full flex items-center pl-3 justify-start">
            <img
                src="/assets/Logo.png"
                className="h-12 object-contain"
                alt="logo"
            />
          </div>

          <div className="flex-1 h-full flex items-center justify-center">
            <img
                src="/assets/LogoBlackTexte.png"
                className="h-10 object-contain"
                alt="logo"
            />
          </div>

          <div className="flex-1 flex items-center justify-end px-3 bg-[#C162EA] h-full">
            <div className="flex items-center ml-2 mr-2">
              <a href="/path-to-your-page" className="inline-block">
                <img
                    src="/assets/home.png"
                    className="w-8 h-auto"
                    alt="Home"
                />
              </a>
            </div>
            <div className="flex items-center ml-2 mr-2">
                {user ? (
                    <a href="/path-to-your-page" className="inline-block">
                        <img
                            src="/assets/user.png"
                            className="w-8 h-auto"
                            alt="User"
                        />
                    </a>
                ):(
                    <Link href="/login" className="inline-block">
                        Login
                    </Link>
                )}
              
            </div>
                {user ? (
                    <div className="flex items-center ml-2 mr-2">
                        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white py-2 ox-3 rounded transition duration-300 ease-in-out">
                            <h2>Logout</h2>
                        </button>
                    </div>
                ):(    
                    <div></div>               
                )}

          </div>
        </nav>
    );
}