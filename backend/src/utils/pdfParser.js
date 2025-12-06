const pdf = require('pdf-parse');
const mammoth = require('mammoth');

async function extractText(buffer, filename = '') {
    try {
        // Detect file type from filename extension
        const ext = filename.toLowerCase().split('.').pop();

        if (ext === 'pdf') {
            // Extract from PDF
            const data = await pdf(buffer);
            return data.text;
        } else if (ext === 'docx') {
            // Extract from DOCX
            const result = await mammoth.extractRawText({ buffer });
            return result.value;
        } else if (ext === 'txt') {
            // Extract from TXT
            return buffer.toString('utf-8');
        } else {
            // Try PDF as default (for backward compatibility)
            try {
                const data = await pdf(buffer);
                return data.text;
            } catch {
                throw new Error(`Unsupported file type: ${ext}. Please upload PDF, DOCX, or TXT files.`);
            }
        }
    } catch (error) {
        console.error('Error extracting text:', error);
        throw new Error(error.message || 'Failed to extract text from document');
    }
}

module.exports = { extractText };
