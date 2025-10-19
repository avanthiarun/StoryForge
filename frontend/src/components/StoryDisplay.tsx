import React from 'react';
import { ComicStrip } from './ComicStrip';
import { Story } from '../types';

interface StoryDisplayProps {
  story: Story;
}

export const StoryDisplay: React.FC<StoryDisplayProps> = ({ story }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Narrative Text */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          📖 Story Narrative
        </h2>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {story.narrative_text}
          </p>
        </div>
      </div>

      {/* Comic Strip */}
      {story.comic_panels && story.comic_panels.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            🎬 Comic Strip
          </h2>
          <ComicStrip panels={story.comic_panels} />
        </div>
      )}

      {/* Audio Narration */}
      {story.audio_url && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            🎙️ Audio Narration
          </h2>
          <div className="flex justify-center">
            <audio controls className="w-full max-w-md">
              <source src={story.audio_url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
      )}

      {/* Story Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Share Your Story</h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Story link copied to clipboard!');
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            📋 Copy Link
          </button>
          
          <button
            onClick={() => {
              const text = story.narrative_text;
              navigator.clipboard.writeText(text);
              alert('Story text copied to clipboard!');
            }}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            📄 Copy Text
          </button>
          
          <button
            onClick={() => window.print()}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            🖨️ Print Story
          </button>
        </div>
      </div>
    </div>
  );
};
