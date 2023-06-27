class FilterTemplate {
    constructor(filterType, data) {
        this._filterType = filterType
        this._data = data
    }

    createFilter() {
        const $wrapper = document.createElement('li');
        $wrapper.classList.add('list-group-item');
        $wrapper.classList.add('py-2');
        $wrapper.classList.add('px-1');
        $wrapper.innerText = this._data;

        return $wrapper
    }

    createFilterV1() {
        const $wrapper = document.createElement('p')
        $wrapper.innerText = this._data
        
        return $wrapper;
    }

    createTagCard() {
        const $wrapper = document.createElement('div')
        $wrapper.classList.add('col')

        $wrapper.innerHTML = `
            <div class="card">
                <div class="card-body btn btn-primary d-flex align-items-center justify-content-between" style="height: 3.13rem;">
                    ${this._data}            
                    <button type="button" class="btn-close" aria-label="Close"></button>
                </div>
            </div>
        `
        return $wrapper;
    }

    createTagCardV1() {
        const $wrapper = document.createElement('div')
        $wrapper.classList.add('rounded-2')
        $wrapper.classList.add(`bg-${this._filterType}`)
        $wrapper.classList.add('p-2')
        $wrapper.classList.add('text-white')
        $wrapper.classList.add('row')
        $wrapper.style = "height: 2.32rem; width: auto;"

        $wrapper.innerHTML = `
            <p class="col-10 m-0 fs-14">${this._data}</p>
            <i class="col-2 fa-regular fa-circle-xmark"></i>
        `
        return $wrapper;
    }

    get filterType() {
        return this._filterType
    }

    get name() {
        return this._data
    }
}
