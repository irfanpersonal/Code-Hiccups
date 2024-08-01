import {type QuestionType} from '../_features/questions/questionsSlice';
import {FaCheck} from 'react-icons/fa';
import {FaMagnifyingGlass} from "react-icons/fa6";
import Link from 'next/link';
import Image from 'next/image';
import moment from 'moment';
import emptyProfilePicture from '@/app/_images/empty-profile-picture.jpeg';

interface QuestionListItemProps {
    data: QuestionType
}

const QuestionsListItem: React.FunctionComponent<QuestionListItemProps> = ({data}) => {
    return (
        <article className="flex mt-4 border-b-4 border-black pb-4 mb-4">
            <div className="flex flex-col mr-4">
                <div>{data.researchEffortRating} Rating</div>
                <div className="flex justify-center items-center"><FaCheck className="mr-2"/>{data.comments.length} comments</div>
                <div>{data.views} Views</div>
            </div>
            <div className="flex flex-col">
                <Link href={`/questions/${data.id}`}><div className="flex items-center font-bold cursor-pointer"><FaMagnifyingGlass className="mr-2"/>{data.title}</div></Link>
                <div>{data.body.substring(0, 200)} ...</div> {/*I only want the first 200 characters so it doesn't look crazy */}
                <div className="flex justify-between mt-2">
                    <div>
                        {data.tags.map((tags, index) => (
                            <div onClick={() => {
                                // Navigate to '/tags' page
                                // Set the Search for Tags to "tags"
                            }} key={index} className="bg-gray-200 rounded-full py-1 px-3 text-sm text-gray-700 mr-2 cursor-pointer select-none font-bold">{tags}</div>
                        ))}
                    </div>
                    <div className="flex justify-center items-center">
                        <Image className="mr-4" src={data.user!.profilePicture || emptyProfilePicture} width={25} height={25} alt={data.user!.displayName}/>
                        <Link href={`/users/${data.user!.id}`}><div className="mr-4 cursor-pointer font-bold">{data.user!.userName}</div></Link>
                        <div className="mr-4">🥇 {data.user!.reputation}</div>
                        <div>asked {String(moment(data.createdAt).format('MMMM Do YYYY, h:mm:ss a'))}</div>
                    </div>
                </div>
            </div>
        </article>
    );
}

export default QuestionsListItem;