import { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Lock, 
  Eye, 
  EyeOff, 
  GripVertical,
  Lightbulb,
  AlertCircle,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useLanguage } from '../../../../lib/i18n';
import { EXAMPLE_QUESTIONS } from '../../utils/constants';

export const QuestionBuilder = ({ questions = [], onChange, error }) => {
  const { language } = useLanguage();
  const [showAnswers, setShowAnswers] = useState({});
  const [showExamples, setShowExamples] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(null);

  const addQuestion = () => {
    if (questions.length >= 2) return;
    
    onChange([
      ...questions,
      {
        question: { en: '', am: '' },
        answer: '',
        hint: { en: '', am: '' },
      },
    ]);
    setActiveQuestionIndex(questions.length);
  };

  const removeQuestion = (index) => {
    onChange(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index, field, value, language = null) => {
    const updated = [...questions];
    
    if (language) {
      updated[index] = {
        ...updated[index],
        [field]: {
          ...updated[index][field],
          [language]: value,
        },
      };
    } else {
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
    }
    
    onChange(updated);
  };

  const toggleAnswerVisibility = (index) => {
    setShowAnswers(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const useExample = (index, example) => {
    updateQuestion(index, 'question', example, 'en');
    updateQuestion(index, 'question', example, 'am');
  };

  return (
    <div className="space-y-6">
      {/* Header with Example Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-charcoal mb-1">
            {language === 'am' ? 'ሚስጥራዊ ጥያቄዎች' : 'Secret Questions'}
          </h3>
          <p className="text-sm text-stone">
            {language === 'am'
              ? `${questions.length} ከ3 ጥያቄዎች (ቢያንስ 2 ያስፈልጋል)`
              : `${questions.length} of 3 questions (minimum 2 required)`
            }
          </p>
        </div>
        
        <button
          onClick={() => setShowExamples(!showExamples)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-olive hover:text-terracotta transition-colors"
        >
          <Lightbulb className="w-4 h-4" />
          {language === 'am' ? 'ምሳሌዎች' : 'Examples'}
          <ChevronDown className={`w-4 h-4 transition-transform ${showExamples ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Example Questions */}
      <AnimatePresence>
        {showExamples && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-cream rounded-xl border border-warm-gray/30 mb-4">
              <p className="text-sm font-medium text-charcoal mb-3">
                {language === 'am' ? 'የሚመከሩ ጥያቄዎች' : 'Suggested Questions'}
              </p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_QUESTIONS[language]?.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (activeQuestionIndex !== null) {
                        useExample(activeQuestionIndex, example);
                      } else if (questions.length < 3) {
                        addQuestion();
                        setTimeout(() => useExample(questions.length, example), 50);
                      }
                    }}
                    className="px-3 py-1.5 bg-white text-sm text-olive rounded-full border border-warm-gray hover:border-terracotta hover:bg-terracotta/5 transition-all"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Questions List */}
      <Reorder.Group
        axis="y"
        values={questions}
        onReorder={onChange}
        className="space-y-4"
      >
        <AnimatePresence mode="popLayout">
          {questions.map((q, index) => (
            <Reorder.Item
              key={index}
              value={q}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-cream rounded-xl border border-warm-gray/30 p-4 focus:outline-none"
              onFocus={() => setActiveQuestionIndex(index)}
            >
              <div className="flex items-start gap-3">
                {/* Drag Handle */}
                <div className="cursor-grab active:cursor-grabbing pt-2">
                  <GripVertical className="w-5 h-5 text-stone" />
                </div>

                {/* Question Number */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-terracotta/10 flex items-center justify-center">
                  <span className="text-terracotta font-medium">{index + 1}</span>
                </div>

                {/* Question Content */}
                <div className="flex-1 space-y-3">
                  {/* Question Input */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        value={q.question?.en || ''}
                        onChange={(e) => updateQuestion(index, 'question', e.target.value, 'en')}
                        placeholder="Question in English"
                        className="w-full px-3 py-2 bg-white border border-warm-gray rounded-lg focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 outline-none text-sm"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={q.question?.am || ''}
                        onChange={(e) => updateQuestion(index, 'question', e.target.value, 'am')}
                        placeholder="ጥያቄ በአማርኛ"
                        className="w-full px-3 py-2 bg-white border border-warm-gray rounded-lg focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 outline-none text-sm font-amharic"
                        dir="auto"
                      />
                    </div>
                  </div>

                  {/* Answer Input */}
                  <div className="relative">
                    <input
                      type={showAnswers[index] ? 'text' : 'password'}
                      value={q.answer || ''}
                      onChange={(e) => updateQuestion(index, 'answer', e.target.value)}
                      placeholder={language === 'am' ? 'ትክክለኛው መልስ' : 'Correct answer'}
                      className="w-full px-3 py-2 pr-10 bg-white border border-warm-gray rounded-lg focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 outline-none text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => toggleAnswerVisibility(index)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-stone hover:text-charcoal"
                    >
                      {showAnswers[index] ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Hint (Optional) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={q.hint?.en || ''}
                      onChange={(e) => updateQuestion(index, 'hint', e.target.value, 'en')}
                      placeholder="Hint in English (optional)"
                      className="w-full px-3 py-2 bg-white border border-warm-gray rounded-lg focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 outline-none text-xs"
                    />
                    <input
                      type="text"
                      value={q.hint?.am || ''}
                      onChange={(e) => updateQuestion(index, 'hint', e.target.value, 'am')}
                      placeholder="ፍንጭ በአማርኛ (አማራጭ)"
                      className="w-full px-3 py-2 bg-white border border-warm-gray rounded-lg focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 outline-none text-xs font-amharic"
                      dir="auto"
                    />
                  </div>
                </div>

                {/* Remove Button */}
                {questions.length > 2 && (
                  <button
                    onClick={() => removeQuestion(index)}
                    className="flex-shrink-0 p-2 text-stone hover:text-error transition-colors rounded-full hover:bg-error/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>

      {/* Add Question Button */}
      {questions.length < 3 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={addQuestion}
          className="w-full py-4 border-2 border-dashed border-warm-gray rounded-xl text-olive hover:border-terracotta hover:text-terracotta transition-all flex items-center justify-center gap-2 group"
        >
          <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
          {language === 'am' ? 'ጥያቄ አክል' : 'Add Question'}
        </motion.button>
      )}

      {/* Security Note */}
      <div className="flex items-start gap-3 p-4 bg-warmth/5 rounded-xl border border-warmth/20">
        <Lock className="w-5 h-5 text-warmth flex-shrink-0 mt-0.5" />
        <div className="text-sm text-stone">
          <p className="font-medium text-charcoal mb-1">
            {language === 'am' ? 'ደህንነቱ የተጠበቀ' : 'Secure & Private'}
          </p>
          <p>
            {language === 'am'
              ? 'መልሶች በአስተማማኝ ሁኔታ ይከማቻሉ። ትክክለኛው ሰው ብቻ ማወቅ የሚችለውን ጥያቄ ይጠይቁ።'
              : 'Answers are stored securely. Ask something only the right person would know.'
            }
          </p>
        </div>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-error flex items-center gap-1"
        >
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </motion.p>
      )}
    </div>
  );
};
