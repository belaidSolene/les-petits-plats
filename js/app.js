// The App class is responsable for managing all the JavaScript logic for the index.html page.

// It handles the dynamic creation and display of recipe cards, 
// and provides initialization for the filter functionality and the search system.
class App {
  constructor() {
    this.searchInput = document.querySelector('input[name="q"]');
    this.$wrapperRecipes = document.querySelector("#recipes");
    this.$wrapperRecipesCount = document.querySelector('#displayRecipesCount')
    
    // List of filters IDs
    this._filtersListsIds = ['ingredients', 'appliances', 'ustensils']
  }

  main() {
    // Loop through the recipesData array and convert each recipe into a Recipe instance,
    // then add it to the recipes Map using its ID as the key.
    const recipes = new Map()

    recipesData.forEach((recipe) => {
      const recipeInstance = new Recipe(recipe);
      recipes.set(recipeInstance.id, recipeInstance);
    });

    // Create a RecipesIndex instance to generate indexes for each filter category (ingredients, appliances, and utensils).
    const recipesIndex = new RecipesIndex(recipes);
    recipesIndex.init(recipes)

    // Create a SearchRecipes instance to manage the search functionality.
    const searchRecipes = new SearchRecipes(recipesIndex, recipes)

    // Create a Filters instance to handle the filtering of recipes based on selected filters.
    const filters = new Filters(this._filtersListsIds, 'tags', searchRecipes)

    // Create a DisplayRecipes instance to render and display the filtered recipes.
    const displayRecipe = new DisplayRecipes(this.$wrapperRecipes, filters, this.$wrapperRecipesCount)
    
    // Render and display all the recipes initially.
    displayRecipe.render(recipes)

    // Initialize the main search input field to handle search events.
    searchRecipes.setupSearchInput(this.searchInput, displayRecipe)
  }
}

const app = new App();
app.main();

