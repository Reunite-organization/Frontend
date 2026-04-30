import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

export default function ScreenshotUpload({ onImage, onOCRComplete }) {
  const [preview, setPreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [ocrText, setOcrText] = useState('');
  
  const processImage = async (file) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Validate file
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File too large. Maximum size is 10MB.');
      }
      
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        const base64 = reader.result;
        setPreview(base64);
        onImage(base64);
        
        // Try OCR if enabled
        if (onOCRComplete) {
          try {
            // Simulate OCR - in production, call Tesseract
            toast.info('Processing image with OCR...');
            
            // For now, just notify
            setTimeout(() => {
              toast.success('Image ready for AI analysis');
              onOCRComplete('OCR text would be extracted here');
              setIsProcessing(false);
            }, 1000);
          } catch (ocrError) {
            console.warn('OCR failed, but image can still be analyzed:', ocrError);
            toast.warning('OCR failed, but AI can still analyze the image');
            setIsProcessing(false);
          }
        } else {
          setIsProcessing(false);
          toast.success('Image ready for analysis');
        }
      };
      
      reader.onerror = () => {
        throw new Error('Failed to read file');
      };
      
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Image processing error:', error);
      setError(error.message);
      toast.error(error.message);
      setIsProcessing(false);
    }
  };
  
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-invalid-type') {
        toast.error('Please upload an image file (JPEG, PNG, GIF, WebP)');
      } else if (rejection.errors[0]?.code === 'file-too-large') {
        toast.error('File too large. Maximum size is 10MB.');
      }
      return;
    }
    
    const file = acceptedFiles[0];
    if (file) {
      processImage(file);
    }
  }, [onImage, onOCRComplete]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.heic']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: isProcessing
  });
  
  const clearImage = () => {
    setPreview(null);
    setOcrText('');
    setError(null);
    onImage(null);
    if (onOCRComplete) onOCRComplete('');
  };
  
  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {!preview ? (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
            ${isDragActive ? 'border-blue-500 bg-blue-50 scale-105' : 'border-gray-300 hover:border-gray-400'}
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          {isProcessing ? (
            <>
              <Loader2 className="w-12 h-12 mx-auto text-blue-600 mb-4 animate-spin" />
              <p className="text-lg font-medium mb-2">Processing image...</p>
              <p className="text-sm text-gray-500">This may take a moment</p>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium mb-2">
                {isDragActive ? 'Drop the screenshot here' : 'Upload screenshot'}
              </p>
              <p className="text-sm text-gray-500 mb-2">
                Drag & drop or click to select
              </p>
              <p className="text-xs text-gray-400">
                Supports: JPEG, PNG, GIF, WebP (Max 10MB)
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full rounded-lg max-h-64 object-contain border"
          />
          
          {!isProcessing && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={clearImage}
              className="absolute top-2 right-2 shadow-lg"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          
          {ocrText && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-medium text-gray-600 mb-1">OCR Extracted Text:</p>
              <p className="text-sm text-gray-700">{ocrText}</p>
            </div>
          )}
        </div>
      )}
      
      <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
        <ImageIcon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Screenshot Tips:</p>
          <ul className="list-disc list-inside space-y-1 text-blue-700">
            <li>Upload screenshots from Facebook, Telegram, or other apps</li>
            <li>Clear images work best for AI analysis</li>
            <li>OCR will attempt to extract text automatically</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
