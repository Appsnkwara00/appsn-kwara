/**
 * Convert raw Nigerian/international phone numbers into clean international format for WhatsApp click-to-chat.
 * Format: https://wa.me/PHONE_NUMBER
 *
 * Example:
 *   08012345678 -> 2348012345678
 *   +234 803 123 4567 -> 2348031234567
 *   2348031234567 -> 2348031234567
 */
export function getWhatsAppNumber(rawPhone?: string | null): string | null {
  if (!rawPhone) return null;
  // Remove all non-digit characters
  let digits = rawPhone.replace(/\D/g, '');
  if (!digits) return null;

  // If already starts with 234 and reasonable length
  if (digits.startsWith('234')) {
    if (digits.length >= 13) {
      return digits;
    }
  }

  // Standard Nigerian 11-digit mobile: 080... or 070... or 090... or 081...
  if (digits.startsWith('0') && digits.length === 11) {
    return '234' + digits.slice(1);
  }

  // 10-digit without leading 0: 80...
  if (digits.length === 10 && !digits.startsWith('234')) {
    return '234' + digits;
  }

  // Fallback if already international length
  if (digits.length >= 11) {
    return digits;
  }

  return null;
}

export function buildWhatsAppLink(rawPhone?: string | null, surveyorName?: string): string | null {
  const number = getWhatsAppNumber(rawPhone);
  if (!number) return null;

  const defaultMsg = surveyorName 
    ? `Hello ${surveyorName}, I found your profile on the APPSN Kwara State Surveyors Directory. I would like to consult with you regarding a surveying service.`
    : `Hello, I found your profile on the APPSN Kwara State Surveyors Directory. I would like to inquire about surveying services.`;

  return `https://wa.me/${number}?text=${encodeURIComponent(defaultMsg)}`;
}
