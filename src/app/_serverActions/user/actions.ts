'use server';

import convertFormDataToObject from '@/app/_utils/convertFormDataToObject';
import db from '@/app/_utils/db';
import errorHandler from '@/app/_utils/errorHandler';
import {verifyToken, getUserDataWithNoPassword} from '@/app/_utils/token';
import {cookies} from 'next/headers';
import cloudinary from '@/app/_utils/cloudinary';
import path from 'node:path';
import fs from 'node:fs';
import deleteImage from '@/app/_utils/deleteImage';
import createError from '@/app/_utils/custom-error';

export const showCurrentUser = async() => {
    try {
        const token = cookies().get('token')?.value;
        if (!token) {
            throw new Error;
        }
        const {userID} = verifyToken(token!);
        const user = await db.user.findUnique({
            where: {
                id: userID
            },
            select: getUserDataWithNoPassword()
        });
        return {user};
    }
    catch(error: any) {
        return errorHandler(error);
    }
}

export const getProfileData = async() => {
    try {
        const token = cookies().get('token')?.value;
        if (!token) {
            throw new Error;
        }
        const {userID} = verifyToken(token!);
        const user = await db.user.findUnique({
            where: {
                id: userID
            }
        });
        return {user};
    }
    catch(error: any) {
        return errorHandler(error);
    }
}

export const editProfile = async(prevState: any, formData: FormData) => {
    try {
        const token = cookies().get('token')?.value;
        if (!token) {
            throw new Error;
        }
        const {userID} = verifyToken(token);
        const user = await db.user.findUnique({
            where: {
                id: userID
            }
        });
        const data = convertFormDataToObject(formData);
        let updatedProfilePicture = false;
        // Handle Updating of Profile Picture
        const profilePicture = data.profilePicture;
        const maxSize = 1000000 * 2;
        // Check if a Profile Picture is Provided
        if (profilePicture.size !== 0) {
            if (profilePicture.size > maxSize) {
                const error = new Error();
                error.name = 'CustomError';
                throw error;
            }
            // Delete Old Profile Picture
            const oldImage = user!.profilePicture.substring(user!.profilePicture.indexOf('CODE'));
            await cloudinary.uploader.destroy(oldImage.substring(0, oldImage.lastIndexOf('.')));
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
                    console.log('Failed to Save File');
                }
                else {
                    console.log('Saved File');
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
            updatedProfilePicture = true;
        }
        await db.user.update({
            where: {
                id: userID
            },
            data: {
                displayName: data.displayName,
                userName: data.userName,
                bio: data.bio,
                location: data.location,
                interests: data.interests !== undefined ? Array.isArray(data.interests) ? data.interests : [data.interests] : undefined,
                profilePicture: updatedProfilePicture ? data.profilePicture : undefined
            }
        });
        const updatedUser = await db.user.findUnique({
            where: {
                id: userID
            }
        });
        return {user: updatedUser};
    }
    catch(error: any) {
        console.log(error);
        return errorHandler(error);
    }
}

export const getAllUsers = async(data: {search: string, pageValue: string, limitValue: string}) => {
    try {
        const {search, pageValue, limitValue} = data;
        const whereObject: {[index: string]: any} = {};
        if (search) {
            whereObject.userName = {
                contains: search,
                mode: 'insensitive'
            }
        }
        const page = Number(pageValue) || 1;
        const limit = Number(limitValue) || 10;
        const skip = (page - 1) * limit;
        let result = db.user.findMany({
            where: whereObject,
            orderBy: {
                createdAt: 'desc'
            },
            take: limit,
            skip: skip
        });
        const users = await result;
        const totalUsers = (await db.user.findMany({where: whereObject})).length;
        const numberOfPages = Math.ceil(totalUsers / limit);
        return {users, totalUsers, numberOfPages};
    }
    catch(error: any) {
        return errorHandler(error);
    }
}

export const getSingleUser = async(userId: string) => {
    try {
        const user = await db.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            createError('No User Found with the ID Provided!');
        }
        return {user};
    }
    catch(error: any) {
        return errorHandler(error);
    }
}