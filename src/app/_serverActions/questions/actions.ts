'use server';

import db from '@/app/_utils/db';
import errorHandler from '@/app/_utils/errorHandler';
import {cookies} from 'next/headers';
import {verifyToken} from '../../_utils/token';
import {QuestionSchema} from '@/app/_zodSchemas/models';
import convertFormDataToObject from '@/app/_utils/convertFormDataToObject';
import createError from '@/app/_utils/custom-error';

export const getAllQuestions = async(data: {search: string, questionStatus: string, tagValue: string, pageValue: string, limitValue: string}) => {
    try {
        const {search, questionStatus, tagValue, pageValue, limitValue} = data;
        const whereObject: {[index: string]: any} = {};
        if (search) {
            whereObject.title = {
                contains: search,
                mode: 'insensitive'
            }
        }
        if (questionStatus) {
            whereObject.answered = questionStatus === 'answered' ? true : false;
        }
        if (tagValue) {
            whereObject.tags = {
                has: tagValue
            }
        }
        const page = Number(pageValue) || 1;
        const limit = Number(limitValue) || 10;
        const skip = (page - 1) * limit;
        let result = db.question.findMany({
            where: whereObject,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: true,
                comments: true
            },
            take: limit,
            skip: skip
        });
        const questions = await result;
        const totalQuestions = (await db.question.findMany({where: whereObject})).length;
        const numberOfPages = Math.ceil(totalQuestions / limit);
        return {questions, totalQuestions, numberOfPages};
    }
    catch(error: any) {
        return errorHandler(error);
    }
}

export const createQuestion = async(prevState: any, formData: FormData) => {
    try {
        const token = cookies().get('token')?.value;
        if (!token) {
            throw new Error;
        }
        const {userID} = verifyToken(token!);
        const data = convertFormDataToObject(formData);
        QuestionSchema.parse({
            title: data.title,
            body: data.body,
            tags: !Array.isArray(data.tags) ? [data.tags] : data.tags
        });
        const question = await db.question.create({
            data: {
                title: data.title,
                body: data.body,
                tags: !Array.isArray(data.tags) ? [data.tags] : data.tags,
                userId: userID
            }
        });
        return {question};
    }
    catch(error: any) {
        return errorHandler(error);
    }
}

export const getSingleQuestion = async(id: string) => {
    try {
        const question = await db.question.findUnique({
            where: {
                id: id
            },
            include: {
                user: true
            }
        });
        if (!question) {
            const error = new Error('No Question Found with the ID Provided!');
            error.name = 'CustomError';
            throw error;
        }
        await db.question.update({
            where: {
                id: id
            },
            data: {
                views: question.views + 1 
            }
        });
        question.views = question.views + 1;
        // If logged in provide if positive/negative researchEffortRating
        const token = cookies().get('token')?.value;
        if (token) {
            // Get UserID from Token
            const {userID} = verifyToken(token!);
            // Check if Research Effort Rating is made for this question by this userID
            const researchEffortRating = await db.researchEffortRating.findFirst({
                where: {
                    questionId: id,
                    userId: userID
                }
            });
            // If did create append if not don't
            if (researchEffortRating) {
                return {question: {...question, researchEffortRatingStatus: researchEffortRating.rating ? 'positive' : 'negative'}};
            }
        }
        return {question: {...question, researchEffortRatingStatus: 'nothing'}};
    }
    catch(error: any) {
        return errorHandler(error);
    }
}

