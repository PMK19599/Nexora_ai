import { Router } from 'express';
import { getDashboardStats, getUsers } from '../controllers/adminController';
import { protect, authorize } from '../middleware/auth';
const r = Router();
r.get('/dashboard', protect, authorize('admin'), getDashboardStats);
r.get('/users', protect, authorize('admin'), getUsers);
export default r;
