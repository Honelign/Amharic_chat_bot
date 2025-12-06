const axios = require('axios');
const { extractText } = require('../utils/pdfParser');
const { summarizeAndTranslate } = require('../services/aiService');
const { generateAudio } = require('../services/ttsService');
const { uploadFile } = require('../services/storageService');

exports.analyzeDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const userId = req.body.userId || 'anonymous';
        const originalFileName = req.file.originalname || 'unknown_file';

        console.log(`[${new Date().toISOString()}] processing uploaded file: ${originalFileName}`);

        // 1. Upload original file to Cloud Storage (Proxy Upload)
        console.log('Uploading original file to Cloud Storage...');
        const fileUploadName = `uploads/${userId}/${Date.now()}_${originalFileName}`;
        const fileUrl = await uploadFile(req.file.buffer, fileUploadName);

        // 2. Extract Text
        console.log('Extracting text...');
        const text = await extractText(req.file.buffer);
        if (!text || text.trim().length === 0) {
            return res.status(400).json({ error: 'Could not extract text from the document.' });
        }

        // 3. Summarize and Translate
        console.log('Summarizing with Gemini...');
        const summaryAmharic = await summarizeAndTranslate(text);

        // 4. Generate Audio
        console.log('Generating Audio...');
        const audioBuffer = await generateAudio(summaryAmharic);

        // 5. Upload Audio
        console.log('Uploading Audio...');
        const audioFileName = `summaries/audio_${Date.now()}.mp3`;
        const audioUrl = await uploadFile(audioBuffer, audioFileName);

        console.log('Saving to Firestore...');
        const chatData = {
            userId: userId,
            documentUrl: fileUrl,
            originalFileName: originalFileName,
            summaryAmharic: summaryAmharic,
            audioUrl: audioUrl,
            timestamp: new Date().toISOString()
        };

        const { db } = require('../services/firebaseService');
        await db.collection('chats').add(chatData);

        console.log('Analysis complete.');

        res.json({
            summary: summaryAmharic,
            audioUrl: audioUrl,
            chatId: chatData.timestamp
        });

    } catch (error) {
        console.error('Error analyzing document:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};
