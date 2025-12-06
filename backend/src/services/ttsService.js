const textToSpeech = require('@google-cloud/text-to-speech');

let client = null;

function getClient() {
    if (!client) {
        console.log('Initializing TTS Client...');
        client = new textToSpeech.TextToSpeechClient();
    }
    return client;
}

async function generateAudio(text) {
    const request = {
        input: { text: text },
        // Select the language and SSML voice gender (optional)
        voice: { languageCode: 'am-ET', name: 'am-ET-Standard-B' },
        // select the type of audio encoding
        audioConfig: { audioEncoding: 'MP3' },
    };

    try {
        const [response] = await getClient().synthesizeSpeech(request);
        return response.audioContent;
    } catch (error) {
        console.error('Error in generateAudio:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        throw error;
    }
}

module.exports = { generateAudio };
