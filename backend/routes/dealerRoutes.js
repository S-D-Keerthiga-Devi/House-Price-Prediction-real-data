import express from "express";
const router = express.Router();
import {
    submitDealerConnect,
    submitContactDeveloper,
    submitChannelPartner,
    submitRegistrationDocs
} from "../controllers/dealerController.js";

router.post("/dealer-connect", submitDealerConnect);
router.post("/contact-developer", submitContactDeveloper);
router.post("/channel-partner", submitChannelPartner);
router.post("/registration-docs", submitRegistrationDocs);

export default router;
