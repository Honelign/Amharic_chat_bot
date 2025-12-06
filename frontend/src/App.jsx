import React, { useState, useEffect } from 'react';
import { signInWithGoogle, logOut, auth, db } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { analyzeDocument } from './services/api';
import ChatInterface from './components/ChatInterface';
import { Bot, LogOut, Github } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Load chat history if needed, for now we start fresh or could load from Firestore
        // loadHistory(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleFileUpload = async (file) => {
    if (!user) {
      alert("Please login first!");
      return;
    }

    // Add user message immediately
    const userMsg = {
      role: 'user',
      type: 'file',
      fileName: file.name,
      content: `Uploaded: ${file.name}`
    };
    setMessages(prev => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      // 1. Send file directly to Backend for analysis and storage
      const result = await analyzeDocument(file, user.uid);

      // 2. Add Assistant Message
      const assistantMsg = {
        role: 'assistant',
        content: result.summary,
        audioUrl: result.audioUrl
      };
      setMessages(prev => [...prev, assistantMsg]);

    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I encountered an error analyzing your document. Please try again."
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white">
              <Bot className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
              AmhaChat
            </h1>
          </div>

          <div>
            {user ? (
              <div className="flex items-center space-x-4">
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-8 h-8 rounded-full border border-gray-200"
                />
                <button
                  onClick={logOut}
                  className="text-sm font-medium text-gray-500 hover:text-red-500 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all text-sm font-medium"
              >
                <span>Sign in with Google</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {user ? (
          <ChatInterface
            user={user}
            onFileUpload={handleFileUpload}
            isProcessing={isProcessing}
            messages={messages}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] p-4">
            <div className="text-center max-w-2xl space-y-6">
              <div className="inline-flex p-4 rounded-full bg-green-50 mb-4">
                <Bot className="w-16 h-16 text-green-600" />
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
                Break Language Barriers. <br />
                <span className="text-green-600">Summarize & Listen.</span>
              </h2>
              <p className="text-lg text-gray-600">
                Upload documents and instantly get Amharic summaries with audio playback.
                Powered by Google Gemini & Cloud Run.
              </p>
              <button
                onClick={signInWithGoogle}
                className="mt-8 px-8 py-4 bg-green-600 text-white text-lg font-bold rounded-2xl shadow-lg hover:bg-green-700 hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