export const updateResearchEffortRating = async(prevState: any, formData: FormData) => {
    try {
        const token = cookies().get('token')?.value;
        if (!token) {
            throw new Error;
        }
        const {userID} = verifyToken(token!);
        const {questionId, type} = convertFormDataToObject(formData);
        const question = (await db.question.findFirst({
            where: {
                id: questionId
            }
        }))!;
        if (question.deletedAt) {
            return {msg: 'Deleted Questions are not mutatable'};
        }
        if (question.answered) {
            return {msg: 'Answered Questions are not mutatable'};
        }
        const researchEffortRating = (await db.researchEffortRating.findFirst({
            where: {
                questionId: questionId,
                userId: userID
            }
        }))!;
        if (!researchEffortRating) {
            await db.researchEffortRating.create({
                data: {
                    questionId: questionId,
                    userId: userID,
                    rating: type === 'increment' ? true : false
                }
            });
            await db.question.update({
                where: {
                    id: questionId
                },
                data: {
                    researchEffortRating: type === 'increment' ? {increment: 1} : {decrement: 1}
                }
            });
            if (type === 'increment') {
                const updatedQuestion = (await db.question.findUnique({
                    where: {
                        id: questionId
                    }
                }))!;
                if (updatedQuestion.researchEffortRating === -5 && !updatedQuestion.answered) {
                    await db.question.update({
                        where: {
                            id: questionId
                        },
                        data: {
                            deletedAt: new Date(Date.now())
                        }
                    });
                    return {increment: 1, researchEffortRatingStatus: 'positive', deleted: true};
                }
                return {increment: 1, researchEffortRatingStatus: 'positive'};
            }
            else {
                const updatedQuestion = (await db.question.findUnique({
                    where: {
                        id: questionId
                    }
                }))!;
                if (updatedQuestion.researchEffortRating === -5 && !updatedQuestion.answered) {
                    await db.question.update({
                        where: {
                            id: questionId
                        },
                        data: {
                            deletedAt: new Date(Date.now())
                        }
                    });
                    return {decrement: 1, researchEffortRatingStatus: 'negative', deleted: true};
                }
                return {decrement: 1, researchEffortRatingStatus: 'negative', deleted: updatedQuestion.deletedAt && true};
            }
        }
        if (type === 'increment') {
            // If your trying to increment and you've already decremented we should increment the researchEffortRating by 2 (only if researchEffortRating is equal to -1, otherwise by 1) and update researchEffortRating.rating to true
            if (!researchEffortRating?.rating) {
                await db.question.update({
                    where: {
                        id: questionId
                    },
                    data: {
                        researchEffortRating: question.researchEffortRating === -1 ? {increment: 2} : {increment: 1}
                    }
                });
                await db.researchEffortRating.update({
                    where: {
                        id: researchEffortRating.id
                    },
                    data: {
                        rating: true
                    }
                });
                const updatedQuestion = (await db.question.findUnique({
                    where: {
                        id: questionId
                    }
                }))!;
                if (updatedQuestion.researchEffortRating === -5 && !updatedQuestion.answered) {
                    await db.question.update({
                        where: {
                            id: questionId
                        },
                        data: {
                            deletedAt: new Date(Date.now())
                        }
                    });
                    return {increment: question.researchEffortRating === -1 ? 2 : 1, researchEffortRatingStatus: 'positive', deleted: true};
                }
                return {increment: question.researchEffortRating === -1 ? 2 : 1, researchEffortRatingStatus: 'positive'};
            }
            // If your trying to increment and you've already incremented we should decrement the researchEffortRating by 1 and delete the researchEffortRating
            await db.question.update({
                where: {
                    id: questionId
                },
                data: {
                    researchEffortRating: {
                        decrement: 1
                    }
                }
            });
            await db.researchEffortRating.delete({
                where: {
                    id: researchEffortRating.id
                }
            });
            const updatedQuestion = (await db.question.findUnique({
                where: {
                    id: questionId
                }
            }))!;
            if (updatedQuestion.researchEffortRating === -5 && !updatedQuestion.answered) {
                await db.question.update({
                    where: {
                        id: questionId
                    },
                    data: {
                        deletedAt: new Date(Date.now())
                    }
                });
                return {decrement: 1, researchEffortRatingStatus: 'nothing', deleted: true};
            }
            return {decrement: 1, researchEffortRatingStatus: 'nothing'};
        }
        else if (type === 'decrement') {
            // If your trying to decrement and you've already incremented we should decrement the researchEffortRating by 2 (only if researchEffortRating is equal to 1, otherwise by 1) and update researchEffortRating.rating to false
            if (researchEffortRating?.rating) {
                await db.question.update({
                    where: {
                        id: questionId
                    },
                    data: {
                        researchEffortRating: question.researchEffortRating === 1 ? {decrement: 2} : {decrement: 1}
                    }
                });
                await db.researchEffortRating.update({
                    where: {
                        id: researchEffortRating.id
                    },
                    data: {
                        rating: false
                    }
                });
                const updatedQuestion = (await db.question.findUnique({
                    where: {
                        id: questionId
                    }
                }))!;
                if (updatedQuestion.researchEffortRating === -5 && !updatedQuestion.answered) {
                    await db.question.update({
                        where: {
                            id: questionId
                        },
                        data: {
                            deletedAt: new Date(Date.now())
                        }
                    });
                    return {decrement: question.researchEffortRating === 1 ? 2 : 1, researchEffortRatingStatus: 'negative', deleted: true};
                }
                return {decrement: question.researchEffortRating === 1 ? 2 : 1, researchEffortRatingStatus: 'negative'};
            }
            // If your trying to decrement and you've already decremented we should increment the researchEffortRating by 1 and delete the researchEffortRating
            await db.question.update({
                where: {
                    id: questionId
                },
                data: {
                    researchEffortRating: {
                        increment: 1
                    }
                }
            });
            await db.researchEffortRating.delete({
                where: {
                    id: researchEffortRating.id
                }
            });
            const updatedQuestion = (await db.question.findUnique({
                where: {
                    id: questionId
                }
            }))!;
            if (updatedQuestion.researchEffortRating === -5 && !updatedQuestion.answered) {
                await db.question.update({
                    where: {
                        id: questionId
                    },
                    data: {
                        deletedAt: new Date(Date.now())
                    }
                });
                return {increment: 1, researchEffortRatingStatus: 'nothing', deleted: true};
            }
            return {increment: 1, researchEffortRatingStatus: 'nothing'};
        }
    }
    catch(error: any) {
        return errorHandler(error);
    }
}

