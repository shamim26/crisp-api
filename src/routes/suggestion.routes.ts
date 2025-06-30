import { Router } from "express";
import getSuggestion from "../controllers/suggestion/GetSuggestion";

const suggestionRouter = Router();

suggestionRouter.route("/").get(getSuggestion);

export default suggestionRouter;
