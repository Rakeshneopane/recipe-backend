const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        author:{
            type: String,
            required: true,
        },
        difficulty :{
            type: String,
            enum: ['Easy', 'Intermediate', 'Difficult'],
        },
        prepTime :{
            type: Number,
            required: true,
        },
        cookTime :{
            type: Number,
            required: true,
        },
        ingredients :{
            type: [String],
            required: true,
        },
        instructions :{
            type: [String],
            required: true,
        },
        imageUrl :{
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Recipe", RecipeSchema);