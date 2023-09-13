import { Module } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { EncryptionService } from '../shared/encryption';

@Module({
  providers: [CurrencyService,EncryptionService],
})
export class CurrencyModule {}
