'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/authContext';

export default function Register() {
    const router = useRouter();
    const { fetchData } = useAuth();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        try {
          // Send signup request to your backend API
          const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, username, password }),
          });
    
          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Signup failed');
          }

          if (response.status === 200) {
            await response.json();
            const loginReponse = await fetch('/api/login', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (loginReponse.status === 200) {
                await loginReponse.json();
                await fetchData();
                router.push('/');
            } else {
                console.log("Login failed after registration", loginReponse.status);
                setUsername("");
                setEmail("");
                setPassword("");
            }
          } else {
            console.log("Registration failed", response.status);
            setUsername("");
            setEmail("");
            setPassword("");
          }
    
        } catch (error: any) {
          console.log(error.message);
          setError(error.message as string);
        }
    };

    return (
        <main>
            <div className="pl-12 pr-12 pt-3" style={{ backgroundColor: '#404040' }}>
                <h1 className="text-white text-5xl mb-2 text-center">Create your account</h1>            
                <div className="flex justify-center">
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <form onSubmit={handleSubmit} className="mt-8 space-y-4 w-full max-w-lg">
                        <div>
                            <label className="block text-white text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="email"
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <label className="block text-white text-sm font-bold mb-2" htmlFor="username">
                                Username
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="username"
                                onChange={(e) => setUsername(e.target.value)}
                                type="text"
                                placeholder="Enter your username"
                            />
                        </div>

                        <div>
                            <label className="block text-white text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="password"
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                placeholder="Enter your password"
                            />
                        </div>
                        <div className="mt-1">
                            <Link href="/login">Already have an account? Login here</Link>
                        </div>            
                        <div>
                            <button
                                className="bg-[#C162EA] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                Register
                            </button>
                            
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
