import {z} from 'zod';
import {isValidCountry} from '../_utils/countries';

export const UserSchema = z.object({
    id: z.string().optional(),
    displayName: z.string().min(3),
    userName: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(5),
    profilePicture: z.string().min(1).optional(),
    location: z.string().refine((locationValue) => {
		if (!isValidCountry(locationValue)) {
			return false;
		}
		return true;
	}),
    bio: z.string().min(1),
    interests: z.string().array().refine((value) => {
        if (!value.length) {
          return false;
        }
		if (value.length > 5) {
			return false;
		}
        if (value.includes('')) {
          return false;
        }
        return true;
    })
});

export type UserType = z.infer<typeof UserSchema>;

export const QuestionSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1),
    body: z.string().min(1),
    tags: z.string().array().refine((value) => {
        if (!value.length) {
          return false;
        }
		if (value.length > 5) {
			return false;
		}
        if (value.includes('')) {
          return false;
        }
        return true;
    })
});

export type QuestionType = z.infer<typeof QuestionSchema>;