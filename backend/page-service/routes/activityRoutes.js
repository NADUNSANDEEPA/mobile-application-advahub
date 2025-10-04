const express = require("express");
const Activity = require("../models/Activity");
const logger = require("../utils/logger");
const sendResponse = require("../utils/response");

const router = express.Router();


router.post("/publish", async (req, res) => {
    try {
        const { title, description, specialInstruction, ageGroup, coverPhoto, pageId } = req.body;

        if (!title || !pageId) {
            return sendResponse(res, 400, false, "Title and Page ID are required");
        }

        const activity = new Activity({
            title,
            description,
            specialInstruction,
            ageGroup,
            coverPhoto,
            pageId
        });

        await activity.save();
        logger.info(`Activity created: ${activity._id}`);
        return sendResponse(res, 201, true, "Activity created successfully", activity);
    } catch (err) {
        logger.error("Error creating activity", err);
        return sendResponse(res, 500, false, "Internal server error");
    }
});

router.get("/get/:id", async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) {
            return sendResponse(res, 404, false, "Activity not found");
        }
        return sendResponse(res, 200, true, "Activity fetched successfully", activity);
    } catch (err) {
        logger.error("Error fetching activity", err);
        return sendResponse(res, 500, false, "Internal server error");
    }
});


router.get("/retrieve/:pageId", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;   
        const limit = parseInt(req.query.limit) || 5; 
        const pageId = req.params.pageId;

        const totalActivities = await Activity.countDocuments({ pageId });

        const activities = await Activity.find({ pageId })
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 }); 

        return sendResponse(res, 200, true, "Activities fetched successfully", {
            activities,
            pagination: {
                total: totalActivities,
                page: page,
                limit: limit,
                totalPages: Math.ceil(totalActivities / limit),
            },
        });
    } catch (err) {
        logger.error("Error fetching activities", err);
        return sendResponse(res, 500, false, "Internal server error");
    }
});


router.put("/activityStatusChange/:activityId", async (req, res) => {
  const { activityId } = req.params;
  const { isActive } = req.body;

  if (typeof isActive !== "boolean") {
    return res.status(400).json({ success: false, message: "isActive must be boolean" });
  }

  try {
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ success: false, message: "Activity not found" });
    }

    activity.status = isActive;
    await activity.save();

    return res.status(200).json({ success: true, message: "Activity status updated", data: activity });
  } catch (error) {
    console.error("Error updating activity status:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});




module.exports = router;