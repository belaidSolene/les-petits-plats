/**
 * The Filters class is responsible for managing the filtering functionality in the index.html page.
 * 
 * It dynamically creates and displays filter items and tag cards in the filter dropdowns,
 * and it interacts with the SearchRecipes instance to apply the selected filters in recipe searches.
 */

class Filters extends StringUtils {
    /**
     * Construct a Filters instance.
     * @param {string[]} filtersListId - An array of filter category IDs (e.g., 'ingredients', 'appliances', 'ustensils').
     * @param {string} wrapperTagsId - The ID of the wrapper element where the tag cards will be appended.
     * @param {SearchRecipes} searchRecipes - The instance of SearchRecipes used for managing recipe searches.
     */
    constructor(filtersListId, wrapperTagsId, searchRecipes) {
        super();
        this._filtersListId = filtersListId;
        this._$wrapperFiltersList = this._getWrappers();
        this._$wrapperTags = document.querySelector(`#${wrapperTagsId}`);
        this._searchRecipes = searchRecipes;
    }

    /**
     * Retrieve the wrapper elements for the filters based on the specified filtersListId.
     * @returns {HTMLElement[]} - An array of wrapper elements for each filter category.
     * @private
     */
    _getWrappers() {
        return this._filtersListId.map(id => document.querySelector(`#${id}`));
    }

    /**
     * Update the filter dropdowns with new filter data.
     * @param {Object} filtersData - An object containing filter data for each filter category.
     * @example { ingredients: ['Salt', 'Sugar'], appliances: ['Oven', 'Blender'] }
     */
    update(filtersData) {
        this._$wrapperFiltersList.forEach($wrapperFilter => {
            const filterType = $wrapperFilter.id;

            this._clearFilterAndReset(filtersData[filterType], $wrapperFilter, filterType)
            this._clearInput($wrapperFilter)

            this._setupInputFilter($wrapperFilter, filtersData[filterType], filterType);
        });
    }

    /**
     * Set up the input filter to respond to user input and update the filter dropdown accordingly.
     * @param {HTMLElement} $wrapperFilter - The wrapper element containing the filter dropdown.
     * @param {string[]} filterData - An array of filter options for the specified filter category.
     * @param {FilterElementBuilder} FilterElementBuilder - An instance of the FilterElementBuilder class.
     * @private
     */
    _setupInputFilter($wrapperFilter, filterData, filterElementTemplate) {
        const input = this._getInput($wrapperFilter);

        input.addEventListener('input', () => {
            const searchValue = input.value.trim();
            if (searchValue === "") {
                // Display all filters available when the input is empty.
                this._clearFilterAndReset(filterData, $wrapperFilter, filterElementTemplate);
            } else {
                this._filterAndDisplayMatchingValues(searchValue, filterData, $wrapperFilter, filterElementTemplate);
            }
        });
    }

    /**
     * Handle the click event when a filter item is selected from the filter dropdown.
     * Create and display a tag card for the selected filter, and update the search based on the selected filter.
     * @param {FilterElementBuilder} FilterElementBuilder - An instance of the FilterElementBuilder class.
     * @param {HTMLElement} template - The HTML template for the filter item.
     * @private
     */
    _handleFilterClick(filterElementTemplate, template) {
        const tagTxt = template.textContent;
        const $wrapper = filterElementTemplate.createTagCard(tagTxt);

        // Update the search results based on the selected filter.
        this._searchRecipes.searchByFilter(filterElementTemplate.filterType, tagTxt);

        // Add an event listener to the close button of the tag card to remove the filter and update the search.
        const btnClose = $wrapper.querySelector('button');
        btnClose.addEventListener('click', () => {
            $wrapper.remove();
            this._searchRecipes.removeFilter(tagTxt);
        });

        // Append the tag card to the wrapperTags element for display.
        this._$wrapperTags.appendChild($wrapper);
    }

    /**
     * Clear the filter dropdown, filter the data based on user input, and reset the dropdown accordingly.
     * @param {string[]} filterData - An array of filter options for the specified filter category.
     * @param {HTMLElement} $wrapperFilter - The wrapper element containing the filter dropdown.
     * @param {string} filterType - The type of the filter ('ingredients', 'appliances', or 'ustensils').
     * @private
     */
    _clearFilterAndReset(filterData, $wrapperFilter, filterType) {
        $wrapperFilter.innerHTML = "";

        filterData.forEach(filter => {
            const filterElementTemplate = new FilterElementTemplate(filterType, filter);

            const template = filterElementTemplate.createFilter();
            template.addEventListener('click', () => this._handleFilterClick(filterElementTemplate, template));

            $wrapperFilter.appendChild(template);
        });
    }

    /**
     * Filter and display the filter values that match the user input.
     * @param {string} searchValue - The user input value for filtering.
     * @param {string[]} filterData - An array of filter options for the specified filter category.
     * @param {HTMLElement} $wrapperFilter - The wrapper element containing the filter dropdown.
     * @param {string} filterType - The type of the filter ('ingredients', 'appliances', or 'ustensils').
     * @private
     */
    _filterAndDisplayMatchingValues(searchValue, filterData, $wrapperFilter, filterType) {
        const matchingValues = filterData.filter(filter => {
            const normalizeSearch = this.normalizeString(searchValue);
            return this.normalizeString(filter).includes(normalizeSearch);
        });

        $wrapperFilter.innerHTML = "";
        if (matchingValues.length > 0) {
           this._clearFilterAndReset(matchingValues, $wrapperFilter, filterType)
        } else {
            // If no matching values found, display a message in the filter dropdown.
            $wrapperFilter.innerHTML = "Aucune valeur trouvée";
        }
    }

    /**
     * Clear the input field in the filter dropdown.
     * @param {HTMLElement} $wrapperFilter - The wrapper element containing the filter dropdown.
     * @private
     */
    _clearInput($wrapperFilter) {
        const input = this._getInput($wrapperFilter)
        input.value = ""
    }

    /**
     * Get the input field in the filter dropdown.
     * @param {HTMLElement} $wrapperFilter - The wrapper element containing the filter dropdown.
     * @returns {HTMLElement} - The input element in the filter dropdown.
     * @private
     */
    _getInput($wrapperFilter) {
        return $wrapperFilter.parentElement.parentElement.querySelector('input')
    }
}
