const { GoogleGenerativeAI } = require('@google/generative-ai');

let generativeModel = null;

function getModel() {
    if (!generativeModel) {
        console.log('Initializing Gemini AI Model...');
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error('GEMINI_API_KEY environment variable is missing. Get one from https://aistudio.google.com/app/apikey');
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        generativeModel = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash-preview-09-2025',
            generationConfig: {
                maxOutputTokens: 8192,
                temperature: 0.2,
                topP: 0.8,
            },
        });
    }
    return generativeModel;
}

async function summarizeDocument(fileBuffer, mimeType) {
    const prompt = `You are a helpful assistant for Ethiopian users. You will be provided with a document. Your task is to:
    1. Read and analyze the core meaning of the document.
    2. Create a concise summary.
    3. Translate that summary into natural-sounding Amharic.
    4. Return ONLY the Amharic text.`;

    try {
        const model = getModel();

        // Convert buffer to base64
        const base64Data = fileBuffer.toString('base64');

        const result = await model.generateContent([
            {
                inlineData: {
                    data: base64Data,
                    mimeType: mimeType
                }
            },
            { text: prompt }
        ]);

        const response = await result.response;
        const generatedText = response.text();

        if (!generatedText) {
            throw new Error('No content in response');
        }

        return generatedText;
    } catch (error) {
        console.error('Error in summarizeDocument:', error);
        throw error;
    }
}

async function summarizeAndTranslate(text) {
    const prompt = `You are a helpful assistant for Ethiopian users. You will be provided with a document text. Your task is to:
    1. Analyze the core meaning of the document.
    2. Create a concise summary.
    3. Translate that summary into natural-sounding Amharic.
    4. Return ONLY the Amharic text.
    
    Document Text:
    ${text}`;

    try {
        const model = getModel();
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const generatedText = response.text();

        if (!generatedText) {
            throw new Error('No content in response');
        }

        return generatedText;
    } catch (error) {
        console.error('Error in summarizeAndTranslate:', error);
        throw error;
    }
}

module.exports = { summarizeDocument, summarizeAndTranslate };
