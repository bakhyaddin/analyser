import { of } from 'rxjs';
import { Test, TestingModule } from '@nestjs/testing';

import { Merchant } from '@modules/merchants/merchant.entity';
import { MerchantService } from '@modules/merchants/merchant.service';
import { MerchantRepository } from '@modules/merchants/merchant.repository';

// types
import { NORMALYSER_SERVICE_NAME, Transaction } from '@common/types';

describe('MerchantService', () => {
  const testUUID = 'af7c1fe6-d669-414e-b066-e9733f0de7a8';
  let service: MerchantService;
  const repository = {
    save: jest.fn(),
  };
  const normalyserService = {
    normalizeMerchant: jest.fn(),
  };
  const client = {
    getService: jest.fn().mockReturnValue(normalyserService),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MerchantService,
        { provide: MerchantRepository, useValue: repository },
        { provide: NORMALYSER_SERVICE_NAME, useValue: client },
      ],
    }).compile();

    service = module.get<MerchantService>(MerchantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('normaliseAndCreate', () => {
    it('should normalize merchants and save them', async () => {
      const transactions: Transaction[] = [
        { amount: '100', description: 'AMZN', date: '2025-01-01' },
      ];
      const analysisId = testUUID;

      const normalisedMerchants = [
        new Merchant({
          name: 'Amazon',
          originalName: 'AMZN',
          category: 'Retail',
          subCategory: 'Online Shopping',
          isSubscription: false,
          flags: ['verified'],
          confidence: 0.95,
        }),
      ];

      jest
        .spyOn(normalyserService, 'normalizeMerchant')
        .mockReturnValue(of({ normalisedMerchants }));
      jest.spyOn(repository, 'save').mockResolvedValue(normalisedMerchants);

      const result = await service.normaliseAndCreate(transactions, analysisId);

      expect(normalyserService.normalizeMerchant).toHaveBeenCalledWith({
        transactions,
      });
      expect(repository.save).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'Amazon',
            originalName: 'AMZN',
            category: 'Retail',
            subCategory: 'Online Shopping',
            isSubscription: false,
            flags: ['verified'],
            confidence: 0.95,
            analysis: expect.objectContaining({ id: analysisId }),
          }),
        ]),
      );
      expect(result).toEqual(normalisedMerchants);
    });
  });
});
