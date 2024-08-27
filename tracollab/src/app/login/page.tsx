'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/authContext';

export default function Login() {
    const router = useRouter();
    const { fetchData } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        try {
          const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });
          await fetchData();
    
          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Login failed');
          }
    
          // Redirect or handle successful signup
          //const data = await response.json();
          //Cookies.set('authToken', data.token);
          router.push('/');
    
        } catch (error: any) {
          console.log(error.message);
          setError(error.message as string);
        }
    };

    return(
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
                            <Link href="/register">Don&apos;t have an account? Register here</Link>
                        </div>            
                        <div>
                            <button
                                className="bg-[#C162EA] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                Login
                            </button>
                            
                        </div>
                    </form>
                </div>
            </div>
        </main>
    )
}
