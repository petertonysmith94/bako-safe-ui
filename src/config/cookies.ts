import * as CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';

const { VITE_COOKIE_EXPIRATION_TIME, VITE_ENCRYPTION_KEY } = import.meta.env;

export enum CookieName {
  ACCESS_TOKEN = `bakosafe/token`,
  ACCOUNT_TYPE = `bakosafe/account_type`,
  ADDRESS = `bakosafe/address`,
  AVATAR = `bakosafe/avatar`,
  USER_ID = `bakosafe/user_id`,
  SINGLE_WORKSPACE = `bakosafe/single_workspace`,
  SINGLE_CONTACTS = `bakosafe/single_contacts`,
  WORKSPACE = `bakosafe/workspace`,
  PERMISSIONS = `bakosafe/permissions`,
  WEB_AUTHN_ID = `bakosafe/web_authn_id`,
  WEB_AUTHN_PK = `bakosafe/web_authn_pk`,
}

interface Cookie {
  name: CookieName;
  value: string;
}

export class CookiesConfig {
  private static encryptionKey = VITE_ENCRYPTION_KEY;

  static setCookies(cookies: Cookie[]) {
    console.log('[SET_COOKIES]: ', cookies);
    const expiresAt =
      new Date().getTime() +
      Number(VITE_COOKIE_EXPIRATION_TIME ?? 15) * 60 * 1000;

    cookies.forEach((cookie) => {
      Cookies.set(cookie.name, this.encrypt(cookie.value), {
        expires: new Date(expiresAt),
      });
    });
  }

  static getCookie(name: string) {
    const ck = Cookies.get(name);
    return ck ? this.decrypt(ck) : '';
  }

  static removeCookies(names: string[]) {
    names.forEach((name) => Cookies.remove(name));
  }

  private static encrypt(value: string): string {
    const encrypted = CryptoJS.AES.encrypt(
      value,
      this.encryptionKey,
    ).toString();

    return encrypted;
  }

  private static decrypt(encryptedValue: string): string {
    try {
      const decrypted = CryptoJS.AES.decrypt(
        encryptedValue,
        this.encryptionKey,
      ).toString(CryptoJS.enc.Utf8);

      return decrypted;
    } catch (e) {
      return `${crypto.randomUUID()}`;
    }
  }
}
