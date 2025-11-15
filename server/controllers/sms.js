import SmsBatch from "../model/SmsBatch.js";
import BulkSmsJob from "../model/BulkSmsJob.js";
import Contact from "../model/Contact.js";

const SendBulk = async (req, res) => {
  try {
    const { contactIds, message, batchName } = req.body;

    const contacts = await Contact.find({ _id: { $in: contactIds } });

    const batch = await SmsBatch.create({
      name: batchName || `Bulk SMS - ${new Date().toISOString()}`,
      message,
      total: contacts.length,
      pending: contacts.length
    });

    // Create jobs linked to that batch
    const jobs = contacts.map(c => ({
      batchId: batch._id,
      contactId: c._id,
      phoneNumber: c.phoneNumber,
      message
    }));

    await BulkSmsJob.insertMany(jobs);

    res.json({ 
      status: "queued", 
      batchId: batch._id, 
      total: contacts.length 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to queue bulk sms" });
  }
}

const GetBatch = async (req, res) => {
  const batch = await SmsBatch.findById(req.params.id);
  const jobs = await BulkSmsJob.find({ batchId: req.params.id });

  res.json({ batch, jobs });
}

const GetAllBatches = async (req, res) => {
  const batches = await SmsBatch.find().sort({ createdAt: -1 });
  res.json(batches);
}

export default {SendBulk, GetAllBatches, GetBatch}
