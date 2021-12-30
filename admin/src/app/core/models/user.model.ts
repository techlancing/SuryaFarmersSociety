export class User {
    constructor(
      public sUserEmail : string,
      public sUserName : string,
      public _token : string,
      private _expirytokentime: number,
      public sRole : string
    ) {}

    get token() {
      if (!this._expirytokentime || new Date().getMilliseconds() > this._expirytokentime) {
        return null;
      }
      return this._token;
    }

    get expirytoken() {
        if (!this._expirytokentime || new Date().getMilliseconds() > this._expirytokentime) {
          return null;
        }
        return this._expirytokentime;
      }
  }
