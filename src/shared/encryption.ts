import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { pad } from 'lodash';
require('dotenv').config();
const defaultAlgorithm = 'aes-256-cbc';

@Injectable()
export class EncryptionService {

  public encrypt(data: string, algorithm: string = defaultAlgorithm): string {
    const iv = randomBytes(16); // Generate a random IV (Initialization Vector)
    const cipher = createCipheriv(algorithm, process.env.ENCRYPTION_SECRET, iv);
    let encrypted = cipher.update(pad(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  public decrypt(encryptedData: string, algorithm?: string): string {
    const [iv, encrypted] = encryptedData.split(':');
    const decipher = createDecipheriv(
      algorithm ? algorithm : defaultAlgorithm,
      process.env.ENCRYPTION_SECRET,
      Buffer.from(iv, 'hex'),
    );
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  public generateRandomHex() {
    const random32Bytes = randomBytes(32);
    return random32Bytes.toString('hex');
  }
}
