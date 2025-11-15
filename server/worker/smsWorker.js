const mongoose = require("mongoose");
const BulkSmsJob = require("../model/BulkSmsJob");
const SmsBatch = require("../model/SmsBatch");
const sendSms = require("../utils/sendSms");

require("dotenv").config();

async function initDB() {
  await mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.DB_NAME
  });
}

async function processJobs() {
  const BATCH_SIZE = 20;

  const jobs = await BulkSmsJob.find({ status: "pending" })
    .limit(BATCH_SIZE);

  for (let job of jobs) {
    const batch = await SmsBatch.findById(job.batchId);
    if (!batch) continue;

    try {
      job.status = "processing";
      job.attempts += 1;
      await job.save();

      await sendSms(job.phoneNumber, job.message);

      job.status = "sent";
      await job.save();

      batch.sent += 1;
      batch.pending -= 1;

    } catch (err) {
      job.status = "failed";
      job.error = err.message;
      await job.save();

      batch.failed += 1;
      batch.pending -= 1;
    }

    // If everything is processed
    if (batch.pending <= 0 && !batch.completedAt) {
      batch.completedAt = new Date();
    }

    await batch.save();
  }

  console.log("Processed:", jobs.length);
}

async function startWorker() {
  await initDB();
  console.log("SMS Worker started");

  setInterval(processJobs, 5000);
}

startWorker();
