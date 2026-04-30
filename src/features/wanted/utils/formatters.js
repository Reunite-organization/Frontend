import { formatDistanceToNow, format, formatDistance, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';
import { enUS } from 'date-fns/locale';

// Custom Amharic locale functions
const amharicLocale = {
  formatDistance: (token, count) => {
    const amharicTokens = {
      lessThanXSeconds: count => `ከ${count} ሰከንድ በታች`,
      xSeconds: count => `${count} ሰከንድ`,
      halfAMinute: 'ግማሽ ደቂቃ',
      lessThanXMinutes: count => `ከ${count} ደቂቃ በታች`,
      xMinutes: count => `${count} ደቂቃ`,
      aboutXHours: count => `በግምት ${count} ሰዓት`,
      xHours: count => `${count} ሰዓት`,
      xDays: count => `${count} ቀን`,
      aboutXMonths: count => `በግምት ${count} ወር`,
      xMonths: count => `${count} ወር`,
      aboutXYears: count => `በግምት ${count} ዓመት`,
      xYears: count => `${count} ዓመት`,
      overXYears: count => `ከ${count} ዓመት በላይ`,
      almostXYears: count => `ሊሞላው ${count} ዓመት`,
    };
    return amharicTokens[token]?.(count) || `${count} ${token}`;
  },
};

// Custom relative time formatter for Amharic
const formatAmharicRelativeTime = (date) => {
  const now = new Date();
  const diffMinutes = differenceInMinutes(now, date);
  const diffHours = differenceInHours(now, date);
  const diffDays = differenceInDays(now, date);

  if (diffMinutes < 1) {
    return 'አሁን';
  } else if (diffMinutes < 60) {
    return `ከ${diffMinutes} ደቂቃ በፊት`;
  } else if (diffHours < 24) {
    return `ከ${diffHours} ሰዓት በፊት`;
  } else if (diffDays < 30) {
    return `ከ${diffDays} ቀን በፊት`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `ከ${months} ወር በፊት`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `ከ${years} ዓመት በፊት`;
  }
};

// Custom date formatter for Amharic
const formatAmharicDate = (date, formatStr = 'PPP') => {
  const months = [
    'ጥር', 'የካቲት', 'መጋቢት', 'ሚያዚያ', 'ግንቦት', 'ሰኔ',
    'ሐምሌ', 'ነሐሴ', 'መስከረም', 'ጥቅምት', 'ኅዳር', 'ታህሳስ'
  ];
  
  const weekdays = ['እሑድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'አርብ', 'ቅዳሜ'];
  
  const d = new Date(date);
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const weekday = weekdays[d.getDay()];
  
  if (formatStr === 'PPP') {
    return `${weekday}, ${month} ${day}, ${year}`;
  } else if (formatStr === 'PP') {
    return `${month} ${day}, ${year}`;
  } else if (formatStr === 'p') {
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  } else if (formatStr === 'Pp') {
    return `${month} ${day}, ${year} ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  }
  
  return `${month} ${day}, ${year}`;
};

// Main export functions
export const formatRelativeTime = (date, language = 'en') => {
  if (!date) return '';
  
  try {
    if (language === 'am') {
      return formatAmharicRelativeTime(new Date(date));
    }
    
    return formatDistanceToNow(new Date(date), { 
      addSuffix: true,
      locale: enUS,
    });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return '';
  }
};

export const formatDate = (date, language = 'en', formatStr = 'PPP') => {
  if (!date) return '';
  
  try {
    if (language === 'am') {
      return formatAmharicDate(new Date(date), formatStr);
    }
    
    return format(new Date(date), formatStr, {
      locale: enUS,
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

export const formatMessageTime = (date) => {
  if (!date) return '';
  
  try {
    const messageDate = new Date(date);
    const today = new Date();
    
    if (messageDate.toDateString() === today.toDateString()) {
      return messageDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${messageDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })}`;
    }
    
    return messageDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }) + ' at ' + messageDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch (error) {
    console.error('Error formatting message time:', error);
    return '';
  }
};

export const formatMessageTimeAmharic = (date) => {
  if (!date) return '';
  
  try {
    const messageDate = new Date(date);
    const today = new Date();
    
    const hours = messageDate.getHours();
    const minutes = messageDate.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? 'ከሰዓት' : 'ጠዋት';
    const displayHours = hours % 12 || 12;
    
    if (messageDate.toDateString() === today.toDateString()) {
      return `${displayHours}:${minutes} ${period}`;
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return `ትናንት ${displayHours}:${minutes} ${period}`;
    }
    
    const months = [
      'ጥር', 'የካቲት', 'መጋቢት', 'ሚያዚያ', 'ግንቦት', 'ሰኔ',
      'ሐምሌ', 'ነሐሴ', 'መስከረም', 'ጥቅምት', 'ኅዳር', 'ታህሳስ'
    ];
    
    return `${months[messageDate.getMonth()]} ${messageDate.getDate()}`;
  } catch (error) {
    console.error('Error formatting Amharic message time:', error);
    return '';
  }
};

export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Duration formatter
export const formatDuration = (seconds) => {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// File size formatter
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
