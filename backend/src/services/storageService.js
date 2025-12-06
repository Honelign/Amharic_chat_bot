const { Storage } = require('@google-cloud/storage');

let storage = null;
function getStorage() {
    if (!storage) {
        console.log('Initializing Storage Client...');
        storage = new Storage();
    }
    return storage;
}

const bucketName = process.env.STORAGE_BUCKET;

async function uploadFile(buffer, destination, contentType = null) {
    if (!bucketName) {
        throw new Error("STORAGE_BUCKET environment variable is not set.");
    }

    try {
        const bucket = getStorage().bucket(bucketName);
        const file = bucket.file(destination);

        // Auto-detect content type if not provided
        if (!contentType) {
            const ext = destination.split('.').pop().toLowerCase();
            const contentTypeMap = {
                'pdf': 'application/pdf',
                'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'txt': 'text/plain',
                'mp3': 'audio/mpeg',
            };
            contentType = contentTypeMap[ext] || 'application/octet-stream';
        }

        await file.save(buffer, {
            metadata: {
                contentType: contentType,
            },
        });

        // Generate a signed URL valid for 1 hour
        const [url] = await file.getSignedUrl({
            action: 'read',
            expires: Date.now() + 1000 * 60 * 60, // 1 hour
        });

        return url;
    } catch (e) {
        console.error('Error in uploadFile:', e);
        throw e;
    }
}

module.exports = { uploadFile, getStorage };
