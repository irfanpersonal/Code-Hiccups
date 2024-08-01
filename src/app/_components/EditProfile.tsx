import React from 'react';
import ReactDOM from 'react-dom';
import {setUser, type UserType} from "../_features/user/userSlice";
import Image from 'next/image';
import emptyProfilePicture from '../_images/empty-profile-picture.jpeg';
import {countries} from "../_utils/countries";
import {interests} from "../_utils/interests";
import {editProfile} from '../_serverActions/user/actions';
import {toast} from 'react-toastify';
import {useStore} from 'react-redux';

interface EditProfileProps {
    data: UserType,
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
}

const initialState: any = {
    msg: null,
    user: null
};

const SubmitButton = () => {
    const {pending} = ReactDOM.useFormStatus();
    return (
        <button type="submit" className="w-1/4 bg-emerald-500 py-2 px-4 rounded-lg text-white" disabled={pending}>{pending ? 'Editing' : 'Edit'}</button>
    );
}

const EditProfile: React.FunctionComponent<EditProfileProps> = ({data, setIsEditing}) => {
    const dispatch = useStore().dispatch;
    const [state, formAction] = ReactDOM.useFormState(editProfile, initialState);
    React.useEffect(() => {
        if (state.user) {
            dispatch(setUser({...state.user, createdAt: JSON.stringify(state.user.createdAt), updatedAt: JSON.stringify(state.user.updatedAt)}));
            setIsEditing(currentState => {
                return false;
            });
            toast.success('Edited Profile!');
        }
    }, [state.user]);
    return (
        <div>
            <form action={formAction} className="bg-white rounded-lg shadow-lg p-4">
                <div className="text-center">
                    <Image className="block mx-auto w-24 h-24 rounded-full" src={data.profilePicture || emptyProfilePicture} width={150} height={150} alt={data.userName}/>
                    <input className="my-4" id="profilePicture" type="file" name="profilePicture"/>
                </div>
                <div className="w-1/2 mx-auto">
                    <div>
                        <label className="block mb-2" htmlFor="displayName">Display Name</label>
                        <input className="w-full py-2 px-4 mb-4 border" id="displayName" type="text" name="displayName" defaultValue={data.displayName} required/>
                    </div>
                    <div>
                        <label className="block mb-2" htmlFor="userName">User Name</label>
                        <input className="w-full py-2 px-4 mb-4 border" id="userName" type="text" name="userName" defaultValue={data.userName} required/>
                    </div>
                    <div>
                        <label className="block mb-2" htmlFor="bio">Bio</label>
                        <textarea className="w-full py-2 px-4 mb-2 border resize-none" id="bio" name="bio" defaultValue={data.bio} required></textarea>
                    </div>
                    <div>
                        <label className="block mb-2" htmlFor="location">Location</label>
                        <select className='border p-2 w-full mb-4' id="location" name="location" defaultValue={data.location} required>
                            {countries.map(country => {
                                return (
                                    <option key={country}>{country}</option>
                                );
                            })}
                        </select>
                    </div>
                    <div>
                        <label className="block my-2" htmlFor="interests">Interests (Max 5)</label>
                        <select className="border h-20 w-full p-2" id="interests" name="interests" onChange={(event) => {
                            const selectElement = event.target;
                            const maxSelections = 5;
                            const selectedOptions = Array.from(selectElement.selectedOptions);
                            if (selectedOptions.length > maxSelections) {
                                selectedOptions[selectedOptions.length - 1].selected = false;
                            }
                        }} defaultValue={data.interests} multiple>
                            {interests.map(interest => {
                                return (
                                    <option className="p-1" key={interest} value={interest}>{interest}</option>
                                );
                            })}
				        </select>
                    </div>
                </div>
                {state.msg && <p className="text-center mt-4 text-red-500 font-bold">{state.msg}</p>}
                <div className="flex flex-col justify-center items-center">
                    <button type="button" onClick={() => {
                        setIsEditing(currentState => {
                            return false;
                        });
                    }} className="w-1/4 bg-red-600 py-2 px-4 text-white rounded-lg my-4">Cancel</button>
                    <SubmitButton/>
                </div>
            </form>
        </div>
    );
}

export default EditProfile;