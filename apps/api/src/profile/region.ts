const REGION_BY_LOCALE: Record<string, { locale: string; currency: string }> = {
  'en-us': { locale: 'en-US', currency: 'USD' },
  'en-gb': { locale: 'en-GB', currency: 'GBP' },
  'en-ca': { locale: 'en-CA', currency: 'CAD' },
  'en-au': { locale: 'en-AU', currency: 'AUD' },
  'en-nz': { locale: 'en-NZ', currency: 'NZD' },
  'fr-fr': { locale: 'fr-FR', currency: 'EUR' },
  'fr-ca': { locale: 'fr-CA', currency: 'CAD' },
  'de-de': { locale: 'de-DE', currency: 'EUR' },
  'de-at': { locale: 'de-AT', currency: 'EUR' },
  'es-es': { locale: 'es-ES', currency: 'EUR' },
  'es-mx': { locale: 'es-MX', currency: 'MXN' },
  'it-it': { locale: 'it-IT', currency: 'EUR' },
  'nl-nl': { locale: 'nl-NL', currency: 'EUR' },
  'pt-br': { locale: 'pt-BR', currency: 'BRL' },
  'pt-pt': { locale: 'pt-PT', currency: 'EUR' },
  'ja-jp': { locale: 'ja-JP', currency: 'JPY' },
  'ko-kr': { locale: 'ko-KR', currency: 'KRW' },
  'zh-cn': { locale: 'zh-CN', currency: 'CNY' },
  'zh-tw': { locale: 'zh-TW', currency: 'TWD' },
  'sv-se': { locale: 'sv-SE', currency: 'SEK' },
  'nb-no': { locale: 'nb-NO', currency: 'NOK' },
  'da-dk': { locale: 'da-DK', currency: 'DKK' },
  'pl-pl': { locale: 'pl-PL', currency: 'PLN' },
};

const REGION_BY_LANGUAGE: Record<string, { locale: string; currency: string }> = {
  en: { locale: 'en-US', currency: 'USD' },
  fr: { locale: 'fr-FR', currency: 'EUR' },
  de: { locale: 'de-DE', currency: 'EUR' },
  es: { locale: 'es-ES', currency: 'EUR' },
  it: { locale: 'it-IT', currency: 'EUR' },
  nl: { locale: 'nl-NL', currency: 'EUR' },
  pt: { locale: 'pt-PT', currency: 'EUR' },
  ja: { locale: 'ja-JP', currency: 'JPY' },
  ko: { locale: 'ko-KR', currency: 'KRW' },
  zh: { locale: 'zh-CN', currency: 'CNY' },
  sv: { locale: 'sv-SE', currency: 'SEK' },
  nb: { locale: 'nb-NO', currency: 'NOK' },
  da: { locale: 'da-DK', currency: 'DKK' },
  pl: { locale: 'pl-PL', currency: 'PLN' },
};

const DEFAULT_REGION = { locale: 'en-US', currency: 'USD' };

export function suggestRegion(acceptLanguage: string | undefined) {
  const tags = (acceptLanguage ?? '')
    .split(',')
    .map((part) => part.split(';')[0]?.trim().replaceAll('_', '-'))
    .filter((part): part is string => Boolean(part));

  for (const tag of tags) {
    const normalized = tag.toLowerCase();
    const exact = REGION_BY_LOCALE[normalized];
    if (exact) {
      return exact;
    }
    const language = normalized.split('-')[0] ?? '';
    const fallback = REGION_BY_LANGUAGE[language];
    if (fallback) {
      return { locale: tag, currency: fallback.currency };
    }
  }

  return DEFAULT_REGION;
}

export function canonicalLocale(value: string) {
  try {
    return new Intl.Locale(value.replaceAll('_', '-')).baseName;
  } catch {
    return null;
  }
}

export function canonicalCurrency(value: string) {
  const currency = value.trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(currency)) {
    return null;
  }
  try {
    new Intl.NumberFormat('en', { style: 'currency', currency }).format(0);
    return currency;
  } catch {
    return null;
  }
}
