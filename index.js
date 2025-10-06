const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());

app.use(express.json());

const { initialiseDatabase } = require("./db/dbConnect");

initialiseDatabase();

const Recipe = require("./models/recipe.models");

const PORT = process.env.PORT || 3000;

app.get("/",(req,res)=>{
    res.send("Recipe API is working");
});

app.listen(PORT,()=>{
    console.log("Server running in port:", PORT);    
});

const createRecipe = async (recipeJson)=>{
    try {
        const newRecipe = new Recipe(recipeJson);
        const saveRecipe = await newRecipe.save(); 
        return saveRecipe;
    } catch (error) {
            console.log("Failed to create the recipe", error);
            throw error; 
    }
};

app.post("/recipes", async(req,res)=>{
    try {
        const recipe = req.body;
        if(!recipe.title || !recipe.author || !recipe.prepTime || !recipe.cookTime || !recipe.ingredients || recipe.ingredients.length === 0 || !recipe.instructions || recipe.instructions.length === 0 || !recipe.imageUrl){
           res.status(400).json({error : "Title, author, PrepTime, cookTime, ingredients, instructions and imageUrl are required."});
        }
        else{
            const savedRecipe = await createRecipe(req.body);
            res.status(201).json({message: "Recipe created successfully", recipe:savedRecipe});
        }
    } catch (error) {
        res.status(500).json({error: "Recipe creation failed."});
    }
});
const readAllRecipe = async()=>{
    try {
        const allRecipes = await Recipe.find();
        return allRecipes;
    } catch (error) {
        console.log("Faile to read the recipes", error);
        throw error;        
    }
}
app.get("/recipes", async(req,res)=>{
    try {
        const savedRecipe = await readAllRecipe();
        if(savedRecipe.length > 0){
        res.json({savedRecipe});   
        }
        else{
            res.status(404).json({error: "Recipes not found"});
        }     
    } catch (error) {
        res.status(500).json({error: "Error while fetching all recipe."})
    }
});

const readRecipeByTitle = async (title)=>{
    try {
        const recipeByTitle = await Recipe.findOne({title});
        return recipeByTitle;
    } catch (error) {
        throw error;
    }
};

app.get("/recipes/:title", async(req,res)=>{
    try {
        const recipe = await readRecipeByTitle(req.params.title);
        if(recipe){
            res.json({recipe});
        }
        else{
            res.status(404).json({error: "Recipe not found."});
        }
    } catch (error) {
        res.status(500).json({error: "failed to fetch by title."});
    }
});

const readRecipeByAuthor = async (author)=>{
    try {
        const recipeByAuthor = await Recipe.find({author});
        return recipeByAuthor;
    } catch (error) {
        throw error;
    }
};

app.get("/recipesByAuthor/:author", async(req,res)=>{
    try {
        const recipe = await readRecipeByAuthor(req.params.author);
        if(recipe.length > 0){
            res.json({recipe});
        }
        else{
            res.status(404).json({error: "Recipe by author not found."});
        }
    } catch (error) {
        res.status(500).json({error: "failed to fetch by author."});
    }
});


const readRecipeByDifficulty = async (difficulty)=>{
    try {
        const recipeByDifficulty = await Recipe.find({difficulty});
        return recipeByDifficulty;
    } catch (error) {
        throw error;
    }
};

app.get("/recipesByDifficulty/:difficulty", async(req,res)=>{
    try {
        const recipe = await readRecipeByDifficulty(req.params.difficulty);
        if(recipe.length > 0){
            res.json({recipe});
        }
        else{
            res.status(404).json({error: "Recipe by author not found."});
        }
    } catch (error) {
        res.status(500).json({error: "failed to fetch by difficulty."});
    }
});

const updateRecipeDifficulty = async (recipeId,difficulty)=>{
    try {
        const updateRecipe = await Recipe.findByIdAndUpdate(recipeId,{difficulty},{new: true});
        return updateRecipe;
    } catch (error) {
        throw error;
    }
};

app.post("/recipesUpdate/:id", async(req,res)=>{
    try {
        const recipe = await updateRecipeDifficulty(req.params.id,req.body.difficulty);
        if(recipe){
            res.json({message: "Recipe updated sucessfully", recipe: recipe});
        }
        else{
            res.status(404).json({error: "Recipe not found."});
        }
    } catch (error) {
        res.status(500).json({error: "Failed to fetch recipe."});
    }
});

const updateRecipeTime = async (recipeTitle,dataToUpdate)=>{
    try {
        const updateRecipe = await Recipe.findOneAndUpdate({title:recipeTitle},dataToUpdate,{new: true});
        return updateRecipe;
    } catch (error) {
        throw error;
    }
};

app.post("/recipesUpdateTime/:title", async(req,res)=>{
    try {
        const recipe = await updateRecipeTime(req.params.title,{prepTime: req.body.prepTime, cookTime: req.body.cookTime});
        if(recipe){
            res.json({message: "Recipe time updated sucessfully", recipe: recipe});
        }
        else{
            res.status(404).json({error: "Recipe not found."});
        }
    } catch (error) {
        res.status(500).json({error: "Failed to fetch recipe."});
    }
});


const deleteRecipeHelper = async(recipeId)=>{
    try {
        const deleteRecipe = await Recipe.findByIdAndDelete(recipeId);
        return deleteRecipe;
    } catch (error) {
        throw error;
    }
};

app.delete("/recipeDelete/:id",async(req,res)=>{
    try {
        const deletedRecipe = await deleteRecipeHelper(req.params.id);
        if(deletedRecipe){
            res.status(200).json({message: "Recipe deleted successfully", recipe: deletedRecipe});
        }
        else{
            res.status(404).json({error: "Recipe not found."})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to fetch."})
    }
})