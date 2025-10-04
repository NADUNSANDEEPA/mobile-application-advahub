const express = require("express");
const Page = require("../models/Page");
const FavoritePages = require("../models/FavoritePages");
const logger = require("../utils/logger");
const sendResponse = require("../utils/response");
const { convertCountry } = require("../utils/countries");

const router = express.Router();


router.post("/create", async (req, res) => {
    try {
        const {
            pageOwner,
            address,
            businessName,
            category,
            contactNumber,
            coverPhoto,
            description,
            email,
            logo,
            operatingHours,
            registrationNumber,
            website,
            country,
        } = req.body;

        if (!pageOwner || !businessName) {
            return sendResponse(res, 400, false, "pageOwner and businessName are required");
        }

        const page = new Page({
            pageOwner,
            address,
            businessName,
            category,
            contactNumber,
            coverPhoto,
            description,
            email,
            logo,
            operatingHours,
            registrationNumber,
            website,
            country,
        });

        await page.save();
        logger.info(`Page created: ${page._id}`);
        return sendResponse(res, 201, true, "Page created successfully", page);
    } catch (err) {
        logger.error("Error creating page", err);
        return sendResponse(res, 500, false, "Internal server error");
    }
});


router.get("/getpage/:id", async (req, res) => {
    try {
        const page = await Page.findById(req.params.id).populate("pageOwner", "name email");
        if (!page) {
            return sendResponse(res, 404, false, "Page not found");
        }
        return sendResponse(res, 200, true, "Page fetched successfully", page);
    } catch (err) {
        logger.error("Error fetching page", err);
        return sendResponse(res, 500, false, "Internal server error");
    }
});


router.put("/updatepage/:id", async (req, res) => {
    try {
        const page = await Page.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!page) {
            return sendResponse(res, 404, false, "Page not found");
        }
        return sendResponse(res, 200, true, "Page updated successfully", page);
    } catch (err) {
        logger.error("Error updating page", err);
        return sendResponse(res, 500, false, "Internal server error");
    }
});


router.delete("/deletepage/:id", async (req, res) => {
    try {
        const page = await Page.findByIdAndDelete(req.params.id);
        if (!page) {
            return sendResponse(res, 404, false, "Page not found");
        }
        return sendResponse(res, 200, true, "Page deleted successfully");
    } catch (err) {
        logger.error("Error deleting page", err);
        return sendResponse(res, 500, false, "Internal server error");
    }
});

router.get("/getPageByOwnerId/:ownerId", async (req, res) => {
    const { ownerId } = req.params;

    try {
        const page = await Page.findOne({ "pageOwner._id": ownerId });

        if (!page) {
            return res.status(404).json({
                success: false,
                message: "No page found for this owner",
            });
        }

        return res.status(200).json({
            success: true,
            data: page,
        });
    } catch (error) {
        console.error("Error fetching page:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

router.get("/getPagesBasedOnCountry/:country", async (req, res) => {
    try {
        const { country } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        if (!country) {
            return res.status(400).json({ success: false, message: "Country is required" });
        }

        const skip = (page - 1) * limit;

        const pages = await Page.find(convertCountry(country))
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        if (!pages || pages.length === 0) {
            return res.status(404).json({ success: false, message: "No pages found for this country" });
        }

        const totalCount = await Page.countDocuments(convertCountry(country));

        res.status(200).json({
            success: true,
            data: pages,
            pagination: {
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit),
                totalCount
            }
        });
    } catch (err) {
        console.log("Error fetching pages by country", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});


router.post("/pageMakeAsFavorite", async (req, res) => {
  try {
    const { visitorId, visitorEmail, pageId, pageTitle, isFavorite } = req.body;

    if (!visitorId || !visitorEmail || !pageId || !pageTitle) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const favorite = await FavoritePages.findOneAndUpdate(
      { "visitor._id": visitorId, "page._id": pageId },
      {
        visitor: { _id: visitorId, email: visitorEmail },
        page: { _id: pageId, title: pageTitle },
        isFavorite
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "Favorite status updated successfully",
      data: favorite
    });
  } catch (error) {
    console.error("Error saving favorite:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
