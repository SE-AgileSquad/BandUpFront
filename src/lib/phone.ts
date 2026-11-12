import {
    parsePhoneNumberFromString,
    type CountryCode,
} from "libphonenumber-js";

export const DEFAULT_COUNTRY: CountryCode = "IR";

export function parsePhone(input: string) {
    const value = input.trim();
    if (!value) return null;
    const parsed = parsePhoneNumberFromString(value, DEFAULT_COUNTRY);
    return parsed?.isValid() ? parsed : null;
}

export function normalizePhone(input: string) {
    return parsePhone(input)?.number ?? null;
}

export function maskPhone(e164: string) {
    const parsed = parsePhoneNumberFromString(e164);
    if (!parsed) return e164.replace(/\d(?=\d{4})/g, "*");
    const national = parsed.nationalNumber;
    return `+${parsed.countryCallingCode} ${national.slice(0, 3)} *** ${national.slice(-4)}`;
}