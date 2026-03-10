/**
 * Exports the page data as a JSON file and triggers download
 * @param {object|array} pageData - Data to export
 * @param {string} filename - Download file name
 */
export function exportJSON(pageData, filename = 'page-data.json') {
    const jsonString = JSON.stringify(pageData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
