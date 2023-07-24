export const Trans = ({ i18nKey }: { i18nKey: string }) => i18nKey;

export const useTranslation = () => ({
  t: (key: string) => key,
});
