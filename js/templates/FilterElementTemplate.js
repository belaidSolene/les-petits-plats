/** 
 * The FilterElementBuilder class represents a template for creating filter items and tag cards dynamically on the index.html page.
 * It provides methods to generate HTML filter items and tag cards based on the filter type and data provided.
 */
 class FilterElementTemplate {
    constructor(filterType, data) {
        this._filterType = filterType;
        this._data = data;
    }
    
    /**
     * Create a filter item for the specified filter type to be used within the filter dropdown.
     * @returns {HTMLElement} - The list item element representing the filter item.
     */
    createFilter() {
        const $wrapper = document.createElement('li');
        $wrapper.classList.add('list-group-item');
        $wrapper.classList.add('px-0');
        $wrapper.classList.add('py-2');
        $wrapper.classList.add('px-md-1');
        $wrapper.innerText = this._data;

        return $wrapper;
    }

    /**
     * Create a tag card for the specified filter data.
     * @returns {HTMLElement} - The column div element representing the tag card.
     */
    createTagCard() {
        const $wrapper = document.createElement('div');
        $wrapper.classList.add('col');


        $wrapper.innerHTML = `
            <div class="card">
                <div class="card-body fs-filter tag-height btn btn-primary p-1 d-flex align-items-center justify-content-between" >
                    ${this._data}            
                    <button type="button" class="btn-close" aria-label="Close"></button>
                </div>
            </div>
        `;
        return $wrapper;
    }

    get filterType() {
        return this._filterType;
    }

    get name() {
        return this._data;
    }
}
