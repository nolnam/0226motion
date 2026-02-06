'use client';

import React, { useState, useEffect } from 'react';
import { analyzeSentiment, emotionMap, EmotionStyle } from '@/lib/sentiment';

interface DiaryEntry {
  id: string;
  text: string;
  emotion: string;
  date: string;
}

export default function EmotionDiaryPage() {
  const [text, setText] = useState('');
  const [currentEmotionStyle, setCurrentEmotionStyle] = useState<EmotionStyle>(emotionMap.neutral);
  const [isFocused, setIsFocused] = useState(false);
  const [history, setHistory] = useState<DiaryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('emotion_diary_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Analyze sentiment and update style whenever text changes
  useEffect(() => {
    const emotion = analyzeSentiment(text);
    const style = emotionMap[emotion];
    setCurrentEmotionStyle(style);
  }, [text]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSave = () => {
    if (!text.trim()) return;

    setSaveStatus('saving');

    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      text,
      emotion: currentEmotionStyle.name,
      date: new Date().toLocaleString(),
    };

    const updatedHistory = [newEntry, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('emotion_diary_history', JSON.stringify(updatedHistory));

    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 800);
  };

  return (
    <main
      className="relative min-h-screen w-full flex flex-col items-center justify-center p-8 bg-transition overflow-hidden"
      style={{ backgroundColor: currentEmotionStyle.bgColor }}
    >
      {/* Background watermark "감정" */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
      >
        <span
          className="text-[30vw] font-bold opacity-[0.03] transition-all duration-1000 ease-in-out"
          style={{ color: currentEmotionStyle.color }}
        >
          감정
        </span>
      </div>

      {/* Subtle indicator of current emotion */}
      <div
        className="absolute top-12 left-1/2 -translate-x-1/2 text-xs tracking-[0.3em] uppercase opacity-40 transition-all duration-1000 ease-in-out"
        style={{ color: currentEmotionStyle.color }}
      >
        {currentEmotionStyle.name}
      </div>

      {/* History Toggle */}
      <button
        onClick={() => setShowHistory(!showHistory)}
        className="absolute top-12 right-12 text-[10px] tracking-widest uppercase opacity-40 hover:opacity-100 transition-all duration-300 cursor-pointer btn-pop"
        style={{ color: currentEmotionStyle.color }}
      >
        {showHistory ? 'Close History' : 'History'}
      </button>

      {/* Main Input Area */}
      <div className="w-full max-w-4xl relative group flex flex-col items-center">
        <textarea
          autoFocus
          placeholder="오늘의 감정을 기록해보세요..."
          value={text}
          onChange={handleTextChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full min-h-[50vh] bg-transparent border-none outline-none resize-none
            text-3xl md:text-4xl text-center leading-relaxed font-serif tracking-tight
            placeholder:text-white/10 transition-opacity duration-700
            ${isFocused ? 'opacity-100' : 'opacity-60'}
          `}
          style={{ color: currentEmotionStyle.color }}
        />

        {/* Recommended Music Section */}
        <div
          className={`
            mt-8 flex flex-col items-center transition-all duration-1000 ease-in-out
            ${text ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
          `}
        >
          <span className="text-[10px] uppercase tracking-[0.4em] opacity-30 mb-2 font-serif">Today&apos;s Recommended Music</span>
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold tracking-tight font-serif italic" style={{ color: currentEmotionStyle.color }}>
              {currentEmotionStyle.music.title}
            </span>
            <span className="text-xs opacity-50 uppercase tracking-[0.2em] mt-1 font-serif">
              {currentEmotionStyle.music.artist}
            </span>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={!text.trim() || saveStatus !== 'idle'}
          className={`
            mt-12 px-14 py-5 rounded-full border-2 text-base uppercase tracking-[0.3em]
            transition-all duration-500 hover:scale-105 hover:shadow-lg disabled:opacity-0 btn-pop font-serif
            ${saveStatus === 'saved' ? 'border-green-500/70 bg-green-500/10 animate-pop' : 'border-white/30 bg-white/5'}
            ${saveStatus === 'saving' ? 'opacity-70' : ''}
          `}
          style={{
            color: currentEmotionStyle.color,
            boxShadow: `0 0 30px ${currentEmotionStyle.color}20`
          }}
        >
          {saveStatus === 'idle' && '저장하기'}
          {saveStatus === 'saving' && '저장 중...'}
          {saveStatus === 'saved' && '저장 완료 ✓'}
        </button>
      </div>

      {/* History Side Panel */}
      <div
        className={`
          fixed inset-y-0 right-0 w-80 bg-black/40 backdrop-blur-xl border-l border-white/5
          transform transition-transform duration-700 ease-in-out z-50 p-8 overflow-y-auto
          ${showHistory ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <h2 className="text-[10px] uppercase tracking-[0.4em] opacity-40 mb-8 text-white font-serif">Past Reflections</h2>
        <div className="space-y-8">
          {history.length === 0 ? (
            <p className="text-xs opacity-20 font-serif">No entries yet.</p>
          ) : (
            history.map((entry) => (
              <div key={entry.id} className="group cursor-default">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] opacity-30 uppercase tracking-widest font-serif">{entry.date}</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 opacity-40 font-serif">{entry.emotion}</span>
                </div>
                <p className="text-sm text-white/70 line-clamp-2 leading-relaxed group-hover:text-white transition-colors duration-300 font-serif tracking-tight">
                  {entry.text}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer Info */}
      <footer className="absolute bottom-12 text-[10px] tracking-widest uppercase opacity-20 hover:opacity-50 transition-opacity duration-500 cursor-default">
        Emotion Diary • Persistence layer active
      </footer>
    </main>
  );
}
