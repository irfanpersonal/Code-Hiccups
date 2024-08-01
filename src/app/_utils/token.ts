import {type UserType} from '../_zodSchemas/models';
import jwt from 'jsonwebtoken';
import {cookies} from 'next/headers';
import {jwtVerify} from 'jose';

export interface ITokenPayload {
    userID: string,
    userName: string,
    email: string
}

const createToken = (user: UserType) => {
    const payload: ITokenPayload = {
        userID: user.id!,
        userName: user.userName!,
        email: user.email!
    };
    return jwt.sign(
        payload,
        process.env.JWT_SECRET as string,
        {expiresIn: process.env.JWT_LIFETIME as string}
    );
}

const createCookieWithToken = (token: string) => {
    const oneDay = 1000 * 60 * 60 * 24;
    // In order to set a cookie in NextJS Route Handlers you must invoke the cookies 
    // method from the 'next/headers' module. Then use the ".set" method on it and use
    // it how you usually would.
    cookies().set('token', token, {
        // httpOnly when set to true means that we don't want any client side scripts 
        // to be able to access this cookie.
        httpOnly: true,
        // expires when set to one day means this cookie will be removed from any subsequent 
        // response in 24 hours.
        expires: new Date(Date.now() + oneDay),
        // secure when set to true means that this cookie will only work in "https",
        // but during development we are using "http" so I'm setting it as a conditional.
        // Where if the node enviroment is production only then is it true.
        secure: process.env.NODE_ENV === 'production',
    });
}

// Because the middleware.ts file runs on the Edge Runtime. We cannot use the 'jsonwebtoken' 
// module because it makes use of built in NodeJS modules which are not allowed in the 
// Edge Runtime. 
const verifyToken = (token: string) => {
    return (jwt.verify(token, process.env.JWT_SECRET as string) as ITokenPayload);
}

const verifyTokenCompatibleInEdgeRuntime = async(token: string) => {
    // If I were to just pass in the process.env.JWT_SECRET to the second parameter of the 
    // jwtVerify method from the 'jose' module I would get the following error
    // [TypeError: Key for the HS256 algorithm must be one of type CryptoKey or Uint8Array.]
    // So make sure to do it like this: new TextEncoder().encode(process.env.JWT_SECRET)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const {payload} = await jwtVerify(token, secret);
    return payload;
}

const getUserDataWithNoPassword = () => {
    return {
        id: true,
        displayName: true,
        userName: true,
        email: true,
        profilePicture: true,
        location: true,
        bio: true,
        interests: true,
        reputation: true,
        createdAt: true,
        updatedAt: true
    };
}

export {
    createToken,
    createCookieWithToken,
    verifyToken,
    verifyTokenCompatibleInEdgeRuntime,
    getUserDataWithNoPassword
};