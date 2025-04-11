import React from 'react';

interface ApiResponse {
  data: any;
  status: number;
  error: string | null;
}

interface ApiResponseDisplayProps {
  response: ApiResponse | null;
  onClear: () => void;
}

export function ApiResponseDisplay({ response, onClear }: ApiResponseDisplayProps) {
  if (!response) return null;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">API Response</h3>
      <div className={`p-4 rounded-lg ${
        response.error 
          ? 'bg-red-50 border border-red-200' 
          : 'bg-green-50 border border-green-200'
      }`}>
        <div className="flex justify-between items-start mb-2">
          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
            response.error 
              ? 'bg-red-100 text-red-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            Status: {response.status} {response.error ? 'Error' : 'Success'}
          </span>
          
          <button 
            onClick={onClear}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        {response.error && (
          <div className="text-red-700 mb-4">
            Error: {response.error}
          </div>
        )}
        
        <div className="overflow-auto max-h-96">
          <pre className="text-sm p-2 bg-gray-100 rounded">
            {JSON.stringify(response.data, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
} 