// The Recipe class reprensents a recipe with its associated data.
class Recipe extends StringUtils{
    constructor(data) {
        super()
        
        this._id = data.id;
        this._image = data.image;
        this._name = data.name;
        this._servings = data.servings;
        this._ingredients = data.ingredients.map(el => new Ingredient(el));
        this._time = data.time;
        this._description = data.description;
        this._appliance = data.appliance;
        this._ustensils = data.ustensils;
    }

    // Various getter methods to retrieve recipe data and apply string transformations.
    // These methods make it easier to access and manipulate the recipe data.

    // The normalize*** methods helps in case-insensitive searches and comparisons.
    // The capitalize*** methods improves their display in the UI.

    get id() {
        return this._id;
    }

    // Get the URL of the recipe's image.
    get image() {
        return `./public/assets/img/recipes/${this._image}`;
    }

    get name() {
        return this._name;
    }

    get normalizeName() {
        return this.normalizeString(this.name)
    }

    get servings() {
        return this._servings;
    }

    get ingredients() {
        return this._ingredients;
    }

    get time () {
        return this._time;
    }

    get description() {
        return this._description;
    }

    get normalizeDescription() {
        return this.normalizeString(this.description)
    }

    get appliance() {
        return this._appliance;
    }

    get normalizeAppliance() {
        return this.normalizeString(this.appliance)
    }

    get capitalizeAppliance() {
        return this.capitalizeString(this.appliance)
    }

    get ustensils() {
        return this._ustensils;
    }

    get normalizeUstensils() {
        const normalizeUstensils = []
        
        this.ustensils.forEach(ustensil => {
            normalizeUstensils.push(this.normalizeString(ustensil))
        });

        return normalizeUstensils;
    }

    get capitalizeUstensils() {
        const capitalizeUstensils = []
        
        this._ustensils.forEach(ustensil => {
            capitalizeUstensils.push(this.capitalizeString(ustensil))
        });

        return capitalizeUstensils;
    }
}