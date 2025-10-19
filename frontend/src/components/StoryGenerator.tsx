import React, { useState } from 'react';
import { GenerateStoryRequest } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

interface StoryGeneratorProps {
  projectId: string;
  onGenerate: (options: GenerateStoryRequest) => Promise<void>;
  isLoading: boolean;
}

export const StoryGenerator: React.FC<StoryGeneratorProps> = ({
  projectId,
  onGenerate,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    time_range: 'last_sprint',
    tone: 'engaging',
    format: 'narrative',
    include_comics: true,
    num_panels: 4,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onGenerate({
      project_id: projectId,
      ...formData,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-2 text-gray-800">✨ Generate Project Story</h2>
      <p className="text-gray-600 mb-6">Transform your Jira project into an epic narrative</p>

      <div className="space-y-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">⏱️ Time Range</label>
          <select
            value={formData.time_range}
            onChange={(e) => setFormData({ ...formData, time_range: e.target.value })}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-purple-500"
          >
            <option value="last_sprint">Last Sprint</option>
            <option value="last_month">Last Month</option>
            <option value="all_time">All Time</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">🎭 Narrative Tone</label>
          <select
            value={formData.tone}
            onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-purple-500"
          >
            <option value="engaging">Engaging</option>
            <option value="dramatic">Dramatic</option>
            <option value="humorous">Humorous</option>
            <option value="documentary">Documentary</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">📖 Story Format</label>
          <select
            value={formData.format}
            onChange={(e) => setFormData({ ...formData, format: e.target.value })}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-purple-500"
          >
            <option value="narrative">Full Narrative Story</option>
            <option value="milestone">Milestone Summary</option>
            <option value="chaos_to_resolution">Chaos to Resolution</option>
          </select>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.include_comics}
              onChange={(e) => setFormData({ ...formData, include_comics: e.target.checked })}
              className="w-5 h-5 cursor-pointer"
            />
            <span className="text-gray-700 font-semibold">🎬 Include Comic Strip</span>
          </label>
        </div>

        {formData.include_comics && (
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Panel Count</label>
            <select
              value={formData.num_panels}
              onChange={(e) => setFormData({ ...formData, num_panels: parseInt(e.target.value) })}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-purple-500"
            >
              <option value={2}>2 Panels</option>
              <option value={3}>3 Panels</option>
              <option value={4}>4 Panels</option>
              <option value={5}>5 Panels</option>
              <option value={6}>6 Panels</option>
            </select>
          </div>
        )}
      </div>

      <div className="mt-8">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <LoadingSpinner size="sm" />
              <span>Generating Story...</span>
            </div>
          ) : (
            '🎭 Generate Epic Story'
          )}
        </button>
      </div>
    </form>
  );
};