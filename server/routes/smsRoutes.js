import { Router } from 'express';
import Sms from '../controllers/sms';
const router = Router();

router.post('/send-bulk', Sms.SendBulk)
router.get('/batch/:id', Sms.GetBatch)
router.get('/batches', Sms.GetAllBatches)

export default router