// The Middleware Function runs on the Edge Runtime. And to understand what the Edge Runtime is 
// you first need to understand what a Runtime is. A Runtime is simply where your code will be 
// executed. The Edge Runtime runs closer to the user so on the "edge". And a result of this is
// that it is extremely fast in sending data back to the user. A drawback of this is that it won't
// have access to NodeJS built in module like 'fs' or 'crypto'.

import {NextRequest, NextResponse} from "next/server";
import {verifyTokenCompatibleInEdgeRuntime} from "./app/_utils/token";

const middleware = async(request: NextRequest) => {
    // Add all your ProtectedRoutes in this array for redirection to home page
    const protectedRoutes = [
        '/profile',
        '/questions/ask'
    ];
    try {
        const token = request.cookies.get('token')?.value;
        if (!token) {
            if (protectedRoutes.includes(request.nextUrl.pathname)) {
                const absoluteURL = new URL("/", request.nextUrl.origin);
                return NextResponse.redirect(absoluteURL.toString());
            }
            throw new Error();
        }
        const decoded = await verifyTokenCompatibleInEdgeRuntime(token);
        const clonedRequestHeaders = new Headers(request.headers);
        clonedRequestHeaders.set('x-user', JSON.stringify(decoded));
        return NextResponse.next({
            request: {
                headers: clonedRequestHeaders
            }
        });
    }   
    catch(error) {
        // Even if no token is provided we will allow it to pass onto the next middleware function.
        // The reason why we are doing this instead of throwing a Response with an error status code
        // is because this project will ONLY use Server Actions. Which is an extremely powerful feature
        // of NextJS that removes the need for API endpoints.
        return NextResponse.next();
    }
}

// Important Note regarding the two approaches of making Middleware Function run on a specific route

// Say you were to make the Middleware Funciton run on the '/' route. And you specified this 
// through the matcher. So like this

// export const config = {
//     matcher: [
//         '/'
//     ]
// };

// You would see the Middleware Function run a ton of times

// Middleware Function /
// Middleware Function /_next/static/css/app/layout.css
// Middleware Function /_next/static/chunks/webpack.js
// Middleware Function /_next/static/chunks/main-app.js
// Middleware Function /_next/static/chunks/app-pages-internals.js
// Middleware Function /_next/static/chunks/app/layout.js
// Middleware Function /favicon.ico

// But if I use conditional statements like this

// if (request.nextUrl.pathname === '/') {
//     Some code ...          
// }

// It will only run once

// Middleware Function /

export default middleware;