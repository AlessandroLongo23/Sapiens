import 'server-only';
import { cache } from 'react';
import { currentUser } from './auth';
import { getOwnTutor } from './tutoring-admin';

/** The tutor area's shared data: the signed-in user and their own profile (null before it is created), once per request. */
export const tutorArea = cache(async () => {
	const user = await currentUser();
	const tutor = user ? await getOwnTutor(user.id) : null;
	return { user, tutor };
});
