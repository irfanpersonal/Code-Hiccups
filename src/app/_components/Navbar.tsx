'use client';

import Link from 'next/link';
import {nanoid} from 'nanoid';
import {usePathname} from 'next/navigation';
import useStore from '../_utils/redux';

const links = [
    {
        href: '/',
        text: 'Home'
    },
    {
        href: '/questions',
        text: 'Questions'
    },
    {
        href: '/tags',
        text: 'Tags'
    },
    {
        href: '/users',
        text: 'Users'
    },
    {
        href: '/profile',
        text: 'Profile',
        authenticated: true
    },
    {
        href: '/auth',
        text: 'Register/Login',
        onlyIfNoUser: true
    }
];

const Navbar: React.FunctionComponent = () => {
    const pathname = usePathname();
    const {user} = useStore().selector.user;
    return (
        <nav className="bg-gray-200 h-screen flex-none p-4">
            <Link href='/'><h1 className="text-center p-4 font-bold 2xl:text-3xl xl:text-3xl lg:text-3xl border-b-4 border-black mb-4">Code<span className="text-blue-600">Hiccups</span></h1></Link>
            <ul>
                {links.map(link => {
                    if (link.authenticated && !user) {
                        return null;
                    }
                    else if (link.onlyIfNoUser && user) {
                        return null;
                    }
                    return (
                        <li key={nanoid()}><Link href={link.href} className={`block p-4 hover:bg-gray-300 ${pathname === link.href && 'border-b-2 border-black bg-gray-700 text-white hover:bg-gray-700'}`}>{link.text}</Link></li>
                    );
                })}
            </ul>
        </nav>
    );
}

export default Navbar;