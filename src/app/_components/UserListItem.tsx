import {type UserType} from "../_features/user/userSlice";
import Link from 'next/link';
import Image from 'next/image';
import emptyProfilePicture from '@/app/_images/empty-profile-picture.jpeg';

interface UserListItemProps {
    data: UserType
}

const UserListItem: React.FunctionComponent<UserListItemProps> = ({data}) => {
    return (
        <article className="flex items-center">
            <div className="mr-4">
                <Link href={`/users/${data.id}`}><Image className="rounded-full w-24 h-24 object-cover border-4" src={data.profilePicture || emptyProfilePicture} width={100} height={100} alt={data.userName} priority/></Link>
            </div>
            <div className="flex flex-col">
                <Link href={`/users/${data.id}`}><div className="text-sky-600">{data.userName}</div></Link>
                <div>{data.location}</div>
                <div className="font-bold">{data.reputation}</div>
                <div>{data.interests.map((item, index, array) => {
                    return (
                        <span key={item}>{item}{!(index === array.length - 1) && ', '}</span>
                    );
                })}</div>
            </div>
        </article>
    );
}

export default UserListItem;