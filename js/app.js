class App {
  constructor() {
    this.$wrapperRecipes = document.querySelector("#recipes");
    this.$wrapperRecipesCount = document.querySelector('#displayRecipesCount')
    
    this.ingredientList = document.querySelector('#ingredients')
    this.applianceList = document.querySelector('#appliances')
    this.ustensilList = document.querySelector('#ustensils')
  }

  main() {
    // contains ALL recipes with their id for keys
    const recipes = new Map()
    
    recipesData.forEach((recipe) => {
      const recipeInstance = new Recipe(recipe);
      recipes.set(recipeInstance.id, recipeInstance);
    });

    // contains 3 maps for each tag, each map has a pair value possible with an ids array of the recipes concerned
    const recipesIndex = new RecipesIndex(recipes);

    recipes.forEach(recipe => {
      const template = new RecipeCard(recipe);
      this.$wrapperRecipes.appendChild(template.createRecipeCardV2());
    });

    const createListItems = (container, data) => {
      for (const item in data) {
        const $wrapper = document.createElement('li');
        $wrapper.classList.add('list-group-item');
        $wrapper.innerText = data[item].original;
        container.appendChild($wrapper);
      }
    }
    
    createListItems(this.ingredientList, recipesIndex.ingredients);
    createListItems(this.applianceList, recipesIndex.appliances);
    createListItems(this.ustensilList, recipesIndex.ustensils);

  
    this.$wrapperRecipesCount.innerHTML = `${recipes.length} ${recipes.length > 1 ? 'recettes' : 'recette'}`

    console.log(recipesIndex);

    console.log(recipesIndex.ingredients['citron']);
    console.log(recipesIndex.ustensils['couteau']);
    console.log(recipesIndex.appliances['four']);

    console.log(""); 
  }
}

const app = new App();

app.main();

