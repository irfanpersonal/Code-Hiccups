import React from 'react';
import {type UserType} from "../_features/user/userSlice";
import emptyProfilePicture from '../_images/empty-profile-picture.jpeg';
import Image from 'next/image';
import {FaMapMarkerAlt, FaClock} from 'react-icons/fa';
import moment from 'moment';
import {EditProfile, LogoutForm} from './';

interface ProfileDataProps {
    data: UserType,
    isSingleUser: boolean
}

const ProfileData: React.FunctionComponent<ProfileDataProps> = ({data, isSingleUser}) => {
    const [isEditing, setIsEditing] = React.useState<boolean>(false);
    if (isEditing) {
        return (
            <EditProfile data={data} setIsEditing={setIsEditing}/>
        );
    }
    return (
        <div className="p-4">
            <div className="flex items-center justify-center">
                <div className="relative overflow-hidden">
                    <Image className="w-24 h-24 rounded-full" src={data.profilePicture || emptyProfilePicture} width={125} height={125} alt={data.userName} priority/>
                </div>
            </div>
            <div className="text-center mt-4">
                <h1 className="text-2xl font-bold text-gray-800">{data.displayName}</h1>
                <p className="text-gray-600">@{data.userName}</p>
                <p className="text-gray-700 text-sm mt-2">{data.bio}</p>
            </div>
            <div className="mt-4 flex flex-wrap 2xl:justify-center xl:justify-center lg:justify-center md:justify-center sm:justify-normal">
                <div className="mr-4 mb-4">
                    <h1 className="text-xl font-semibold text-gray-800">Interests</h1>
                    <div className="flex flex-wrap mt-2">
                        {data.interests.map((interest, index) => (
                            <div key={index} className="bg-gray-200 rounded-full py-1 px-3 text-sm text-gray-700 mr-2 mb-2">{interest}</div>
                        ))}
                    </div>
                </div>
                <div className="mr-4 mb-4">
                    <h1 className="text-xl font-semibold text-gray-800">Reputation</h1>
                    <div className="flex items-center mt-2">
                        <div className="text-xl">🥇</div>
                        <div className="ml-2 text-gray-700">{data.reputation}</div>
                    </div>
                </div>
                <div className="mr-4 mb-4">
                    <h1 className="text-xl font-semibold text-gray-800">Location</h1>
                    <div className="flex items-center mt-2">
                        <div className="text-xl"><FaMapMarkerAlt/></div>
                        <div className="ml-2 text-gray-700">{data.location}</div>
                    </div>
                </div>
                <div className="mr-4 mb-4">
                    <h1 className="text-xl font-semibold text-gray-800">Joined</h1>
                    <div className="flex items-center mt-2">
                        <div className="text-xl"><FaClock/></div>
                        <div className="ml-2 text-gray-700">{moment(String(data.createdAt).replace(/^"(.*)"$/, '$1')).format('MMMM Do YYYY')}</div>
                    </div>
                </div>
            </div>
            {!isSingleUser && (
                <div className="text-center">
                    <button onClick={() => {
                        setIsEditing(currentState => {
                            return true;
                        });
                    }} className="bg-emerald-500 py-2 px-4 rounded-lg w-1/4 text-white select-none">Edit</button>
                    <LogoutForm/>
                </div>
            )}
        </div>
    );
};

export default ProfileData;
