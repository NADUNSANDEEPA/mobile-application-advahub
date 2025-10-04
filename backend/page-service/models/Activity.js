const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    specialInstruction: {
        type: String
    },
    ageGroup: {
        type: String,
        default: "All"
    },
    coverPhoto: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    pageId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: true
    }
});

module.exports = mongoose.model("Activity", activitySchema);
