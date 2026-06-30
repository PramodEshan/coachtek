/** Build a WhatsApp deep link (wa.me) with optional pre-filled message. */
export function whatsappDeepLink(phone: string, message?: string): string {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return 'https://wa.me/';
  const base = `https://wa.me/${digits}`;
  if (!message?.trim()) return base;
  return `${base}?text=${encodeURIComponent(message.trim())}`;
}

export function whatsappContactLabel(name: string): string {
  return `Hi ${name.split(' ')[0]}, `;
}
