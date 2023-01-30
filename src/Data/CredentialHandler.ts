export class CredentialHandler {

    public static get(credentialValue: CredentialValueType): string {
        //TODO: `localStorage` is not so secure, so may need to consider anothe method?
        return localStorage.getItem(credentialValue) ?? '';
    }

    public static set(credentialValue: CredentialValueType, value: string) {
        //TODO: `localStorage` is not so secure, so may need to consider anothe method?
        localStorage.setItem(credentialValue, value);
    }
}

export type CredentialValueType = 'token' | 'dbId';