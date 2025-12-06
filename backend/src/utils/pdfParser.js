const pdf = require('pdf-parse');

async function extractText(buffer) {
    try {
        const data = await pdf(buffer);
        return data.text;
    } catch (error) {
        console.error('Error parsing PDF:', error);
        throw new Error('Failed to extract text from PDF');
    }
}

module.exports = { extractText };
