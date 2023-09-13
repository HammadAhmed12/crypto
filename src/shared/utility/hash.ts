import * as bcrypt from 'bcrypt';

export class HashService{
    async hash(text: string): Promise<string>{
        const saltOrRounds = 10;
        const hash = await bcrypt.hash(text, saltOrRounds);
        return hash
    }

    async compareWithHash(text: string, hashedValue: string): Promise<boolean>{
        return bcrypt.compare(text, hashedValue);
    }
    
}