export const updateQuestion = async(prevState: any, formData: FormData) => {
    try {
        const token = cookies().get('token')?.value;
        if (!token) {
            throw new Error;
        }
        const {userID} = verifyToken(token!);
        const {id, title, body, tags} = convertFormDataToObject(formData);
        QuestionSchema.parse({
            title: title,
            body: body,
            tags: !Array.isArray(tags) ? [tags] : tags
        });
        const question = await db.question.findUnique({
            where: {
                id: id,
                userId: userID
            }
        });
        if (!question) {
            createError('No Question Found with the ID Provided!');
        }
        if (question?.answered || question?.researchEffortRating === -5) {
            createError('You cannot mutate a question that is answered/closed');
        }
        const updatedQuestion = await db.question.update({
            where: {
                id: id
            },
            include: {
                user: true
            },
            data: {
                title: title,
                body: body,
                tags: !Array.isArray(tags) ? [tags] : tags
            }
        });
        return {question: updatedQuestion};
    }
    catch(error: any) {
        return errorHandler(error);
    }
}

export const deleteQuestion = async(prevState: any, formData: FormData) => {
    try {
        const token = cookies().get('token')?.value;
        if (!token) {
            throw new Error;
        }
        const {userID} = verifyToken(token!);
        const {id} = convertFormDataToObject(formData);
        const question = (await db.question.findUnique({
            where: {
                id: id,
                userId: userID
            }
        }))!;
        if (!question) {
            createError('No Question Found with the ID Provided!');
        }
        if (question.answered) {
            createError(`You cannot delete a question that has been answered!`);
        }
        // Delete Any Comments Associated with Question
        await db.comment.deleteMany({
            where: {
                questionId: id,
                userId: userID
            }
        });
        // Delete Question
        await db.question.delete({
            where: {
                id: id,
                userId: userID
            }
        });
        return {deleted: true};
    }
    catch(error: any) {
        return errorHandler(error);
    }
}