// The StringUtils class provides utility functions for string manipulation.

class StringUtils {
    // The normalizeString method normalizes the given string by converting it to lowercase and removing diacritical marks (e.g., accents).
    normalizeString(str) {
        if (str.length > 0) {
            return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        }
        // If the input string is empty or has zero length, return undefined.
        return undefined;
    }

    // The capitalizeString method capitalizes the first letter of the given string and converts the rest of the characters to lowercase.
    capitalizeString(str) {
        if (str.length > 0) {
            return str[0].toUpperCase() + str.slice(1).toLowerCase();
        }
        // If the input string is empty or has zero length, return undefined.
        return undefined;
    }

    // The checkForHTMLTags method checks if the given string contains HTML tags.
    checkForHTMLTags(input) {
        const regex = /<\/?[a-z][\s\S]*>/i;
        if (regex.test(input)) {
          throw new Error("L'insertion de balises HTML est interdite.");
        }
      }
}
