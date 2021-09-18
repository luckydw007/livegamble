export class User {
    constructor(
        public email: string,
        private _token: string,
        private _registered: boolean
    ){}

    get token () {
        if(!this._registered){
            return null;
        }
        return this._token;
    }
}