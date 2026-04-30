import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, X, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function QuickSighting({ position, onClose, onSubmit }) {
  const [step, setStep] = useState(1);
  const [selectedClothing, setSelectedClothing] = useState([]);
  const [selectedGender, setSelectedGender] = useState(null);
  
  const clothingOptions = [
    'Red shirt', 'Blue jeans', 'Black jacket', 'White dress',
    'Hoodie', 'Traditional clothes', 'School uniform'
  ];
  
  const genderOptions = [
    { value: 'male', label: '👨 Male' },
    { value: 'female', label: '👩 Female' },
    { value: 'child', label: '🧒 Child' }
  ];
  
  const handleSubmit = () => {
    const description = `Saw ${selectedGender || 'person'} wearing ${selectedClothing.join(', ')}`;
    onSubmit(description);
    toast.success('Thank you for helping!');
    onClose();
  };
  
  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[2000] w-[90%] max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              <h3 className="font-semibold">Quick Sighting Report</h3>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-white/80 mt-1">
            Step {step} of 3 • Takes 5 seconds
          </p>
        </div>
        
        {/* Content */}
        <div className="p-4">
          {step === 1 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">Who did you see?</p>
              <div className="grid grid-cols-3 gap-2">
                {genderOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSelectedGender(option.value);
                      setStep(2);
                    }}
                    className="p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all text-center"
                  >
                    <div className="text-2xl mb-1">
                      {option.value === 'male' ? '👨' : option.value === 'female' ? '👩' : '🧒'}
                    </div>
                    <span className="text-sm">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <button onClick={() => setStep(1)} className="text-blue-600 text-sm">
                  ← Back
                </button>
                <p className="text-sm font-medium text-gray-700">What were they wearing?</p>
              </div>
              <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
                {clothingOptions.map(item => (
                  <Badge
                    key={item}
                    variant={selectedClothing.includes(item) ? 'default' : 'outline'}
                    className="cursor-pointer text-sm py-2 px-3"
                    onClick={() => {
                      setSelectedClothing(prev =>
                        prev.includes(item)
                          ? prev.filter(i => i !== item)
                          : [...prev, item]
                      );
                    }}
                  >
                    {item}
                  </Badge>
                ))}
              </div>
              {selectedClothing.length > 0 && (
                <Button onClick={() => setStep(3)} className="w-full mt-3">
                  Continue <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <p className="font-medium text-gray-800">Ready to submit?</p>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedGender && `${genderOptions.find(g => g.value === selectedGender)?.label} • `}
                  {selectedClothing.join(', ')}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  📍 {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleSubmit} className="flex-1">
                  Submit Report
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div 
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
