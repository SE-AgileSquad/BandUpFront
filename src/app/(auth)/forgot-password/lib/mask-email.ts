export function maskEmail(email: string) {
    const [local, domain] = email.split("@");
    if (!local || !domain) return email;
    return `${local.charAt(0)}***@${domain}`;
}