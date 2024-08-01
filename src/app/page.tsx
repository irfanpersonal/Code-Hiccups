'use client';

import React from 'react';
import Link from 'next/link';
import useStore from './_utils/redux';

const HomePage: React.FunctionComponent = () => {   
    const {user} = useStore().selector.user;
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center">
            <header className="bg-blue-600 w-full py-12 px-6 text-white text-center">
                <h1 className="text-4xl font-extrabold mb-4">Welcome to Code Hiccups</h1>
                <p className="text-lg">Your go-to place for coding questions and solutions.</p>
            </header>
            <main className="flex-1 w-full px-4 py-12 bg-gray-200">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-center">Featured Topics</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold mb-2">React</h3>
                            <p className="text-gray-700">Dive into the world of React. Ask questions, find answers, and explore the best practices.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold mb-2">JavaScript</h3>
                            <p className="text-gray-700">Discuss JavaScript quirks, share code snippets, and get help with your scripts.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold mb-2">CSS</h3>
                            <p className="text-gray-700">From Flexbox to Grid, get insights on styling and layout techniques for a stunning UI.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold mb-2">TypeScript</h3>
                            <p className="text-gray-700">Enhance your JavaScript with static types. Get help with TypeScript features, configurations, and best practices.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold mb-2">Node.js</h3>
                            <p className="text-gray-700">Build scalable network applications with Node.js. Discuss server-side JavaScript and related tools and libraries.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold mb-2">Python</h3>
                            <p className="text-gray-700">Explore Python programming from basics to advanced topics. Get answers and share your knowledge on this versatile language.</p>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="bg-blue-600 w-full py-6 text-white text-center">
                <p className={`text-lg ${!user && 'mb-4'}`}>Join the community and start contributing today!</p>
                {!user && (
                    <Link className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-gray-100" href='/auth'>Get Started</Link>
                )}
            </footer>
        </div>
    );
}

export default HomePage;