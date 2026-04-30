export const validatePhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateYear = (year) => {
  const num = parseInt(year);
  return !isNaN(num) && num >= 1900 && num <= new Date().getFullYear();
};


