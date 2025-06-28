import cron from "node-cron";

const syncJob = async () => {};

const scheduleSyncJob = () => {
  cron.schedule("0 2 * * *", () => {
    console.log("Running sync job ...");
    syncJob();
  });
};

export default scheduleSyncJob;
