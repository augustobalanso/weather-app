interface Translations {
    [key: string]: string;
  }
  
export interface LanguageObject {
    language: string;
    code: string;
    translations: Translations;
}