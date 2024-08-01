'use server';

import db from '@/app/_utils/db';
import {detailedInterests} from '@/app/_utils/interests';
import errorHandler from '@/app/_utils/errorHandler';

export const getAllTags = async (data: {search: string, pageValue: string, limitValue: string}) => {
    try {
        const {search, pageValue, limitValue} = data;
        const page = Number(pageValue) || 1;
        const limit = Number(limitValue) || 10;
        const searchLower = search.toLowerCase();
        const filteredInterests = detailedInterests.filter(interest =>
            interest.word.toLowerCase().includes(searchLower)
        );
        const totalTags = filteredInterests.length;
        const numberOfPages = Math.ceil(totalTags / limit);
        const skip = (page - 1) * limit;
        const paginatedInterests = filteredInterests.slice(skip, skip + limit);
        const tags = [];
        for (let i = 0; i < paginatedInterests.length; i++) {
            const questions = await db.question.findMany({
                where: {
                    tags: {
                        has: paginatedInterests[i].word
                    }
                }
            });
            tags.push({word: paginatedInterests[i].word, definition: paginatedInterests[i].definition, amountOfQuestionsWithThisTag: questions.length});
        }
        return {tags, totalTags, numberOfPages};
    } catch (error: any) {
        return errorHandler(error);
    }
};