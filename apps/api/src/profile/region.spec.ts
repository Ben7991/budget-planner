import { suggestRegion } from './region.js';

describe('suggestRegion', () => {
  it('defaults when the header is missing', () => {
    expect(suggestRegion(undefined)).toEqual({
      locale: 'en-US',
      currency: 'USD',
    });
  });

  it('uses the first listed locale', () => {
    expect(suggestRegion('fr-FR,en;q=0.8')).toEqual({
      locale: 'fr-FR',
      currency: 'EUR',
    });
  });

  it('maps a regional English locale to its currency', () => {
    expect(suggestRegion('en-GB')).toEqual({
      locale: 'en-GB',
      currency: 'GBP',
    });
  });

  it('falls back when the tag is unknown', () => {
    expect(suggestRegion('zz-ZZ')).toEqual({
      locale: 'en-US',
      currency: 'USD',
    });
  });
});
