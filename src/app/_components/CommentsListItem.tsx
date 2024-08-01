import {setIsEditingComment, type CommentType} from "../_features/comments/commentsSlice";
import {EditCommentForm, DeleteCommentForm, MarkCommentAsAnswerForm} from '.';
import Link from 'next/link';
import Image from 'next/image';
import moment from 'moment';
import useStore from "../_utils/redux";
import emptyProfilePicture from '../_images/empty-profile-picture.jpeg';

interface CommentsListItemProps {
    data: CommentType
}

const CommentsListItem: React.FunctionComponent<CommentsListItemProps> = ({data}) => {
    const dispatch = useStore().dispatch;
    const {user} = useStore().selector.user;
    const {isEditingComment, changeToTriggerRerenderOfMarkAsCorrectComponent} = useStore().selector.comments;
    const {singleQuestion} = useStore().selector.questions;
    return (
        <article className={`outline outline-4 ${data.isAnswerToQuestion ? 'outline-lime-500' : null}`}>
            {(data.userId === user!.id && isEditingComment === data.id) ? (
                <EditCommentForm data={data}/>
            ) : (
                <>
                    <p className="mt-4 whitespace-pre-wrap bg-neutral-400 p-4 w-full">{data!.content}</p>
                    <div className="flex justify-between items-center p-4">
                        <div className="flex justify-center items-center">
                            <div className="mr-4">{moment(String(data.createdAt)).format('MMMM Do YYYY, h:mm:ss a')}</div>
                            {(data.userId === user!.id && !data.isAnswerToQuestion && !singleQuestion?.answered && !singleQuestion?.deletedAt) && (
                                <>
                                    <div onClick={() => {
                                        dispatch(setIsEditingComment(data.id));
                                    }} className="bg-black text-white mr-4 py-2 px-4 cursor-pointer select-none">Edit</div>
                                    <DeleteCommentForm id={data.id}/>
                                </>
                            )}
                        </div>
                        <div className="flex justify-center items-center">
                            {(singleQuestion?.userId === user!.id && !singleQuestion.answered && data.userId !== user!.id) && (
                                <MarkCommentAsAnswerForm key={changeToTriggerRerenderOfMarkAsCorrectComponent} data={data}/>
                            )}
                            <div className="mx-4">
                                <Link href={`/users/${data.userId}`}><Image src={data.user.profilePicture || emptyProfilePicture} width={25} height={25} alt={data.user.userName}/></Link>
                            </div>
                            <div>
                                <Link href={`/users/${data.userId}`}><div>{data.user.userName}</div></Link>
                                <div>🥇 {data.user.reputation}</div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </article>
    );
}

export default CommentsListItem;