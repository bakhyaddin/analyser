import { Test, TestingModule } from '@nestjs/testing';

// entities
import { Merchant } from '@modules/merchants/merchant.entity';
import { Pattern } from '@modules/patterns/pattern.entity';

// repositories
import { AnalysisRepository } from '@modules/analysis/analysis.repository';

// services
import { AnalysisService } from '@modules/analysis/analysis.service';
import { MerchantService } from '@modules/merchants/merchant.service';
import { PatternService } from '@modules/patterns/pattern.service';
import { FileService } from '@file/file.service';

// errors
import { AnalysisNotFound } from '@common/errors';

// types
import { Transaction } from '@common/types';

describe('AnalysisService', () => {
  const testUUID = 'af7c1fe6-d669-414e-b066-e9733f0de7a8';
  let service: AnalysisService;
  let repository: AnalysisRepository;
  let fileService: FileService;
  let merchantService: MerchantService;
  let patternService: PatternService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalysisService,
        {
          provide: AnalysisRepository,
          useValue: {
            save: jest.fn(),
            findOneById: jest.fn(),
          },
        },
        {
          provide: FileService,
          useValue: {
            create: jest.fn(),
            getCsvFileObject: jest.fn(),
          },
        },
        {
          provide: MerchantService,
          useValue: {
            normaliseAndCreate: jest.fn(),
          },
        },
        {
          provide: PatternService,
          useValue: {
            normaliseAndCreate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AnalysisService>(AnalysisService);
    repository = module.get<AnalysisRepository>(AnalysisRepository);
    fileService = module.get<FileService>(FileService);
    merchantService = module.get<MerchantService>(MerchantService);
    patternService = module.get<PatternService>(PatternService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an analysis', async () => {
      const objectId = '12345';
      const file = { id: 'fileId', objectId };
      fileService.create = jest.fn().mockResolvedValue(file);
      repository.save = jest.fn().mockResolvedValue({ file });

      const result = await service.create(objectId);
      expect(fileService.create).toHaveBeenCalledWith(objectId);
      expect(repository.save).toHaveBeenCalledWith({ file });
      expect(result).toEqual({ file });
    });
  });

  describe('getMerchantData', () => {
    it('should return existing merchants if available', async () => {
      const analysisId = testUUID;
      const merchants = [{ id: 'merchant1' }] as unknown as Merchant[];
      repository.findOneById = jest
        .fn()
        .mockResolvedValue({ merchants, file: {} });

      const result = await service.getMerchantData(analysisId);
      expect(result).toEqual(merchants);
    });

    it('should normalize and create merchant data if none exist', async () => {
      const analysisId = testUUID;
      const transactions = [{} as Transaction];
      fileService.getCsvFileObject = jest.fn().mockResolvedValue(transactions);
      merchantService.normaliseAndCreate = jest
        .fn()
        .mockResolvedValue([{ id: 'newMerchant' }] as unknown as Merchant[]);
      repository.findOneById = jest
        .fn()
        .mockResolvedValue({ merchants: [], file: { objectId: 'fileId' } });

      const result = await service.getMerchantData(analysisId);
      expect(fileService.getCsvFileObject).toHaveBeenCalledWith('fileId');
      expect(merchantService.normaliseAndCreate).toHaveBeenCalledWith(
        transactions,
        analysisId,
      );
      expect(result).toEqual([{ id: 'newMerchant' }]);
    });

    it('should throw AnalysisNotFound if analysis does not exist', async () => {
      repository.findOneById = jest.fn().mockResolvedValue(null);
      await expect(service.getMerchantData(testUUID)).rejects.toThrow(
        AnalysisNotFound,
      );
    });
  });

  describe('getPatternData', () => {
    it('should return existing patterns if available', async () => {
      const analysisId = testUUID;
      const patterns = [{ id: 'pattern1' }] as unknown as Pattern[];
      repository.findOneById = jest
        .fn()
        .mockResolvedValue({ patterns, file: {} });

      const result = await service.getPatternData(analysisId);
      expect(result).toEqual(patterns);
    });

    it('should normalize and create pattern data if none exist', async () => {
      const analysisId = testUUID;
      const transactions = [{} as Transaction];
      fileService.getCsvFileObject = jest.fn().mockResolvedValue(transactions);
      patternService.normaliseAndCreate = jest
        .fn()
        .mockResolvedValue([{ id: 'newPattern' }] as unknown as Pattern[]);
      repository.findOneById = jest
        .fn()
        .mockResolvedValue({ patterns: [], file: { objectId: 'fileId' } });

      const result = await service.getPatternData(analysisId);
      expect(fileService.getCsvFileObject).toHaveBeenCalledWith('fileId');
      expect(patternService.normaliseAndCreate).toHaveBeenCalledWith(
        transactions,
        analysisId,
      );
      expect(result).toEqual([{ id: 'newPattern' }]);
    });

    it('should throw AnalysisNotFound if analysis does not exist', async () => {
      repository.findOneById = jest.fn().mockResolvedValue(null);
      await expect(service.getPatternData(testUUID)).rejects.toThrow(
        AnalysisNotFound,
      );
    });
  });
});
