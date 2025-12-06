const { summarizeDocument, summarizeAndTranslate } = require('../services/aiService');
const { generateAudio } = require('../services/ttsService');
const { uploadFile } = require('../services/storageService');

exports.analyzeDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const userId = req.body.userId || 'anonymous';
        const originalFileName = req.file.originalname || 'unknown_file';
        const language = req.body.language || 'amharic';

        console.log(`[${new Date().toISOString()}] processing uploaded file: ${originalFileName} in ${language}`);

        // 1. Upload original file to Cloud Storage (Proxy Upload)
        console.log('Uploading original file to Cloud Storage...');
        const fileUploadName = `uploads/${userId}/${Date.now()}_${originalFileName}`;
        const fileUrl = await uploadFile(req.file.buffer, fileUploadName);

        // 2. Process document directly with Gemini (no text extraction needed!)
        console.log('Processing document with Gemini...');
        const summary = await summarizeDocument(req.file.buffer, req.file.mimetype, language);

        // 4. Generate Audio
        console.log('Generating Audio...');
        const audioBuffer = await generateAudio(summary);

        // 5. Upload Audio
        console.log('Uploading Audio...');
        const audioFileName = `summaries/audio_${Date.now()}.mp3`;
        const audioUrl = await uploadFile(audioBuffer, audioFileName);

        console.log('Saving to Firestore...');
        const chatData = {
            userId: userId,
            documentUrl: fileUrl,
            originalFileName: originalFileName,
            summary: summary,
            language: language,
            audioUrl: audioUrl,
            timestamp: new Date().toISOString()
        };

        const { db } = require('../services/firebaseService');
        await db.collection('chats').add(chatData);

        console.log('Analysis complete.');

        res.json({
            summary: summary,
            audioUrl: audioUrl,
            chatId: chatData.timestamp
        });

    } catch (error) {
        console.error('Error analyzing document:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};

exports.analyzeText = async (req, res) => {
    try {
        const { text, userId, language } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'No text provided' });
        }

        const targetLanguage = language || 'amharic';
        const userIdValue = userId || 'anonymous';

        console.log(`[${new Date().toISOString()}] processing text input in ${targetLanguage}`);

        // 1. Process text with Gemini
        console.log('Processing text with Gemini...');
        const summary = await summarizeAndTranslate(text, targetLanguage);

        // 2. Generate Audio
        console.log('Generating Audio...');
        const audioBuffer = await generateAudio(summary);

        // 3. Upload Audio
        console.log('Uploading Audio...');
        const audioFileName = `summaries/audio_${Date.now()}.mp3`;
        const audioUrl = await uploadFile(audioBuffer, audioFileName);

        console.log('Saving to Firestore...');
        const chatData = {
            userId: userIdValue,
            originalText: text,
            summary: summary,
            language: targetLanguage,
            audioUrl: audioUrl,
            timestamp: new Date().toISOString()
        };

        const { db } = require('../services/firebaseService');
        await db.collection('chats').add(chatData);

        console.log('Text analysis complete.');

        res.json({
            summary: summary,
            audioUrl: audioUrl,
            chatId: chatData.timestamp
        });

    } catch (error) {
        console.error('Error analyzing text:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};
