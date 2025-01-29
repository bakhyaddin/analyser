import { of } from 'rxjs';
import { Test, TestingModule } from '@nestjs/testing';

import { Pattern } from '@modules/patterns/pattern.entity';
import { PatternService } from '@modules/patterns/pattern.service';
import { PatternRepository } from '@modules/patterns/pattern.repository';

// types
import { NORMALYSER_SERVICE_NAME, Transaction, ISODate } from '@common/types';

describe('PatternService', () => {
  const testUUID = 'af7c1fe6-d669-414e-b066-e9733f0de7a8';
  let service: PatternService;
  const repository = {
    save: jest.fn(),
  };
  const normalyserService = {
    normalizePattern: jest.fn(),
  };
  const client = {
    getService: jest.fn().mockReturnValue(normalyserService),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatternService,
        { provide: PatternRepository, useValue: repository },
        { provide: NORMALYSER_SERVICE_NAME, useValue: client },
      ],
    }).compile();

    service = module.get<PatternService>(PatternService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('normaliseAndCreate', () => {
    it('should normalize patterns and save them', async () => {
      const transactions: Transaction[] = [
        { amount: '100', description: 'Netflix', date: '2025-01-01' },
      ];
      const analysisId = testUUID;

      const normalisedPatterns = [
        new Pattern({
          type: 'Subscription',
          merchant: 'Netflix',
          amount: 15.99,
          frequency: 'monthly',
          nextExpected: '2025-02-01' as ISODate,
          confidence: 0.95,
          notes: 'Recurring payment',
        }),
      ];

      jest
        .spyOn(normalyserService, 'normalizePattern')
        .mockReturnValue(of({ normalisedPatterns }));
      jest.spyOn(repository, 'save').mockResolvedValue(normalisedPatterns);

      const result = await service.normaliseAndCreate(transactions, analysisId);

      expect(normalyserService.normalizePattern).toHaveBeenCalledWith({
        transactions,
      });
      expect(repository.save).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'Subscription',
            merchant: 'Netflix',
            amount: 15.99,
            frequency: 'monthly',
            nextExpected: '2025-02-01',
            confidence: 0.95,
            notes: 'Recurring payment',
            analysis: expect.objectContaining({ id: analysisId }),
          }),
        ]),
      );
      expect(result).toEqual(normalisedPatterns);
    });
  });
});
