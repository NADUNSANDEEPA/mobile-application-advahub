const mongoose = require("mongoose");

const PageSchema = new mongoose.Schema(
    {
        pageOwner: {
            _id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
            email: { type: String, required: true }
        },
        businessName: {
            type: String,
            required: [true, "Business name is required"],
            trim: true
        },

        contactNumber: {
            type: String,
            required: [true, "Contact number is required"],
            match: [/^[0-9+\- ]{7,15}$/, "Please enter a valid phone number"]
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            lowercase: true,
            trim: true,
            match: [/.+\@.+\..+/, "Please fill a valid email address"]
        },

        registrationNumber: {
            type: String,
            trim: true
        },

        category: {
            type: String,
            trim: true,
            default: ""
        },

        address: {
            type: String,
            default: ""
        },

        website: {
            type: String,
            trim: true,
            default: ""
        },

        operatingHours: {
            type: String,
            trim: true,
            default: ""
        },

        description: {
            type: String,
            maxlength: [500, "Description cannot exceed 500 characters"],
            default: ""
        },

        coverPhoto: {
            type: String,
            default: null
        },

        logo: {
            type: String,
            default: null
        },

        isActive: {
            type: Boolean,
            default: true
        },
        country: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Page", PageSchema);
