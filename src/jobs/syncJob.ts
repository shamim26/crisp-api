import cron from "node-cron";
import axios from "axios";
import Suggestion, { suggestionSchema } from "../models/suggestion.model"; // Make sure this path is correct

const syncJob = async () => {
  try {
    // 1. Call the scraping microservice
    const { data: scrapedSuggestions } = await axios.post(
      "http://localhost:5000/scrape/suggestions",
      { search: "bose" } // You can loop over multiple brands if needed
    );

    // 2. Fetch all existing suggestions from the DB
    const existingSuggestions = await Suggestion.find({}, "productName");

    // 3. Create a Set of existing product names for fast lookup
    const existingNames = new Set(
      existingSuggestions.map((s) => s.productName)
    );

    // 4. Filter out only new/unique suggestions
    const newSuggestions = scrapedSuggestions.filter(
      (s: suggestionSchema) => !existingNames.has(s.productName)
    );

    // 5. Insert new suggestions
    if (newSuggestions.length > 0) {
      await Suggestion.insertMany(newSuggestions);
      console.log(`${newSuggestions.length} new suggestions added.`);
    } else {
      console.log("No new suggestions to add.");
    }
  } catch (error) {
    console.error("Error in sync job:", error);
  }
};

export default syncJob;

// const scheduleSyncJob = () => {
//   cron.schedule("0 2 * * *", () => {
//     console.log("Running sync job ...");
//     syncJob();
//   });
// };

// export default scheduleSyncJob;
