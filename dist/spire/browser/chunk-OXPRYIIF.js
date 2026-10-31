// src/app/shared/phone-country.utils.ts
var DEFAULT_PHONE_COUNTRY_ISO = "GT";
var PHONE_COUNTRY_OPTIONS = [
  { isoCode: "AR", nameEs: "Argentina", nameEn: "Argentina", dialCode: "+54", minDigits: 10, maxDigits: 10 },
  { isoCode: "BO", nameEs: "Bolivia", nameEn: "Bolivia", dialCode: "+591", minDigits: 8, maxDigits: 8 },
  { isoCode: "BR", nameEs: "Brasil", nameEn: "Brazil", dialCode: "+55", minDigits: 10, maxDigits: 11 },
  { isoCode: "CL", nameEs: "Chile", nameEn: "Chile", dialCode: "+56", minDigits: 9, maxDigits: 9 },
  { isoCode: "CO", nameEs: "Colombia", nameEn: "Colombia", dialCode: "+57", minDigits: 10, maxDigits: 10 },
  { isoCode: "CR", nameEs: "Costa Rica", nameEn: "Costa Rica", dialCode: "+506", minDigits: 8, maxDigits: 8 },
  { isoCode: "CU", nameEs: "Cuba", nameEn: "Cuba", dialCode: "+53", minDigits: 8, maxDigits: 8 },
  { isoCode: "DO", nameEs: "Republica Dominicana", nameEn: "Dominican Republic", dialCode: "+1809", minDigits: 7, maxDigits: 7 },
  { isoCode: "EC", nameEs: "Ecuador", nameEn: "Ecuador", dialCode: "+593", minDigits: 9, maxDigits: 9 },
  { isoCode: "SV", nameEs: "El Salvador", nameEn: "El Salvador", dialCode: "+503", minDigits: 8, maxDigits: 8 },
  { isoCode: "GT", nameEs: "Guatemala", nameEn: "Guatemala", dialCode: "+502", minDigits: 8, maxDigits: 8 },
  { isoCode: "HN", nameEs: "Honduras", nameEn: "Honduras", dialCode: "+504", minDigits: 8, maxDigits: 8 },
  { isoCode: "MX", nameEs: "Mexico", nameEn: "Mexico", dialCode: "+52", minDigits: 10, maxDigits: 10 },
  { isoCode: "NI", nameEs: "Nicaragua", nameEn: "Nicaragua", dialCode: "+505", minDigits: 8, maxDigits: 8 },
  { isoCode: "PA", nameEs: "Panama", nameEn: "Panama", dialCode: "+507", minDigits: 8, maxDigits: 8 },
  { isoCode: "PY", nameEs: "Paraguay", nameEn: "Paraguay", dialCode: "+595", minDigits: 9, maxDigits: 9 },
  { isoCode: "PE", nameEs: "Peru", nameEn: "Peru", dialCode: "+51", minDigits: 9, maxDigits: 9 },
  { isoCode: "US", nameEs: "Estados Unidos", nameEn: "United States", dialCode: "+1", minDigits: 10, maxDigits: 10 },
  { isoCode: "UY", nameEs: "Uruguay", nameEn: "Uruguay", dialCode: "+598", minDigits: 8, maxDigits: 9 },
  { isoCode: "VE", nameEs: "Venezuela", nameEn: "Venezuela", dialCode: "+58", minDigits: 10, maxDigits: 10 }
];
var MAX_PHONE_LOCAL_DIGITS = PHONE_COUNTRY_OPTIONS.reduce((maxDigits, country) => Math.max(maxDigits, country.maxDigits), 0);
var PHONE_COUNTRY_MAP = new Map(PHONE_COUNTRY_OPTIONS.map((country) => [country.isoCode, country]));
var PHONE_COUNTRIES_SORTED_BY_CODE = [...PHONE_COUNTRY_OPTIONS].sort((left, right) => getDialCodeDigits(right).length - getDialCodeDigits(left).length);
function getDialCodeDigits(country) {
  return country.dialCode.replace(/\D/g, "");
}
function normalizePhoneDigits(value) {
  return String(value ?? "").replace(/\D/g, "");
}
function getPhoneCountryByIso(isoCode) {
  return isoCode ? PHONE_COUNTRY_MAP.get(isoCode) : void 0;
}
function getPhoneCountryDisplayName(country, language) {
  if (!country) {
    return "";
  }
  return language?.startsWith("en") ? country.nameEn : country.nameEs;
}
function getPhoneDigitsRangeLabel(country) {
  return country.minDigits === country.maxDigits ? `${country.maxDigits}` : `${country.minDigits}-${country.maxDigits}`;
}
function normalizeLocalPhoneNumber(value, country) {
  let digits = normalizePhoneDigits(value);
  if (country) {
    const dialCodeDigits = getDialCodeDigits(country);
    if (digits.startsWith(dialCodeDigits)) {
      const localDigits = digits.slice(dialCodeDigits.length);
      if (localDigits.length >= country.minDigits && localDigits.length <= country.maxDigits) {
        digits = localDigits;
      }
    }
    return digits.slice(0, country.maxDigits);
  }
  return digits.slice(0, MAX_PHONE_LOCAL_DIGITS);
}
function isPhoneLengthValid(localNumber, country) {
  const localDigits = normalizeLocalPhoneNumber(localNumber, country);
  if (!localDigits) {
    return true;
  }
  if (!country) {
    return localDigits.length <= MAX_PHONE_LOCAL_DIGITS;
  }
  return localDigits.length >= country.minDigits && localDigits.length <= country.maxDigits;
}
function buildFullPhoneNumber(countryIso, localNumber, fallbackCountryIso = DEFAULT_PHONE_COUNTRY_ISO) {
  const country = getPhoneCountryByIso(countryIso) ?? getPhoneCountryByIso(fallbackCountryIso);
  const localDigits = normalizeLocalPhoneNumber(localNumber, country);
  if (!localDigits) {
    return "";
  }
  return country ? `${country.dialCode}${localDigits}` : localDigits;
}
function splitPhoneNumberByCountry(phoneNumber, fallbackCountryIso = DEFAULT_PHONE_COUNTRY_ISO) {
  const digits = normalizePhoneDigits(phoneNumber);
  if (!digits) {
    return {
      countryIso: fallbackCountryIso,
      localNumber: ""
    };
  }
  const matchedCountry = PHONE_COUNTRIES_SORTED_BY_CODE.find((country) => {
    const dialCodeDigits = getDialCodeDigits(country);
    if (!digits.startsWith(dialCodeDigits)) {
      return false;
    }
    const localDigitsLength = digits.slice(dialCodeDigits.length).length;
    return localDigitsLength >= country.minDigits && localDigitsLength <= country.maxDigits;
  });
  if (matchedCountry) {
    const dialCodeDigits = getDialCodeDigits(matchedCountry);
    return {
      countryIso: matchedCountry.isoCode,
      localNumber: digits.slice(dialCodeDigits.length)
    };
  }
  return {
    countryIso: fallbackCountryIso,
    localNumber: normalizeLocalPhoneNumber(digits, getPhoneCountryByIso(fallbackCountryIso))
  };
}

export {
  DEFAULT_PHONE_COUNTRY_ISO,
  PHONE_COUNTRY_OPTIONS,
  MAX_PHONE_LOCAL_DIGITS,
  normalizePhoneDigits,
  getPhoneCountryByIso,
  getPhoneCountryDisplayName,
  getPhoneDigitsRangeLabel,
  normalizeLocalPhoneNumber,
  isPhoneLengthValid,
  buildFullPhoneNumber,
  splitPhoneNumberByCountry
};
//# sourceMappingURL=chunk-OXPRYIIF.js.map
