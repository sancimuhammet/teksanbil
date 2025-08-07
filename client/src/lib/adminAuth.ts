// Admin authentication logic - bu listeye sadece yönetici emaillerini ekleyin
const ADMIN_EMAILS = [
  'muhammetsanci10@gmail.com',
  'teksanbil@gmail.com'
];

export const isAdminEmail = (email: string): boolean => {
  return ADMIN_EMAILS.includes(email.toLowerCase());
};

export const checkAdminAccess = (user: any): boolean => {
  if (!user || !user.email) return false;
  return isAdminEmail(user.email);
};

// Admin paneli için özel hata mesajları
export const getAdminError = (user: any): string => {
  if (!user) {
    return "Yönetici paneline erişim için giriş yapmalısınız.";
  }
  if (!isAdminEmail(user.email)) {
    return "Bu hesap yönetici yetkisine sahip değil.";
  }
  return "";
};
