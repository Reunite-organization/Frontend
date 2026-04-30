import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, HelpCircle, ArrowRight, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../../../lib/i18n';

export const SecretQuestions = ({ 
  questions, 
  onSubmit, 
  onCancel, 
  isSubmitting 
}) => {
  const { language } = useLanguage();
  const [answers, setAnswers] = useState({});
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all questions answered
    const newErrors = {};
    questions.forEach((_, idx) => {
      if (!answers[idx]?.trim()) {
        newErrors[idx] = language === 'am' 
          ? 'ይህ መስክ ያስፈልጋል' 
          : 'This field is required';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formattedAnswers = Object.entries(answers).map(([idx, answer]) => ({
      questionIndex: parseInt(idx),
      answer: answer.trim(),
    }));

    onSubmit(formattedAnswers, message);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-terracotta/10 rounded-full mb-4">
          <Lock className="w-8 h-8 text-terracotta" />
        </div>
        <h3 className="font-display text-xl font-semibold text-charcoal mb-2">
          {language === 'am' 
            ? 'ማንነትዎን ያረጋግጡ' 
            : 'Verify Your Identity'
          }
        </h3>
        <p className="text-stone">
          {language === 'am'
            ? 'ከለጣፊው ጋር ያለዎትን ግንኙነት ለማረጋገጥ እባክዎ የሚከተሉትን ጥያቄዎች ይመልሱ።'
            : 'Please answer the following questions to verify your connection with the poster.'
          }
        </p>
      </div>

      {/* Questions Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((question, idx) => (
          <div key={idx} className="space-y-2">
            <label className="block">
              <span className="flex items-start gap-2 text-charcoal font-medium mb-2">
                <span className="text-terracotta font-display text-lg">
                  {idx + 1}.
                </span>
                <span>
                  {question.question?.[language] || question.question?.en}
                </span>
                {question.hint && (
                  <div className="group relative">
                    <HelpCircle className="w-4 h-4 text-stone cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-charcoal text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {question.hint[language] || question.hint.en}
                    </div>
                  </div>
                )}
              </span>
            </label>
            <input
              type="text"
              value={answers[idx] || ''}
              onChange={(e) => {
                setAnswers({ ...answers, [idx]: e.target.value });
                if (errors[idx]) {
                  setErrors({ ...errors, [idx]: null });
                }
              }}
              placeholder={language === 'am' ? 'መልስዎን ያስገቡ...' : 'Enter your answer...'}
              className={`w-full px-4 py-3 bg-warm-white border rounded-xl transition-all outline-none focus:ring-2 ${
                errors[idx]
                  ? 'border-error focus:ring-error/20'
                  : 'border-warm-gray focus:border-terracotta focus:ring-terracotta/20'
              }`}
              disabled={isSubmitting}
            />
            {errors[idx] && (
              <p className="text-sm text-error flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors[idx]}
              </p>
            )}
          </div>
        ))}

        {/* Optional Message */}
        <div className="space-y-2">
          <label className="block text-charcoal font-medium">
            {language === 'am' 
              ? 'ለለጣፊው መልእክት (አማራጭ)' 
              : 'Message to Poster (Optional)'
            }
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={language === 'am'
              ? 'ስለራስዎ ወይም ስለ ግንኙነትዎ ተጨማሪ መረጃ...'
              : 'Any additional information about yourself or your connection...'
            }
            rows={3}
            className="w-full px-4 py-3 bg-warm-white border border-warm-gray rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-all outline-none resize-none"
            disabled={isSubmitting}
          />
        </div>

        {/* Privacy Notice */}
        <div className="p-4 bg-warmth/5 rounded-xl border border-warmth/20">
          <p className="text-sm text-stone flex items-start gap-2">
            <Lock className="w-4 h-4 text-warmth flex-shrink-0 mt-0.5" />
            <span>
              {language === 'am'
                ? 'መልሶችዎ በሚስጥር ይያዛሉ እና ማንነትዎ እስኪጸድቅ ድረስ ለለጣፊው ብቻ ይታያሉ።'
                : 'Your answers are kept confidential and will only be shown to the poster until your identity is verified.'
              }
            </span>
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 border-2 border-warm-gray text-stone rounded-full font-medium hover:bg-warm-gray/20 transition-colors"
            disabled={isSubmitting}
          >
            {language === 'am' ? 'ይቅር' : 'Cancel'}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 btn-primary flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{language === 'am' ? 'በማስገባት ላይ...' : 'Submitting...'}</span>
              </>
            ) : (
              <>
                <span>{language === 'am' ? 'የይገባኛል ጥያቄ ያስገቡ' : 'Submit Claim'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};
