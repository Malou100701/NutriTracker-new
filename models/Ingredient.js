const sql = require('mssql');
const config = require('../config');

async function searchByName (name) {
    try {
        await sql.connect(config);
        const request = new sql.Request();
        const query = `
            SELECT Name FROM Ingredient WHERE Name LIKE '%${name}%';`;
        const result = await request.query(query);
        //console.log(result);
        return result.recordset;
    } catch (error) {
        console.error('Error fetching ingredients:', error);
        throw error;
    }
};

module.exports.searchByName = searchByName;

/*async function getNutrition(mealID, ingredient){
    try {
        await sql.connect(config);
        const request = new sql.Request();
        const query = `
            SELECT 
                SUM(Ingredient.Calories * MealIngredient.Amount / 100) AS IngredientCalories,
                SUM(Ingredient.Protein * MealIngredient.Amount / 100) AS IngredientProtein,
                SUM(Ingredient.Fat * MealIngredient.Amount / 100) AS IngredientFat,
                SUM(Ingredient.Fiber * MealIngredient.Amount / 100) AS IngredientFiber
            FROM
                Ingredient
            JOIN
                MealIngredient ON Ingredient.IngredientID = MealIngredient.IngredientID
            WHERE
            MealIngredient.MealID = ${mealID}
            AND Ingredient.IngredientID = ${ingredient};`;

    
    let result = await request.query(query);

    console.log(result.recordset[0]);
        //console.log(result);
        return result.recordset[0];
    } catch (error) {
        console.error('Error fetching nutrition:', error);
        throw error;
    }

};
module.exports.getNutrition = getNutrition;*/