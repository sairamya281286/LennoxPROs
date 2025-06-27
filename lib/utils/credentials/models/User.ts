export class User {
    email: string
    password: string
    constructor(obj?: object) {
        if (obj) {
            this.email = obj['email']
            this.password = obj['password']
        }
    }

    setEmail(email: string) {
        this.email = email
        return this
    } 

    setPassword(password: string) {
        this.password = password
        return this
    }
}