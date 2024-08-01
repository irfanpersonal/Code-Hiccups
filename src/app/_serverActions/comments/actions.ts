'use server';

import db from '@/app/_utils/db';
import errorHandler from '@/app/_utils/errorHandler';
import {cookies} from 'next/headers';
import {verifyToken} from '@/app/_utils/token';
import convertFormDataToObject from '@/app/_utils/convertFormDataToObject';
import createError from '@/app/_utils/custom-error';

export const getAllCommentsForQuestion = async(data: {questionId: string, pageValue: string, limitValue: string}) => {
    try {
        const {questionId, pageValue, limitValue} = data;
        const whereObject: {[index: string]: any} = {
            questionId: questionId
        };
        const page = Number(pageValue) || 1;
        const limit = Number(limitValue) || 10;
        const skip = (page - 1) * limit;
        let result = db.comment.findMany({
            where: whereObject,
            orderBy: {
                // 'desc' true, 'asc' false
                isAnswerToQuestion: 'desc'
            },
            include: {
                user: true
            },
            take: limit,
            skip: skip
        });
        const comments = await result;
        const totalComments = (await db.comment.findMany({where: whereObject})).length;
        const numberOfPages = Math.ceil(totalComments / limit);
        return {comments, totalComments, numberOfPages};
    }
    catch(error: any) {
        return errorHandler(error);
    }
}

export const createComment = async(prevState: any, formData: FormData) => {
    try {
        const token = cookies().get('token')?.value;
        if (!token) {
            throw new Error;
        }
        const {userID} = verifyToken(token!);
        const {id, content} = convertFormDataToObject(formData);
        if (!content) {
            createError('Please provide content for comment creation!');
        }
        const question = await db.question.findUnique({
            where: {
                id: id
            }
        });
        if (!question) {
            createError('No Question Found with the ID Provided!');
        }
        if (question?.answered) {
            createError('You cannot comment on a question that has already been answered');
        }
        const comment = await db.comment.create({
            data: {
                content: content,
                questionId: id,
                userId: userID
            }
        });
        const commentWithUserData = await db.comment.findUnique({
            where: {
                id: comment.id
            },
            include: {
                user: true
            }
        })
        return {comment: commentWithUserData};
    }   
    catch(error: any) {
        console.log(error);
        return errorHandler(error);
    }
}

export const editComment = async(prevState: any, formData: FormData) => {
    try {
        const token = cookies().get('token')?.value;
        if (!token) {
            throw new Error;
        }
        const {userID} = verifyToken(token!);
        const {id, content} = convertFormDataToObject(formData);
        if (!content) {
            createError('Please provide content to update comment!');
        }
        const comment = await db.comment.findUnique({
            where: {
                id: id,
                userId: userID
            }
        });
        if (!comment) {
            createError('No Comment Found with the ID Provided!');
        }
        const question = await db.question.findUnique({
            where: {
                id: comment?.questionId
            }
        });
        if (comment?.isAnswerToQuestion || question?.answered || question?.deletedAt) {
            createError('You cannot update a comment that is the answer to the question or if the question has already been answered or if the question has been closed');
        }
        const updatedComment = await db.comment.update({
            where: {
                id: id,
                userId: userID
            },
            data: {
                content: content
            }
        });
        return {comment: updatedComment};
    }
    catch(error: any) {
        return errorHandler(error);
    }
}

export const deleteComment = async(prevState: any, formData: FormData) => {
    try {
        const token = cookies().get('token')?.value;
        if (!token) {
            throw new Error;
        }
        const {userID} = verifyToken(token!);
        const {id} = convertFormDataToObject(formData);
        if (!id) {
            createError('Please provide comment id!');
        }
        const comment = await db.comment.findUnique({
            where: {
                id: id,
                userId: userID
            }
        });
        if (!comment) {
            createError('No Comment Found with the ID Provided!');
        }
        const question = await db.question.findUnique({
            where: {
                id: comment?.questionId
            }
        });
        if (comment?.isAnswerToQuestion || question?.answered || question?.deletedAt) {
            createError('You cannot delete a comment that is the answer to the question or if the question has been answered or if the question has been deleted');
        }
        await db.comment.delete({
            where: {
                id: comment!.id
            }
        });
        return {deleted: true};
    }
    catch(error: any) {
        return errorHandler(error);
    }
}

export const markCommentAsAnswer = async(prevState: any, formData: FormData) => {
    try {
        const token = cookies().get('token')?.value;
        if (!token) {
            throw new Error;
        }
        const {userID} = verifyToken(token!);
        const {commentId, questionId} = convertFormDataToObject(formData);
        if (!commentId || !questionId) {
            createError('Please provide commentId and questionId!');
        }
        const question = await db.question.findUnique({
            where: {
                id: questionId
            }
        });
        const comment = (await db.comment.findUnique({
            where: {
                id: commentId
            }
        }))!;
        if (question?.userId !== userID) {
            createError('You cannot mark a comment for a question correct unless you are the creator of the question!');
        }
        if (question?.answered) {
            createError('This question has already been answered');
        }
        if (comment.userId === userID) {
            createError('You cannot mark a comment correct if its your comment. Allowing it can promote false reputation numbers!');
        }
        await db.question.update({
            where: {
                id: questionId
            },
            data: {
                answered: true
            }
        });
        await db.comment.update({
            where: {
                id: commentId
            },
            data: {
                isAnswerToQuestion: true
            }
        });
        await db.user.update({
            where: {
                id: comment.userId
            },
            data: {
                reputation: {
                    increment: 10
                }
            }
        });
        return {success: true};
    }   
    catch(error: any) {
        return errorHandler(error);
    }
}