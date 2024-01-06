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

    for (const [recipeId, recipe] of this._allRecipes) {
      if (this._doesRecipeMatchSearchTerm(recipe, normalizedSearch)) {
        recipesFound.push(recipeId);
        if (this._isRecipeMatchingMainSearchAndFilter(recipeId)) {
          if (notFound) { notFound = false; }
          this._displayRecipes.render(recipe);
        }
      }
    }

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
  _doesRecipeMatchSearchTerm({ normalizeDescription, ingredients, normalizeName }, searchTerm) {
    const checkMatch = (str, searchTerm) => {
    for (let i = 0; i <= str.length - searchTerm.length; i++) {
      let match = true;
      for (let j = 0; j < searchTerm.length; j++) {
        if (str[i + j] !== searchTerm[j]) {
          match = false;
          break;
        }
      }
      if (match) {
        return true;
      }
    }
    return false;
  }

  if (checkMatch(normalizeName, searchTerm)) {
    return true;
  }

  if (checkMatch(normalizeDescription, searchTerm)) {
    return true;
  }

  for (const ingredient of ingredients) {
    if (checkMatch(ingredient, searchTerm)) {
      return true;
    }
  }

  return false;
  }

  /**
   * Checks whether the given recipe is valid based on the current filters.
   * @param {Recipe} recipe - The recipe object to check against the filters
   * @returns {boolean} - Returns true if the recipe is valid with the filters, otherwise returns false.
   * @private
   */
  _isRecipeMatchingMainSearchAndFilter(idRecipe) {
    if (this._resultFilterSearch.length > 0) {
      for (let i = 0; i < this._resultFilterSearch.length; i++) {
        if (this._resultFilterSearch[i] === idRecipe) {
          return true;
        }
      }
    } else {
      return true;
    }
    
    return false;
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
      let ids = [];
      for (let i = 0; i < this._resultMainSearch.length; i++) {
        const value = this._resultMainSearch[i];
        if (this._resultFilterSearch.includes(value)) {
          ids.push(value);
        }
      }

      ids = ids.length === 0 ? this._resultMainSearch : ids

      for (let i = 0; i < ids.length; i++) {
        const idRecipe = ids[i];
        this._displayRecipes.render(this._allRecipes.get(idRecipe));
      }
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
  
    for (const [filter, filterType] of this._displayRecipes.activeFilters) {
      const ids = this._recipesIndex[filterType][this.normalizeString(filter)];
      if (commonIds.length === 0) {
        commonIds = ids;
      } else {
        const newCommonIds = [];
        for (const id of commonIds) {
          if (ids.includes(id)) {
            newCommonIds.push(id);
          }
        }
        commonIds = newCommonIds;
      }
    }
  
    return commonIds;
  }
}