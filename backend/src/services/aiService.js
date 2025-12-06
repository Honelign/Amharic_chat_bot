const { VertexAI } = require('@google-cloud/vertexai');

let generativeModel = null;

function getModel() {
    if (!generativeModel) {
        console.log('Initializing Vertex AI Model...');
        const project = process.env.GOOGLE_CLOUD_PROJECT;
        const location = 'us-central1';

        if (!project) {
            throw new Error('GOOGLE_CLOUD_PROJECT environment variable is missing');
        }

        const vertexAI = new VertexAI({ project, location });
        generativeModel = vertexAI.getGenerativeModel({
            model: 'gemini-1.5-flash-001',
            generation_config: {
                max_output_tokens: 8192,
                temperature: 0.2,
                top_p: 0.8,
            },
        });
    }
    return generativeModel;
}

async function summarizeAndTranslate(text) {
    const prompt = `You are a helpful assistant for Ethiopian users. You will be provided with a document text. Your task is to:
    1. Analyze the core meaning of the document.
    2. Create a concise summary.
    3. Translate that summary into natural-sounding Amharic.
    4. Return ONLY the Amharic text.
    
    Document Text:
    ${text}`;

    const request = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
    };

    try {
        const model = getModel();
        const streamingResult = await model.generateContentStream(request);
        const aggregatedResponse = await streamingResult.response;
        const candidate = aggregatedResponse.candidates[0];
        if (candidate && candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
            return candidate.content.parts[0].text;
        } else {
            throw new Error('No content in response');
        }
    } catch (error) {
        console.error('Error in summarizeAndTranslate:', error);
        throw error;
    }
}

module.exports = { summarizeAndTranslate };
