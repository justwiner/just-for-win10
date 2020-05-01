class LoginService {
    public bgUrl: string[];

    constructor() {
        this.bgUrl = [
            '1.jpg',
            '2.jpg',
            '4.jpg',
            '5.jpg',
            '7.jpg',
            '9.jpg',
        ];
    }

    public getRandomBgUrl(): string {
        return require('../assets/' + this.bgUrl[Math.floor(Math.random() * this.bgUrl.length)]);
    }
}

export default LoginService;
