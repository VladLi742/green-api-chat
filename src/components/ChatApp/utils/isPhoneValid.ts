export default function isPhoneValid(phone: string) {
    if (!phone.trim()) return false;
    return /^79\d{9}$/.test(phone);
}