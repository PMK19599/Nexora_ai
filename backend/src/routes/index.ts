import { Router } from 'express';
import auth from './authRoutes';
import review from './reviewRoutes';
import career from './careerRoutes';
import tutors from './tutorRoutes';
import groups from './groupRoutes';
import topics from './topicRoutes';
import admin from './adminRoutes';
import games from './gameRoutes';
import privacy from './privacyRoutes';

const r = Router();
r.use('/auth', auth);
r.use('/review', review);
r.use('/career', career);
r.use('/tutors', tutors);
r.use('/groups', groups);
r.use('/topics', topics);
r.use('/admin', admin);
r.use('/games', games);
r.use('/privacy', privacy);

export default r;
