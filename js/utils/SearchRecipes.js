/**
 * The SearchRecipes class handles recipe search functionality based on user input and active filters.
 * It performs both main search and filter-based search, updating the displayed recipes accordingly.
 * @extends StringUtils
 */
class SearchRecipes extends StringUtils {
  /**
   * @param {RecipesIndex} recipesIndex - An instance of the RecipesIndex class containing recipe indexes.
   * @param {Map} recipes - A map containing all the available recipes, with IDs as keys.
   */
  constructor(recipesIndex, recipes) {
    super();
    this._allRecipes = recipes;
    this._recipesIndex = recipesIndex;
    this._resultFilterSearch = [];
    this._resultMainSearch = [...this._allRecipes.keys()];
  }

  /**
   * Set up the search input field for main recipe search and filter updates.
   * @param {HTMLInputElement} searchInput - The input field for main recipe search.
   * @param {DisplayRecipes} displayRecipe - An instance of the DisplayRecipes class to update the displayed recipes.
   */
  setupSearchInput(searchInput, displayRecipe) {
    this._displayRecipes = displayRecipe;

    searchInput.addEventListener('input', () => {
      this._searchValue = searchInput.value;
      try {
        this.checkForHTMLTags(this._searchValue);

        const searchValue = this._searchValue.trim();

        if (searchValue.length >= 3) {
        this._resultMainSearch = this._mainSearch(searchValue);
      } else if (searchValue == "") {
        this._resultMainSearch = [...this._allRecipes.keys()];
        this._updateDisplayRecipes();
      }
    } catch (error) {
        console.error(error.message);
        return;
      }
    });

    const searchBtn = searchInput.nextElementSibling.querySelector('button');

    searchBtn.addEventListener('click', () => {
      this._searchValue = searchInput.value;
      try {
        this.checkForHTMLTags(searchValue);
        const searchValue = this._searchValue.trim();
      if (searchValue != "") {
        this._resultMainSearch = this._mainSearch(searchValue);
      }
    } catch (error) {
        console.error(error.message);
        return;
      }
    })
  }

  /**
   * Perform the main search and update the display.
   * @param {string} searchTerm - The search term entered by the user.
   */
  _mainSearch(searchTerm) {
    const normalizedSearch = this.normalizeString(searchTerm);
    let recipesFound = [];
    let notFound = true;

    this._displayRecipes.reset();

    this._allRecipes.forEach((recipe, key) => {
      if (this._doesRecipeMatchSearchTerm(recipe, normalizedSearch)) {
        recipesFound.push(key);
        if (this._isRecipeMatchingMainSearchAndFilter(key)) {
          if (notFound) { notFound = false; }
          this._displayRecipes.render(recipe);
        }
      }
    });

    if (notFound) {
      this._displayRecipes.updateErrorMsg(this._searchValue);
    }

    this._displayRecipes.finishRender();

    return recipesFound;
  }

  /**
   * Check if the given recipe matches the search term.
   * @param {Recipe} recipe - The recipe object to check.
   * @param {string} searchTerm - The search term entered by the user.
   * @returns {boolean} - True if the recipe matches the search term, false otherwise.
   * @private
   */
  _doesRecipeMatchSearchTerm({normalizeDescription, ingredients, normalizeName}, searchTerm) {
    return (
      normalizeName.includes(searchTerm) ||
      normalizeDescription.includes(searchTerm) ||
      ingredients.some((ingredient) =>
        ingredient.normalizeName.includes(searchTerm)
      )
    );
  }

  /**
   * Checks whether the given recipe is valid based on the current filters.
   * @param {Recipe} recipe - The recipe object to check against the filters
   * @returns {boolean} - Returns true if the recipe is valid with the filters, otherwise returns false.
   * @private
   */
  _isRecipeMatchingMainSearchAndFilter(idRecipe) {
    return this._resultFilterSearch.length > 0
      ? this._resultFilterSearch.includes(idRecipe) : true;
  }

  /**
   * Adds a new filter to the active filters and updates the displayed recipes accordingly.
   * Typically called when a user selects a filter option from the filter dropdown.
   * @param {string} filterType - The type of filter (e.g., "ingredients", "appliances", "ustensils").
   * @param {string} filter - The specific filter value selected by the user.
   */
  searchByFilter(filterType, filter) {
    this._displayRecipes.addFilter(filterType, filter);
    this._resultFilterSearch = this._recipeIdsMatchingFilters();
    this._updateDisplayRecipes();
  }


  /**
   * Remove a filter from the active filters index and update the displayed recipes accordingly.
   * @param {string} filter - The filter value has to be removed.
   */
  removeFilter(filter) {
    this._displayRecipes.activeFilters.delete(filter);
    this._resultFilterSearch = this._recipeIdsMatchingFilters();
    this._updateDisplayRecipes();
  }

  /**
   * Update the displayed recipes based on the main search and active filters.
   * @private
   */
  _updateDisplayRecipes() {
    this._displayRecipes.reset();

    if (this._resultMainSearch.length === 0) {
      this._displayRecipes.updateErrorMsg(this._searchValue);
    } else {
      const ids = this._resultFilterSearch.length > 0
      ? this._resultMainSearch.filter((value) => this._resultFilterSearch.includes(value))
      : this._resultMainSearch;

      ids.forEach(idRecipe => {
        this._displayRecipes.render(this._allRecipes.get(idRecipe));
      })
    }
    this._displayRecipes.finishRender();
  }

  /**
   * Find and return the IDs that match all the active filters.
   * @returns {number[]} - An array of recipe IDs that match all the active filters.
   * @private
   */
  _recipeIdsMatchingFilters() {
    let commonIds = [];

    this._displayRecipes.activeFilters.forEach((filterType, filter) => {
      const ids = this._recipesIndex[filterType][this.normalizeString(filter)];
      commonIds = commonIds.length === 0 ? ids : commonIds.filter(id => ids.includes(id));
    });

    return commonIds;
  }
}