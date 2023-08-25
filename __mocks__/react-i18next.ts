export const Trans = ({ i18nKey }: { i18nKey: string }) => i18nKey;

export const useTranslation = () => ({
  t: (k: string) => k,
  i18n: {
    resolvedLanguage: 'en',
  },
});
