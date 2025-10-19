import React from 'react';

interface ComicPanel {
  url: string;
  prompt: string;
  panel_number: number;
}

interface ComicStripProps {
  panels: ComicPanel[];
}

export const ComicStrip: React.FC<ComicStripProps> = ({ panels }) => {
  if (!panels || panels.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No comic panels available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {panels.map((panel, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <div className="aspect-square bg-white rounded-lg shadow-md overflow-hidden mb-3">
              <img
                src={panel.url}
                alt={`Comic panel ${panel.panel_number}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback for broken images
                  const target = e.target as HTMLImageElement;
                  target.src = `https://via.placeholder.com/400x400/4A90E2/FFFFFF?text=Panel+${panel.panel_number}`;
                }}
              />
            </div>
            <div className="text-sm text-gray-600">
              <p className="font-semibold mb-1">Panel {panel.panel_number}</p>
              <p className="italic">{panel.prompt}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Comic Strip View */}
      <div className="bg-gray-100 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          Comic Strip View
        </h3>
        <div className="flex overflow-x-auto gap-4 pb-4">
          {panels.map((panel, index) => (
            <div key={index} className="flex-shrink-0 w-64">
              <div className="aspect-square bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={panel.url}
                  alt={`Comic panel ${panel.panel_number}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://via.placeholder.com/400x400/4A90E2/FFFFFF?text=Panel+${panel.panel_number}`;
                  }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-2 text-center">
                Panel {panel.panel_number}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
