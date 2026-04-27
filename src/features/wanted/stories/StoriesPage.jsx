import React from 'react';
import { SuccessStories } from '../components/shared/SuccessStories';
import { useLanguage } from '../../../lib/i18n';
import { Heart, Sparkles } from 'lucide-react';

export const StoriesPage = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Hero Header */}
      <div className="bg-charcoal text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="container relative text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-hope-green/20 rounded-full mb-6 border border-hope-green/30">
            <Sparkles className="w-4 h-4 text-hope-green" />
            <span className="text-sm font-medium text-hope-green-light uppercase tracking-wider">
              {language === 'am' ? 'የተሳኩ ታሪኮች' : 'Stories of Hope'}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-display">
            {language === 'am' ? 'የተሳኩ ታሪኮች' : 'Success Stories'}
          </h1>
          
          <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            {language === 'am' 
              ? 'በእኛ ድረ ገጽ በኩል እንደገና የተገናኙ ልብን የሚያሞቁ ታሪኮች' 
              : 'Heartwarming accounts of families and friends reunited through our platform'}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-16">
        <SuccessStories limit={20} />
      </div>

      {/* Impact Banner */}
      <div className="container pb-20">
        <div className="bg-gradient-to-br from-sahara to-terracotta rounded-3xl p-12 text-white text-center shadow-xl">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">
            {language === 'am' ? 'ታሪክዎትን ያጋሩ' : 'Share Your Story'}
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
            {language === 'am'
              ? 'በዚህ ድረ ገጽ ያገኙት ሰው አለ? እርስዎ የሄዱበት ርቀት ለሌሎች ተስፋ ይሆናል እና ታኪሮትን አሁኑኑ ያጋሩን።'
              : 'Did you find someone through Reunite? Your story could be the beacon of hope someone else needs.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
             {/* The link is already provided in the SuccessStories component below the grid, 
                 but we can add another CTA here if needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoriesPage;
