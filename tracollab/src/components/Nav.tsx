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
                <a href="/" className="inline-block">
                    <img
                        src="/assets/Logo.png"
                        className="h-12 object-contain"
                        alt="logo"
                    />
                </a>
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
              <a href="/" className="inline-block">
                <img
                    src="/assets/home.png"
                    className="w-8 h-auto cursor-pointer duration-200 hover:scale-110"
                    alt="Home"
                />
              </a>
            </div>
            <div className="flex items-center ml-2 mr-2">
                {user ? (
                    <a href={`/user/${user.name}`} className="inline-block">
                        <img
                            src="/assets/user.png"
                            className="w-8 h-auto cursor-pointer duration-200 hover:scale-110"
                            alt="User"
                        />
                    </a>
                ): (
                    <div className="flex items-center ml-2 mr-2">
                        <button onClick={handleLogout}
                                className="bg-green-700 hover:bg-green-800 text-white py-2 ox-3 rounded transition duration-300 ease-in-out">
                            <h2 className={"mx-3"}>Login</h2>
                        </button>
                    </div>
                )}

            </div>
              {user ? (
                  <div className="flex items-center ml-2 mr-2">
                      <button onClick={handleLogout}
                              className="bg-red-500 hover:bg-red-600 text-white py-2 ox-3 rounded transition duration-300 ease-in-out">
                          <h2 className={"mx-3"}>Logout</h2>
                      </button>
                    </div>
                ):(
                    <div></div>
                )}
          </div>
        </nav>
    );
}