'use client';

import {type TagsType} from "../_features/tags/tagsSlice";
import {useRouter} from "next/navigation";
import useStore from "../_utils/redux";
import {setGetAllQuestionsData} from "../_features/questions/questionsSlice";

interface TagsListItemProps {
    data: TagsType
}

const TagsListItem: React.FunctionComponent<TagsListItemProps> = ({data}) => {
    const dispatch = useStore().dispatch;
    const router = useRouter();
    return (
        <article onClick={() => {
            dispatch(setGetAllQuestionsData({tagValue: data.word}));
            router.push('/questions');
        }} className="flex flex-col justify-center items-center border-4 p-4 rounded-lg h-full">
            <div className="bg-gray-400 py-2 px-4 inline-block rounded-full mb-4">{data.word}</div>
            <p>{data.definition}</p>
            <div className="self-start mt-4 font-bold">{data.amountOfQuestionsWithThisTag} question{data.amountOfQuestionsWithThisTag > 1 && 's'}</div>
        </article>
    );
}

export default TagsListItem;