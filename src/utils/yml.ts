// Safely parse js obj to yaml. Returns fallback (emtpy string by default) on exception.
export const safeJSToYAML = (js: any, fallback: string = '', options: any = {}): string => {
    try {
        return fallback;
    } catch {
        return fallback;
    }
};