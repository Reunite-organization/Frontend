export const CATEGORIES = [
  { value: 'childhood_friend', en: 'Childhood Friend', am: 'የልጅነት ጓደኛ' },
  { value: 'old_neighbor', en: 'Old Neighbor', am: 'የቀድሞ ጎረቤት' },
  { value: 'former_colleague', en: 'Former Colleague', am: 'የቀድሞ የስራ ባልደረባ' },
  { value: 'school_friend', en: 'School Friend', am: 'የትምህርት ቤት ጓደኛ' },
  { value: 'community_member', en: 'Community Member', am: 'የማህበረሰብ አባል' },
  { value: 'event_connection', en: 'Met at Event', am: 'በክስተት የተዋወቅን' },
  { value: 'family_connection', en: 'Family Connection', am: 'የቤተሰብ ግንኙነት' },
  { value: 'other', en: 'Other', am: 'ሌላ' },
];

export const POST_STATUS = {
  active: { en: 'Looking', am: 'በመፈለግ ላይ' },
  claimed: { en: 'Claimed', am: 'ተጠይቋል' },
  reconnected: { en: 'Found', am: 'ተገኝቷል' },
  expired: { en: 'Expired', am: 'ጊዜው አልፏል' },
};

export const TRUST_LEVELS = {
  80: { level: 'verified', en: 'Verified Reconnector', am: 'የተረጋገጠ አገናኝ' },
  60: { level: 'trusted', en: 'Trusted', am: 'የታመነ' },
  40: { level: 'standard', en: 'Standard', am: 'መደበኛ' },
  0: { level: 'new', en: 'New', am: 'አዲስ' },
};

export const EXAMPLE_QUESTIONS = {
  en: [
    'What was the name of our childhood pet?',
    'Which street did we live on?',
    'What was our favorite hangout spot?',
    'Who was our mutual friend?',
    'What year did we first meet?',
  ],
  am: [
    'የልጅነታችን የቤት እንስሳ ስም ማን ነበር?',
    'በየትኛው መንገድ ላይ እንኖር ነበር?',
    'የምንወደው የመሰብሰቢያ ቦታችን ምን ነበር?',
    'የጋራ ጓደኛችን ማን ነበር?',
    'መጀመሪያ የተገናኘነው በየትኛው ዓመት ነበር?',
  ],
};
