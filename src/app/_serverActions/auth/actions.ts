'use server';

// The reason why we are using Server Actions instead of the usual API endpoints is because of how powerful 
// Server Actions are. I no longer need to create an endpoint on my server and then make a request from the 
// front end to make a change. By using Server Actions I can skip all that and get right into the changes I
// want. 

// Rule for Server Actions in NextJS
// - Must be Async
// - Add 'use server' directive as first line in function body or top of file to make all exported functions
// server actions

import db from '@/app/_utils/db';
import cloudinary from '@/app/_utils/cloudinary';
import convertFormDataToObject from '@/app/_utils/convertFormDataToObject';
import createError from '@/app/_utils/custom-error';
import deleteImage from '@/app/_utils/deleteImage';
import errorHandler from '@/app/_utils/errorHandler';
import hashValue from '@/app/_utils/hashValue';
import comparePassword from '@/app/_utils/comparePassword';
import {createCookieWithToken, createToken} from '@/app/_utils/token';
import {UserSchema} from '@/app/_zodSchemas/models';
import fs from 'node:fs';
import path from 'node:path';
import { cookies } from 'next/headers';

export const register = async(prevState: any, formData: FormData) => {
    try {
        const data = convertFormDataToObject(formData);
        UserSchema.parse({
            displayName: data.displayName,
            userName: data.userName,
            email: data.email,
            password: data.password,
            location: data.location,
            bio: data.bio,
            interests: !Array.isArray(data.interests) ? [data.interests] : data.interests
        });
        // At this point we have made sure that everything besides profilePicture is valid and good
        // to go. Now we just need to check if a profilePicture is provided and if it isn't throw
        // an error or upload to cloudinary.
        if (!data.profilePicture || data.profilePicture.size === 0) {
            const error = new Error();
            error.name = 'ZodError';
            throw error;
        }
        else {
            // Push to Cloudinary
            const profilePicture = data.profilePicture; // File Object
            // Limit to a Maximum size of 2MB
            const maxSize = 1000000 * 2;
            if (profilePicture.size > maxSize) {
                const error = new Error();
                error.name = 'ZodError';
                throw error;
            }
            // Convert to Blob
            const blob = new Blob([profilePicture]);
            // Convert Blob to Buffer
            const blobBuffer = Buffer.from(await blob.arrayBuffer());
            // Destination of File Save
            const destination = path.resolve('./src/app/_images', profilePicture.name);
            // Save File
            fs.writeFile(destination, blobBuffer, (err) => {
                if (err) {
                    console.log(err);
                    // console.log('Failed to Save File');
                }
                else {
                    // console.log('Saved File');
                }
            });
            // Create Unique Identifier for Cloudinary Upload
            const uniqueIdentifierForProfilePicture = `${new Date().getTime()}_${data.userName}_profile_picture_${profilePicture.name}`;
            // Upload Profile Picture to Cloudinary
            const resultForProfilePicture = await cloudinary.uploader.upload(destination, {
                public_id: uniqueIdentifierForProfilePicture, 
                folder: 'CODE_HICCUPS/PROFILE_PICTURES'
            });
            // Delete the Profile Picture saved temporarily in _images directory
            await deleteImage(destination);
            data.profilePicture = resultForProfilePicture.secure_url;
        }
        // Hash Password before creating User
        data.password = await hashValue(data.password);
        const user = await db.user.create({
            data: {
                displayName: data.displayName,
                userName: data.userName,
                email: data.email,
                password: data.password,
                location: data.location,
                bio: data.bio,
                profilePicture: data.profilePicture,
                interests: !Array.isArray(data.interests) ? [data.interests] : data.interests
            }
        });
        // Create JWT
        const token = createToken(user);
        // Create Cookie with JWT
        createCookieWithToken(token);
        return {user};
    }
    catch(error: any) {
        console.log(error);
        return errorHandler(error);
    }
}

export const login = async(prevState: any, formData: FormData) => {
    try {
        const {email, password} = convertFormDataToObject(formData);
        if (!email || !password) {
            createError('Please provide email and password!');
        }
        const user = (await db.user.findUnique({
            where: {
                email: email
            }
        }))!;
        if (!user) {
            createError('No User Found with the Email Provided!');
        }
        const isCorrect = await comparePassword(password, user.password);
        if (!isCorrect) {
            createError('Incorrect Password');
        }
        const token = createToken(user);
        createCookieWithToken(token);
        return {user};
    }
    catch(error: any) {
        return errorHandler(error);
    }
}

export const logout = async(prevState: any, formData: FormData) => {
    try {
        cookies().delete('token');
        return {msg: 'Successfully Logged Out'};
    }
    catch(error: any) {
        return errorHandler(error);
    }
}