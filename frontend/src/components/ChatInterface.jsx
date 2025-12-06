import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Play, Square, Loader2, Send, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatInterface = ({ user, onFileUpload, onTextSubmit, isProcessing, messages }) => {
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const [dragging, setDragging] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('amharic');
    const [textInput, setTextInput] = useState('');

    // Auto scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isProcessing]);

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            onFileUpload(files[0], selectedLanguage);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files.length > 0) {
            onFileUpload(e.target.files[0], selectedLanguage);
        }
    };

    const handleTextSubmit = () => {
        if (textInput.trim() && onTextSubmit) {
            onTextSubmit(textInput, selectedLanguage);
            setTextInput('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleTextSubmit();
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] max-w-4xl mx-auto p-4">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-6 pb-4 scrollbar-hide">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <FileText className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-xl font-semibold">Welcome, {user?.displayName}!</h2>
                        <p className="max-w-md text-center">
                            Upload a document or enter text to get a summary in Amharic or Oromiffa with audio playback.
                        </p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${msg.role === 'user'
                            ? 'bg-green-600 text-white rounded-br-none'
                            : 'bg-white border border-gray-100 rounded-bl-none'
                            }`}>
                            {msg.type === 'file' && (
                                <div className="flex items-center space-x-3 mb-2">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <span className="font-medium text-sm truncate">{msg.fileName}</span>
                                </div>
                            )}

                            <div className="text-sm leading-relaxed whitespace-pre-wrap">
                                {msg.content}
                            </div>

                            {msg.audioUrl && (
                                <div className="mt-4 pt-3 border-t border-gray-100">
                                    <AudioPlayer src={msg.audioUrl} />
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}

                {isProcessing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                    >
                        <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none p-4 shadow-sm flex items-center space-x-3">
                            <Loader2 className="w-5 h-5 text-green-600 animate-spin" />
                            <span className="text-sm text-gray-600">Analyzing document & translating...</span>
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="mt-4 space-y-3">
                {/* Language Selector */}
                <div className="flex items-center space-x-2 bg-white p-3 rounded-xl border border-gray-200">
                    <Languages className="w-5 h-5 text-green-600" />
                    <label className="text-sm font-medium text-gray-700">Output Language:</label>
                    <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                        <option value="amharic">Amharic (አማርኛ)</option>
                        <option value="oromiffa">Oromiffa (Afaan Oromoo)</option>
                    </select>
                </div>

                {/* Input Area */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative flex items-center p-2 rounded-2xl border-2 transition-all ${dragging
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-white hover:border-300'
                        }`}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                        accept=".pdf,.docx,.txt"
                    />

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                        title="Upload File"
                    >
                        <Upload className="w-5 h-5" />
                    </button>

                    <textarea
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={dragging ? "Drop file here..." : "Type text to summarize or drag & drop a file..."}
                        className="flex-1 px-4 py-3 text-sm bg-transparent border-none outline-none resize-none"
                        rows="1"
                        style={{ minHeight: '24px', maxHeight: '120px' }}
                    />

                    <button
                        onClick={handleTextSubmit}
                        disabled={!user || isProcessing || !textInput.trim()}
                        className="p-3 bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const AudioPlayer = ({ src }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="flex items-center space-x-3 bg-green-50 p-2 rounded-lg w-full">
            <button
                onClick={togglePlay}
                className="w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded-full hover:bg-green-700 transition"
            >
                {isPlaying ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
            </button>
            <div className="h-1 bg-green-200 rounded-full flex-1">
                {/* Simple progress bar placeholder */}
                <div className="h-full bg-green-500 w-0 rounded-full transition-all duration-300"></div>
            </div>
            <audio
                ref={audioRef}
                src={src}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
            />
            <span className="text-xs text-green-700 font-medium">Listen</span>
        </div>
    );
}

export default ChatInterface;
