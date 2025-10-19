import React from 'react';
import { Project } from '../types';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition transform hover:scale-105">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">{project.name}</h3>
        <p className="text-gray-500 text-sm mt-1">📌 Key: {project.key}</p>
      </div>
      
      <p className="text-gray-600 mt-3 text-sm line-clamp-2">
        {project.description || 'No description available'}
      </p>
      
      <div className="mt-6 flex gap-2">
        <Link
          to={`/generate/${project.id}`}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded text-center transition font-semibold text-sm"
        >
          ✨ Generate Story
        </Link>
        <Link
          to={`/project/${project.id}/stories`}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-center transition font-semibold text-sm"
        >
          📚 View Stories
        </Link>
      </div>
    </div>
  );
};