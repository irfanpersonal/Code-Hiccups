import {type TagsType} from "../_features/tags/tagsSlice";
import {nanoid} from 'nanoid';
import TagsListItem from "./TagsListItem";
import Image from 'next/image';
import desert from '../_images/desert.jpg';

interface TagsListProps {
    data: TagsType[],
    totalTags: number
}

const TagsList: React.FunctionComponent<TagsListProps> = ({data, totalTags}) => {
    return (
        <div>
            <div className="border-b-8 border-black flex justify-between items-center pb-4">
                <div className="font-bold">{totalTags === 0 ? 'No Tags Found...' : `${totalTags} tags found ...`}</div>
            </div>
            {totalTags === 0 && (
                <div className="flex flex-col items-center">
                    <Image className="object-contain w-1/2 h-auto mx-auto mt-4" src={desert} width={150} height={150} alt="Empty Nature" priority/>
                    <div className="font-bold text-2xl mt-4">-_-</div>
                </div>
            )}
            <section className="grid grid-cols-4 gap-4 my-4">
                {data.map(item => {
                    return (
                        <TagsListItem key={nanoid()} data={item}/>
                    );
                })}
            </section>
        </div>
    );
}

export default TagsList;