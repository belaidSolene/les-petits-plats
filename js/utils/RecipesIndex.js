/**
 * The RecipesIndex class is responsible for indexing and organizing recipes based on their ingredients, appliances, and utensils.
 * It allows quick access to recipes associated with specific ingredients, appliances, or utensils.
 * Each index contains all the available values as keys, and the corresponding value is an array of recipe IDs that are associated with that value.
 */
class RecipesIndex {
    constructor(recipes) {
        // Index for ingredients, appliances, and utensils
        this._ingredients = {}
        this._appliances = {}
        this._ustensils = {}
    }

    /**
     * Initialize the recipe index by processing the recipes data and creating the necessary indexes.
     * @param {Array} recipes - An array of Recipe objects to be indexed.
     */
    init(recipes) {
        const addRef = (id, array, ref) => {

            if (!array[ref]) {
                array[ref] = []
            }
            array[ref].push(id)
        }

        recipes.forEach(recipe => {
            const idRecipe = recipe.id;

            // Index recipes based on ingredients
            recipe.ingredients.forEach(ingredient => {
                addRef(idRecipe, this._ingredients, ingredient.normalizeName)
            });

            // Index recipes based on appliances
            addRef(idRecipe, this._appliances, recipe.normalizeAppliance)

            // Index recipes based on ustensils
            recipe.normalizeUstensils.forEach(ustensil => {
                addRef(idRecipe, this._ustensils, ustensil)
            });
        });
    }

    get ingredients() {
        return this._ingredients;
    }

    get appliances() {
        return this._appliances
    }

    get ustensils() {
        return this._ustensils;
    }
}

