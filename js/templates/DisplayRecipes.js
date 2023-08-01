/**
 * The DisplayRecipes class is responsible for rendering recipes on the index.html page,
 * along with updating and displaying filter options based on the available recipes and active filters.
 */
class DisplayRecipes {
  /**
   * @param {HTMLElement} $wrapperRecipes - The wrapper element where the recipe cards will be displayed.
   * @param {Filters} filters - An instance of the Filters class that handles filter functionality.
   * @param {HTMLElement} $wrapperRecipesCount - The wrapper element to display the count of recipes.
   */
  constructor($wrapperRecipes, filters, $wrapperRecipesCount) {
    this._$wrapperRecipes = $wrapperRecipes;
    this._$wrapperRecipesCount = $wrapperRecipesCount;
    this._filters = filters;
  }

  /**
   * Render recipes on the index.html page and update the filter options.
   * @param {Map|Array} recipes - A collection of Recipe objects to be displayed.
   * @param {Map} activeFilters - A map containing the active filters selected by the user.
   */
    render(recipes, activeFilters = new Map) {
    this._reset()
    const filtersData = this._initializeFilters();
    let recipesCount = 0

    if (recipes instanceof Map) {
      recipesCount = recipes.size
    } else if (recipes instanceof Array) {
      recipesCount = recipes.length
    } else {
      throw new Error(`recipes must be a map or an array`)
    }

    // Check if there are any recipes to display
    if (recipesCount > 0) {
      recipes.forEach(recipe => {
        const template = new RecipeCard(recipe);
        this._$wrapperRecipes.appendChild(template.createRecipeCard());
        this._updateFilters(recipe, filtersData, activeFilters);
      });
    } else {
      this._errorMsg()
    }

    // Add a ghost element to fix layout issues
    const ghost = document.createElement('article')
    this._$wrapperRecipes.appendChild(ghost)

    this._updateRecipesCount(recipesCount);

    this._filters.update(filtersData);
  }

  /**
   * Display an error message when no recipes match the search criteria.
   * @private
   */
  _errorMsg() {
    const errorMsg = `
      <p class="col-12 fs-18 fw-bold text-center"> Aucun recette ne correspond à votre recherche... vous pouvez chercher « tarte aux pommes », « poisson », etc. </p>
    `
    this._$wrapperRecipes.innerHTML = errorMsg;
  }

  /**
   * Reset the content of the wrapper element.
   * @private
   */
  _reset() {
    this._$wrapperRecipes.innerHTML = "";
  }

  /**
   * Update the displayed count of recipes.
   * @param {number} recipesCount - The total count of recipes.
   * @private
   */
  _updateRecipesCount(recipesCount) {
    this._$wrapperRecipesCount.innerHTML = `${recipesCount < 10 ? `0${recipesCount}` : `${recipesCount}`} ${recipesCount > 0 ? "recettes" : "recette"}`;
  }

  /**
   * Initialize the filters data to an empty state.
   * @returns {Object} - An object containing arrays for ingredients, appliances, and utensils.
   * @private
   */
  _initializeFilters() {
    return {
      ingredients: [],
      appliances: [],
      ustensils: []
    };
  }

  /**
   * Update the filter data based on the provided recipe and active filters.
   * @param {Recipe} recipe - The recipe object to be used for filter data update.
   * @param {Object} filtersData - The current filter data containing arrays for ingredients, appliances, and utensils.
   * @param {Map} activeFilters - A map containing the active filters selected by the user.
   * @private
   */
  _updateFilters(recipe, filtersData, activeFilters) {
    recipe.ingredients.forEach(ingredient => {
      if (!activeFilters.has(ingredient.capitalizeName) && !filtersData.ingredients.includes(ingredient.capitalizeName)) {
        filtersData.ingredients.push(ingredient.capitalizeName);
      }
    })

    if (!activeFilters.has(recipe.capitalizeAppliance) && !filtersData.appliances.includes(recipe.capitalizeAppliance)) {
      filtersData.appliances.push(recipe.capitalizeAppliance);
    }

    recipe.capitalizeUstensils.forEach(ustensil => {
      if (!activeFilters.has(ustensil) && !filtersData.ustensils.includes(ustensil)) {
        filtersData.ustensils.push(ustensil);
      }
    });
  }
}
