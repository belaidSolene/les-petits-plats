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
    this._activeFiltersIndex = new Map
  }

  /**
   * Render recipes on the index.html page and update the filter options.
   * @param {Map} recipes - A collection of Recipe objects to be displayed.
   */
    renderAll(recipes) {
    this.reset()

    recipes.forEach((recipe) => {
      this.render(recipe)
    })

    this.finishRender();
  }

  /**
   * Render a single recipe on the index.html page.
   * @param {Recipe} recipe - The recipe object to be displayed.
   * 
   * 
   * */
  render(recipe) {
    this._recipesCount++;
    const template = new RecipeCard(recipe);
    this._$wrapperRecipes.appendChild(template.createRecipeCard());
    this._updateFilters(recipe);
  }

  /**
   * Update the filter data based on the provided recipe and active filters.
   * 
   **/
  finishRender() {
    // Add a ghost element to fix layout issues
    const ghost = document.createElement('article')
    this._$wrapperRecipes.appendChild(ghost)

    this._updateRecipesCount();

    this._filters.update(this._filtersData);
  }

  /**
   * Display an error message when no recipes match the search criteria.
   * 
   */
  errorMsg(searchTerm="") {
    const error= `
      <p class="col-12 fs-18 fw-bold text-center"> Aucun recette ne correspond à ${searchTerm}... vous pouvez chercher « tarte aux pommes », « poisson », etc. </p>
    `
    this._$wrapperRecipes.innerHTML = error;
  }

  /**
   * Reset the content of the recipes wrapper element.
   * 
   */
  reset() {
    this._$wrapperRecipes.innerHTML = "";
    this._recipesCount = 0;
    this._filtersData = this._initializeFilters();
  }

  /**
   * Update the displayed count of recipes.
   * @param {number} recipesCount - The total count of recipes.
   * @private
   */
  _updateRecipesCount() {
    this._$wrapperRecipesCount.innerHTML = `${this._recipesCount < 10 ? `0${this._recipesCount}` : `${this._recipesCount}`} ${this._recipesCount > 0 ? "recettes" : "recette"}`;
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
   * Adds a new filter to the active filters index, associating it with its filter type.
   * @param {string} filterType - The type of filter (e.g., "ingredients", "appliances", "ustensils").
   * @param {string} filter - The specific filter value to be added.
   */
  addFilter(filterType, filter) {
    this._activeFiltersIndex.set(filter, filterType);
  }

  /**
   * Get the active filters index.
   * @returns {Map} - The active filters index.
   * 
   **/
  get activeFilters() {
    return this._activeFiltersIndex;
  }

  /**
   * Update the filter data based on the provided recipe and active filters.
   * @param {Recipe} recipe - The recipe object to be used for filter data update.
   * @param {Map} activeFilters - A map containing the active filters selected by the user.
   * @private
   */
  _updateFilters(recipe) {
    recipe.ingredients.forEach(ingredient => {
      if (!this._activeFiltersIndex.has(ingredient.capitalizeName) && !this._filtersData.ingredients.includes(ingredient.capitalizeName)) {
       this._filtersData.ingredients.push(ingredient.capitalizeName);
      }
    })

    if (!this._activeFiltersIndex.has(recipe.capitalizeAppliance) && !this._filtersData.appliances.includes(recipe.capitalizeAppliance)) {
     this. _filtersData.appliances.push(recipe.capitalizeAppliance);
    }

    recipe.capitalizeUstensils.forEach(ustensil => {
      if (!this._activeFiltersIndex.has(ustensil) && !this._filtersData.ustensils.includes(ustensil)) {
        this._filtersData.ustensils.push(ustensil);
      }
    });
  }
}
