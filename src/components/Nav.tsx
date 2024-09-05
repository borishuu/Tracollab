'use client';

import { useRouter } from "next/navigation";
import { useAuth } from '@/context/authContext';

export default function Nav() {
    const { user, setUser } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
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
    };

    return (
        <nav className="relative flex w-full items-center justify-between h-16 shadow-dark-mild dark:bg-body-dark">
            {/* Logo Section */}
            <div className="flex-1 h-full flex items-center pl-3 justify-start">
                <a href="/" className="inline-block">
                    <img
                        src="/assets/Logo.png"
                        className="h-12 object-contain"
                        alt="logo"
                    />
                </a>
            </div>

            {/* Central Logo (Hidden on small screens) */}
            <div className="flex-1 h-full flex items-center justify-center hidden md:flex">
                <a href="/" className="inline-block">
                    <img
                        src="/assets/LogoBlackTexteWithoutSlogan.png"
                        className="h-10 object-contain"
                        alt="Logo"
                    />
                </a>
            </div>

            {/* User and Home Icons (Visible on all screens) */}
            <div className="flex-1 flex items-center justify-end px-3 bg-[#C162EA] h-full space-x-4"> {/* Adjusted space-x-4 for spacing */}
                {/* Home Icon */}
                <div className="flex items-center"> {/* Visible on all screens */}
                    <a href="/" className="inline-block">
                        <img
                            src="/assets/home.png"
                            className="w-8 h-auto cursor-pointer duration-200 hover:scale-110"
                            alt="Home"
                        />
                    </a>
                </div>

                {/* User Icon and Authentication Buttons */}
                <div className="flex items-center space-x-2"> {/* Removed extra margins and managed spacing */}
                    {user ? (
                        <div className="flex items-center space-x-2"> {/* Spacing between elements */}
                            <a href={`/user/${user.name}`} className="inline-block">
                                <img
                                    src="/assets/user.png"
                                    className="w-8 h-auto cursor-pointer duration-200 hover:scale-110 mr-2"
                                    alt="User"
                                />
                            </a>
                            <button
                                onClick={handleLogout}
                                className="bg-red-700 hover:scale-110 text-white py-1 px-2 rounded transition duration-300 ease-in-out whitespace-nowrap"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="bg-green-700 hover:scale-110 text-white py-1 px-2 rounded transition duration-300 ease-in-out whitespace-nowrap"
                        >
                            Login
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
