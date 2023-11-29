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
    super()
    this._allRecipes = recipes;
    this._recipesIndex = recipesIndex;
    this._activeFiltersIndex = new Map();
    this._resultMainSearch = [...this._allRecipes.keys()];
  }

  /**
   * Set up the search input field for main recipe search and filter updates.
   * @param {HTMLInputElement} searchInput - The input field for main recipe search.
   * @param {DisplayRecipes} displayRecipe - An instance of the DisplayRecipes class to update the displayed recipes.
   */
  setupSearchInput(searchInput, displayRecipe) {
    this._displayRecipe = displayRecipe;

    searchInput.addEventListener('input', () => {
      const searchValue = searchInput.value.trim();

      if (searchValue.length >= 3) {
        this._resultMainSearch = this._mainSearch(searchValue)
        this._updateDisplayRecipes()
      } else if (searchValue == "") {
        this._resultMainSearch = [...this._allRecipes.keys()];
        this._updateDisplayRecipes()
      }
    });

    const searchBtn = searchInput.nextElementSibling.querySelector('button')

    searchBtn.addEventListener('click', () => {
      const searchValue = searchInput.value.trim();

      if (searchValue != "") {
        this._resultMainSearch = this._mainSearch(searchValue)
        this._updateDisplayRecipes()
      }
    })
  }

  /**
   * Perform a main search across all recipes to find recipes matching the search term in names, ingredients, or descriptions.
   * @param {string} searchTerm - The search term provided by the user.
   * @returns {number[]} - An array of recipe IDs that match the search term.
   * @private
   */
  _mainSearch(searchTerm) {
    const filteredRecipes = [...this._allRecipes.values()].filter((recipe) => {
      const normalizedSearch = this.normalizeString(searchTerm);
      if (
        recipe.normalizeName.includes(normalizedSearch) ||
        recipe.normalizeDescription.includes(normalizedSearch)
      ) {
        return true;
      }

      return recipe.ingredients.some((ingredient) =>
        ingredient.normalizeName.includes(normalizedSearch)
      );
    }
    );

    return filteredRecipes.map((recipe) => recipe.id);
  }

  /**
   * Adds a new filter to the active filters and updates the displayed recipes accordingly.
   * Typically called when a user selects a filter option from the filter dropdown.
   * @param {string} filterType - The type of filter (e.g., "ingredients", "appliances", "ustensils").
   * @param {string} filter - The specific filter value selected by the user.
   */
  searchByFilter(filterType, filter) {
    this._addFilter(filterType, filter);
    this._updateDisplayRecipes();
  }

  /**
   * Adds a new filter to the active filters index, associating it with its filter type.
   * @param {string} filterType - The type of filter (e.g., "ingredients", "appliances", "ustensils").
   * @param {string} filter - The specific filter value to be added.
   */
  _addFilter(filterType, filter) {
    this._activeFiltersIndex.set(filter, filterType)
  }

  /**
   * Remove a filter from the active filters index and update the displayed recipes accordingly.
   * @param {string} filter - The filter value has to be removed.
   */
  removeFilter(filter) {
    this._activeFiltersIndex.delete(filter)
    this._updateDisplayRecipes()
  }

  /**
   * Update the displayed recipes based on the main search and active filters.
   * @private
   */
  _updateDisplayRecipes() {
    const recipesFromIds = (recipesIds) => {
      return recipesIds.map((id) => this._allRecipes.get(id));
    }

    const recipesIds = this._getRecipesFiltered()
    this._displayRecipe.render(recipesFromIds(recipesIds), this._activeFiltersIndex)
  }

  /**
   * Get the IDs of recipes that match both the main search and active filters.
   * @returns {number[]} - An array of recipe IDs that match both the main search and active filters.
   * @private
   */
  _getRecipesFiltered() {
    const idsByFilters = this._idsByFilters()

    return idsByFilters.length > 0
      ? this._resultMainSearch.filter((value) => idsByFilters.includes(value))
      : this._resultMainSearch
  }

  /**
   * Find and return the IDs that match all the active filters.
   * @returns {number[]} - An array of recipe IDs that match all the active filters.
   * @private
   */
  _idsByFilters() {
    let commonIds = []
    this._activeFiltersIndex.forEach((filterType, filter) => {
      const ids = this._recipesIndex[filterType][this.normalizeString(filter)];

      if (commonIds.length === 0) {
        commonIds = ids
      } else {
        commonIds = commonIds.filter(id => ids.includes(id))
      }
    })
    return commonIds
  }
}