export const formatCurrency = (amount: number, currency = 'LKR'): string => {
  if (currency === 'LKR') {
    return amount.toLocaleString('en-LK', { style: 'currency', currency: 'LKR' });
  }
  return `${currency} ${amount.toLocaleString()}`;
};

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString();
};

export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString();
};

export const getImageUri = (imagePath: string, baseUrl: string): string => {
  if (!imagePath) return '';
  // Validate URL to prevent SSRF
  if (imagePath.startsWith('http')) {
    try {
      const url = new URL(imagePath);
      // Only allow specific domains for security
      const allowedDomains = ['res.cloudinary.com', 'images.unsplash.com'];
      if (allowedDomains.some(domain => imagePath.includes(domain))) {
        return imagePath;
      }
    } catch {
      return '';
    }
  }
  return `${baseUrl}${imagePath}`;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[0-9]{8,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay) as unknown as number;
  };
};