# Testing Guide for Language Selection Feature

## Quick Test Checklist

### 1. Test Amharic Text Summarization
```
Steps:
1. Open the app and login
2. Ensure "Amharic (አማርኛ)" is selected in the dropdown
3. Type in the text field: "Artificial intelligence is transforming the world"
4. Press Enter or click Send
5. Wait for processing
6. Verify: Summary appears in Amharic script
7. Click play button to hear audio
```

**Expected Result:**
- Summary should be in Amharic (አማርኛ)
- Audio should play the Amharic text
- Message should appear in chat history

### 2. Test Oromiffa Text Summarization
```
Steps:
1. Change dropdown to "Oromiffa (Afaan Oromoo)"
2. Type in the text field: "Technology is changing our lives every day"
3. Press Enter or click Send
4. Wait for processing
5. Verify: Summary appears in Oromiffa
6. Click play button to hear audio
```

**Expected Result:**
- Summary should be in Oromiffa (Afaan Oromoo)
- Audio should play the Oromiffa text
- Message should appear in chat history

### 3. Test Amharic File Upload
```
Steps:
1. Change dropdown back to "Amharic (አማርኛ)"
2. Click the upload button or drag & drop a PDF file
3. Wait for processing
4. Verify: Summary appears in Amharic
5. Click play button to hear audio
```

**Expected Result:**
- File upload message appears
- Summary in Amharic appears
- Audio plays correctly

### 4. Test Oromiffa File Upload
```
Steps:
1. Change dropdown to "Oromiffa (Afaan Oromoo)"
2. Upload a different document
3. Wait for processing
4. Verify: Summary appears in Oromiffa
5. Click play button to hear audio
```

**Expected Result:**
- File upload message appears
- Summary in Oromiffa appears
- Audio plays correctly

### 5. Test Language Switching
```
Steps:
1. Select Amharic, submit text "Hello world"
2. Wait for Amharic summary
3. Select Oromiffa, submit text "Goodbye world"
4. Wait for Oromiffa summary
5. Verify both messages are in correct languages
```

**Expected Result:**
- First message in Amharic
- Second message in Oromiffa
- Both audio files work correctly

## Backend Testing

### Test API Endpoints

#### 1. Test /api/analyze with Amharic
```bash
curl -X POST http://localhost:8080/api/analyze \
  -F "file=@test.pdf" \
  -F "userId=test-user" \
  -F "language=amharic"
```

**Expected Response:**
```json
{
  "summary": "የሰነዱ ማጠቃለያ...",
  "audioUrl": "https://storage.googleapis.com/...",
  "chatId": "2025-12-06T..."
}
```

#### 2. Test /api/analyze with Oromiffa
```bash
curl -X POST http://localhost:8080/api/analyze \
  -F "file=@test.pdf" \
  -F "userId=test-user" \
  -F "language=oromiffa"
```

**Expected Response:**
```json
{
  "summary": "Cuunfaa galmee...",
  "audioUrl": "https://storage.googleapis.com/...",
  "chatId": "2025-12-06T..."
}
```

#### 3. Test /api/analyze-text with Amharic
```bash
curl -X POST http://localhost:8080/api/analyze-text \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Artificial intelligence is the future",
    "userId": "test-user",
    "language": "amharic"
  }'
```

**Expected Response:**
```json
{
  "summary": "ሰው ሰራሽ የማሰብ ችሎታ የወደፊቱ ነው...",
  "audioUrl": "https://storage.googleapis.com/...",
  "chatId": "2025-12-06T..."
}
```

#### 4. Test /api/analyze-text with Oromiffa
```bash
curl -X POST http://localhost:8080/api/analyze-text \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Technology changes everything",
    "userId": "test-user",
    "language": "oromiffa"
  }'
```

**Expected Response:**
```json
{
  "summary": "Teeknooloojiin waan hunda jijjiira...",
  "audioUrl": "https://storage.googleapis.com/...",
  "chatId": "2025-12-06T..."
}
```

## Firestore Verification

### Check Database Records

1. Open Firebase Console
2. Navigate to Firestore Database
3. Open the `chats` collection
4. Verify recent documents have:
   - `language` field set to "amharic" or "oromiffa"
   - `summary` field contains text in the correct language
   - `audioUrl` field contains valid Cloud Storage URL

**Example Document:**
```json
{
  "userId": "test-user",
  "originalText": "Hello world",
  "summary": "ሰላም ዓለም...",
  "language": "amharic",
  "audioUrl": "https://storage.googleapis.com/.../audio_1234567890.mp3",
  "timestamp": "2025-12-06T14:30:00.000Z"
}
```

## UI/UX Testing

### Visual Checks
- [ ] Language dropdown displays correctly
- [ ] Language icon (🌐) appears
- [ ] Dropdown shows both language options
- [ ] Text input field is visible and functional
- [ ] Upload button is visible
- [ ] Send button is visible and enabled when text is entered
- [ ] Send button is disabled when text field is empty

### Interaction Checks
- [ ] Clicking dropdown opens language options
- [ ] Selecting language updates the dropdown
- [ ] Typing in text field works smoothly
- [ ] Enter key submits text
- [ ] Shift+Enter creates new line
- [ ] Upload button opens file picker
- [ ] Drag & drop shows visual feedback
- [ ] Processing state shows loading indicator
- [ ] Messages appear in chat after processing
- [ ] Audio player appears with summary
- [ ] Audio plays correctly

### Error Handling
- [ ] Test with no internet connection
- [ ] Test with invalid file type
- [ ] Test with very large file
- [ ] Test with empty text submission
- [ ] Test with very long text (>10000 chars)

## Performance Testing

### Response Times
- Text summarization: Should complete in < 10 seconds
- File summarization: Should complete in < 15 seconds
- Audio generation: Should complete in < 5 seconds

### Load Testing
- Submit 5 requests in quick succession
- Verify all requests complete successfully
- Check for memory leaks
- Monitor backend logs for errors

## Browser Compatibility

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

## Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Screen reader announces language selection
- [ ] Focus states are visible
- [ ] Color contrast meets WCAG standards
- [ ] Labels are descriptive

## Common Issues & Solutions

### Issue: Summary not in selected language
**Solution:** Check backend logs, verify Gemini API key, ensure language parameter is passed correctly

### Issue: Audio not playing
**Solution:** Check Cloud Storage permissions, verify audio URL is accessible, check browser console for errors

### Issue: Text input not submitting
**Solution:** Verify onTextSubmit prop is passed to ChatInterface, check for JavaScript errors

### Issue: Language dropdown not changing
**Solution:** Check React state management, verify onChange handler is working

### Issue: File upload fails
**Solution:** Check file size limits, verify multer configuration, check backend logs
