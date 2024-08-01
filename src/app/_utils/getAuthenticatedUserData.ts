import {NextRequest} from "next/server";
import {type ITokenPayload} from './token';
 
const getAuthenticatedUserData = (request: NextRequest): ITokenPayload => {
    const userData = JSON.parse((request.headers.get('x-user'))!) as ITokenPayload;
    return userData;
}

export default getAuthenticatedUserData;