'use client';

import React from 'react';
import useStore from '@/app/_utils/redux';
import moment from 'moment';
import {Loading, PositiveResearchEffortRating, NegativeResearchEffortRating, EditQuestion, DeleteQuestionForm, CreateCommentForm, CommentsList} from '@/app/_components';
import {getSingleQuestion} from "@/app/_serverActions/questions/actions";
import {setSingleQuestion, setGetSingleQuestionLoading, toggleIsEditing} from '@/app/_features/questions/questionsSlice';
import {useRouter} from 'next/navigation';
import Image from 'next/image';
import emptyProfilePicture from '@/app/_images/empty-profile-picture.jpeg';
import Link from 'next/link';
import {toggleIsCreatingComment} from '@/app/_features/comments/commentsSlice';

interface SingleQuestionPageProps {
    params: {
        id: string
    }
}

const SingleQuestionPage: React.FunctionComponent<SingleQuestionPageProps> = ({params}) => {
    const dispatch = useStore().dispatch;
    const router = useRouter();
    const {user} = useStore().selector.user;
    const {getSingleQuestionLoading, singleQuestion, isEditing} = useStore().selector.questions;
    const {isCreatingComment} = useStore().selector.comments;
    React.useEffect(() => {
        const fetchSingleQuestion = async() => {
            const {question, msg} = await getSingleQuestion(params.id) as any;
            if (msg) {
                router.push('/questions');
            }
            else if (question) {
                dispatch(setSingleQuestion(question));
            }
            dispatch(setGetSingleQuestionLoading(false));
        }
        fetchSingleQuestion();
    }, []);
    if (getSingleQuestionLoading) {
        return (
            <Loading title="Loading Single Question" position='normal'/>
        );
    }
    return (
        <div>
            <div className="text-3xl font-bold">{singleQuestion!.title}</div>
            <div className="flex mt-4">
                <div className="mr-4"><span className="text-gray-500">Asked</span> {moment(singleQuestion!.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</div>
                <div className="mr-4"><span className="text-gray-500">Viewed</span> {singleQuestion!.views} time{Number(singleQuestion!.views) !== 1 && 's'}</div>
                <div><span className="text-gray-500">Answered</span> {singleQuestion!.answered ? <span className="text-green-600">Yes</span> : <span className="text-red-500">No</span>}</div>
            </div>
            {singleQuestion?.deletedAt && (
                <h1 className="outline outline-red-500 p-4 my-2">This question has reached the -5 research effort rating and is now closed. Further comments or adjustments to the research effort rating are no longer possible.</h1>
            )}
            {singleQuestion?.answered && (
                <h1 className="outline outline-red-500 p-4 my-2">Modifications to the Research Effort Rating are not permitted after the question has been answered/closed.</h1>
            )}
            {isEditing ? (
                <EditQuestion data={singleQuestion!} toggleIsEditing={toggleIsEditing}/>
            ) : (
                <>
                    <div className="flex">
                        <div className="mr-4 self-start mt-4">
                            <PositiveResearchEffortRating data={singleQuestion!}/>
                            <div className="text-center">{singleQuestion!.researchEffortRating}</div>
                            <NegativeResearchEffortRating data={singleQuestion!}/>
                        </div>
                        {/* whitespace-pre-wrap CSS make it so that the text maintains its spacing and indentation */}
                        <p className="mt-4 whitespace-pre-wrap bg-neutral-400 p-4 w-full">{singleQuestion!.body}</p>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                        <div className="flex self-start justify-center items-center">
                            {(singleQuestion!.userId === user!?.id && !singleQuestion?.answered && !singleQuestion?.deletedAt) && (
                                <div className="bg-black text-white mr-4 cursor-pointer select-none self-center py-2 px-4" onClick={() => {
                                    if (!singleQuestion?.deletedAt || !singleQuestion.answered) {
                                        if (!user) {
                                            router.push('/auth');
                                            return;
                                        }
                                        dispatch(toggleIsEditing());
                                    }
                                }}>Edit</div>
                            )}
                            {(!singleQuestion?.answered && !singleQuestion?.deletedAt && !isCreatingComment) && (
                                <div className="bg-black text-white mr-4 cursor-pointer select-none self-center py-2 px-4" onClick={() => {
                                    if (!singleQuestion?.deletedAt || !singleQuestion.answered) {
                                        if (!user) {
                                            router.push('/auth');
                                            return;
                                        }
                                        dispatch(toggleIsCreatingComment());
                                    }
                                }}>Create Comment</div>
                            )}
                            {(singleQuestion!.userId === user?.id && !singleQuestion?.answered && !singleQuestion?.deletedAt) && (
                                <DeleteQuestionForm data={singleQuestion!.id}/>
                            )}
                            <div className="bg-black text-white cursor-pointer select-none mr-4 active:bg-gray-500 self-center py-2 px-4" onClick={async() => {
                                if (navigator.clipboard) {
                                    await navigator.clipboard.writeText(window.location.href);
                                }
                            }}>Share</div>
                            <div className="flex flex-wrap mt-2">
                                {singleQuestion!.tags.map((interest, index) => (
                                    <div key={index} className="bg-gray-200 rounded-full py-1 px-3 text-sm text-gray-700 mr-2 mb-2">{interest}</div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-cyan-200 flex flex-col p-4 rounded-lg select-none">
                            <div>asked {moment(singleQuestion!.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</div>
                            <div className="flex">
                                <Link href={`/users/${singleQuestion!.user!.id}`}><Image className="rounded-full mr-4" src={singleQuestion!.user!.profilePicture || emptyProfilePicture} width={25} height={25} alt={singleQuestion!.user!.userName} priority/></Link>
                                <div>
                                    <Link href={`/users/${singleQuestion!.user!.id}`}>{singleQuestion!.user!.userName}</Link>
                                    <div>🥇 {singleQuestion!.user!.reputation}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {isCreatingComment && (
                <CreateCommentForm questionId={params.id} toggleIsCreatingComment={toggleIsCreatingComment}/>
            )}
            <CommentsList data={params.id}/>
        </div>
    );
}

export default SingleQuestionPage;