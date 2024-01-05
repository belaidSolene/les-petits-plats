// The Ingredient class reprensents a ingredient with its associated data.
class Ingredient extends StringUtils {
    constructor(data) {
        super();
        this._ingredient = data.ingredient;
        this._quantity = data.quantity;
        this._unit = data.unit;
    }

    // The normalize*** methods helps in case-insensitive searches and comparisons.
    // The capitalize*** methods improves their display in the UI.

    get name() {
        return this._ingredient;
    }

    get normalizeName() {
        return this.normalizeString(this.name);
    }

    get capitalizeName() {
        return this.capitalizeString(this.name);
    }

    /*
        The unit getter method returns the formatted unit for displaying the quantity of the ingredient.
        
        If the unit is empty or undefined, it returns an empty string.
        If the unit is 'grammes', it returns 'g' to represent grams.
        If the unit's length is greater than 2 characters, it returns the unit with a space prefix.
        Otherwise, it returns the original unit as it is. 
    */
    get unit() {
        return !this._unit ? '' : (
            this._unit === 'grammes' ? 'g' : (
                this._unit.length > 2 ? ` ${this._unit}` : this._unit
            )
        );
    }

    // Returns the formatted quantity and unit of the ingredient if available; otherwise, an empty string.
    get quantity() {
        return this.hasQuantity ? `${this._quantity}${this.unit}` : '';
    }

    get hasQuantity() {
        return this._quantity ? true : false;
    }
}