export class PreferencesHandler {
    public static getColorMode(): ColorMode {
        return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
}

export type ColorMode = 'light' | 'dark';
