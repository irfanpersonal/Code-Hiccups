import {type UserType} from '../_features/user/userSlice';
import UserListItem from './UserListItem';
import Image from 'next/image';
import desert from '../_images/desert.jpg';

interface UsersListProps {
    data: UserType[],
    totalUsers: number
}
 
const UsersList: React.FunctionComponent<UsersListProps> = ({data, totalUsers}) => {
    return (
        <div>
            <div className="border-b-8 border-black flex justify-between items-center pb-4">
                <div className="font-bold">{totalUsers === 0 ? 'No Users Found...' : `${totalUsers} users found ...`}</div>
            </div>
            {totalUsers === 0 && (
                <div className="flex flex-col items-center">
                    <Image className="object-contain w-1/2 h-auto mx-auto mt-4" src={desert} width={150} height={150} alt="Empty Nature" priority/>
                    <div className="font-bold text-2xl mt-4">-_-</div>
                </div>
            )}
            <section className="grid grid-cols-2 gap-4 my-4">
                {data.map(item => {
                    return (
                        <UserListItem key={item.id} data={item}/>
                    );
                })}
            </section>
        </div>
    );
}

export default UsersList;