import { useState, useRef } from 'react'
import Header from '../components/Header'
import Button from '../components/Button'
import { analyzeReceipt } from '../utils/claudeApi'

export default function ReceiptScreen({ apiKey, receiptImage, setReceiptImage, onReceiptParsed, onSkipToManual, onBack }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState('');
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (!file) return;
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      setReceiptImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!receiptImage) return;
    if (!apiKey) {
      setError('Please add your Anthropic API key in Settings first.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setProgress('Reading receipt...');

    try {
      // Extract base64 data and media type from data URL
      const matches = receiptImage.match(/^data:([^;]+);base64,(.+)$/);
      if (!matches) {
        throw new Error('Invalid image format');
      }
      const mediaType = matches[1];
      const base64Data = matches[2];

      setProgress('Analyzing with Claude AI...');
      const data = await analyzeReceipt(base64Data, mediaType, apiKey);
      setProgress('Done!');

      setTimeout(() => {
        onReceiptParsed(data);
      }, 300);
    } catch (err) {
      setError(err.message || 'Failed to analyze receipt. Please try again or enter items manually.');
      setIsAnalyzing(false);
      setProgress('');
    }
  };

  const handleClear = () => {
    setReceiptImage(null);
    setError(null);
    setProgress('');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header
        title="Scan Receipt"
        onBack={onBack}
      />

      <div className="flex-1 px-4 py-6 flex flex-col gap-4 max-w-lg mx-auto w-full">
        {!receiptImage ? (
          <>
            {/* Upload options */}
            <div className="text-center mb-2">
              <p className="text-gray-500 text-sm">Take a photo or upload an image of your receipt</p>
            </div>

            {/* Camera option */}
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="w-full bg-white border-2 border-dashed border-indigo-200 rounded-2xl p-8 flex flex-col items-center gap-3 active:bg-indigo-50 transition-colors"
            >
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center">
                <svg width="32" height="32" fill="none" stroke="#4f46e5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Take a Photo</p>
                <p className="text-sm text-gray-500 mt-0.5">Use your camera</p>
              </div>
            </button>

            {/* File upload option */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4 active:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                <svg width="24" height="24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Upload from Library</p>
                <p className="text-sm text-gray-500 mt-0.5">Choose an existing photo</p>
              </div>
              <svg className="ml-auto text-gray-300" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">OR</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Manual entry */}
            <button
              onClick={onSkipToManual}
              className="w-full text-indigo-600 font-medium py-3 text-sm active:opacity-70 transition-opacity"
            >
              Enter items manually instead
            </button>
          </>
        ) : (
          <>
            {/* Image preview */}
            <div className="relative bg-black rounded-2xl overflow-hidden shadow-lg">
              <img
                src={receiptImage}
                alt="Receipt"
                className="w-full max-h-80 object-contain"
              />
              {!isAnalyzing && (
                <button
                  onClick={handleClear}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white active:opacity-70"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>

            {/* Analysis progress */}
            {isAnalyzing && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border-[3px] border-indigo-200 border-t-indigo-600 animate-spin shrink-0" />
                <div>
                  <p className="font-medium text-indigo-900 text-sm">{progress}</p>
                  <p className="text-xs text-indigo-600 mt-0.5">This usually takes a few seconds</p>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
                <p className="text-sm text-red-700 font-medium mb-1">Failed to analyze</p>
                <p className="text-xs text-red-600">{error}</p>
                <button
                  onClick={onSkipToManual}
                  className="mt-3 text-sm text-red-700 font-semibold underline"
                >
                  Enter items manually instead
                </button>
              </div>
            )}

            {/* Tips */}
            {!isAnalyzing && !error && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-xs text-blue-700 font-medium mb-1">For best results:</p>
                <ul className="text-xs text-blue-600 space-y-1">
                  <li>• Make sure the receipt is flat and well-lit</li>
                  <li>• Include the full receipt in the photo</li>
                  <li>• You can edit any mistakes after scanning</li>
                </ul>
              </div>
            )}
          </>
        )}

        {/* Hidden file inputs */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={e => handleFileSelect(e.target.files?.[0])}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => handleFileSelect(e.target.files?.[0])}
        />
      </div>

      {/* Analyze button */}
      {receiptImage && !isAnalyzing && (
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-4 pb-safe">
          <Button onClick={handleAnalyze} disabled={isAnalyzing}>
            <svg className="mr-2" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Analyze Receipt
          </Button>
          <button
            onClick={handleClear}
            className="w-full mt-3 text-sm text-gray-500 active:opacity-70 py-1"
          >
            Use a different photo
          </button>
        </div>
      )}
    </div>
  );
}
