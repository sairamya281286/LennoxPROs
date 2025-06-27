import { Environments } from './Environments'

export class Configurations {
    static getEnvironment(): Environments {
        const environmentVar = process.env.ENV 
        if (!environmentVar) {
            return Environments.AUTO
        }
        
        const environment = Environments[environmentVar] 
        if (environment in Environments) {
            return environment
        } else {
            throw new Error(`The ${environmentVar} environment doesn't exists`)
        }
    }
}

