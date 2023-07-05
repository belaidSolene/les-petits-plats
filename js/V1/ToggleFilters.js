class ToggleFilters {
    constructor(filtersListId) {
        this._$wrappersFiltersList = this._getWrappers(filtersListId)
        this._active = false
    }

    _getWrappers(filtersListId) {
        return filtersListId.map(id => document.querySelector(`#${id}`));
    }

    addEvent() {
        this._$wrappersFiltersList.forEach($wrapper => {
            const id = $wrapper.id.split("-").shift();
            const btn = $wrapper.querySelector('button')
            const filter = $wrapper.querySelector(`#${id.concat('-wrapper')}`)

            btn.addEventListener('click', () => {
                this._show(btn, filter, $wrapper)
            })

            const close = $wrapper.querySelector('i')
            close.addEventListener('click', () => {
                this._hide(btn, filter, $wrapper)
            })


            document.addEventListener('click', event => {
                const isClickedInsideWrapper = this._$wrappersFiltersList.some($wrapper => $wrapper.contains(event.target));
                if (!isClickedInsideWrapper && this._active) {
                    this._hide();
                }
            });
        })
    }

    _show(btn, filter, $wrapper) {
        if (this._active) {
            this._hide()
        }

        this._active = true;
        this._openFilter = filter
        this._btnOpenFilter = btn
        this._openWrapper = $wrapper
        this._$wrapperFilter = this._openWrapper.querySelector('.row.row-cols-3')
        this._countFilterAvailable = this._$wrapperFilter.childElementCount

        switch (this._countFilterAvailable) {
            case 0:
            case 1:
                this._openWrapper.classList.add('col-3')
                break;

            case 2:
                this._openWrapper.classList.add('col-4')
                this._$wrapperFilter.classList.remove('row-cols-3')
                this._$wrapperFilter.classList.add('row-cols-2')
                break;

            default:
                this._openWrapper.classList.add('col-6')
                break;
        }

        this._openWrapper.classList.add('me-3')

        this._btnOpenFilter.classList.add('d-none')
        this._openFilter.classList.remove('d-none')

        this._openFilter.querySelector('input').focus()
    }

    _hide() {
        this._active = false;

        switch (this._countFilterAvailable) {
            case 0:
            case 1:
                this._openWrapper.classList.remove('col-3')
                break;

            case 2:
                this._openWrapper.classList.remove('col-4')
                this._$wrapperFilter.classList.remove('row-cols-2')
                this._$wrapperFilter.classList.add('row-cols-3')
                break;

            default:
                this._openWrapper.classList.remove('col-6')
                break;
        }

        this._btnOpenFilter.classList.remove('d-none')
        this._openFilter.classList.add('d-none')
    }

    get wrappersFilters() {
        return this._$wrappersFiltersList
    }
}