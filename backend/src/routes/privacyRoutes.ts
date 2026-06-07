import { Router } from 'express';
import { exportUserData, purgeUserAccount } from '../controllers/privacyController';
import { protect } from '../middleware/auth';

const r = Router();

r.get('/export-data', protect, exportUserData);
r.delete('/purge-account', protect, purgeUserAccount);

export default r;
