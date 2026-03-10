/**
 * Imports a JSON file and parses it
 * @param {File} file - The file object to read
 * @returns {Promise<any>} - Promise resolving to parsed page data
 */
export function importJSON(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error('No file provided'));
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const result = e.target.result;
                const data = JSON.parse(result);
                resolve(data);
            } catch (error) {
                reject(new Error('Invalid JSON file.'));
            }
        };

        reader.onerror = () => {
            reject(new Error('Error reading the file.'));
        };

        reader.readAsText(file);
    });
}
