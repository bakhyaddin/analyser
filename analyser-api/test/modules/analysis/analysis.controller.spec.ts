import { Test, TestingModule } from '@nestjs/testing';

// cotnroller
import { AnalysisController } from '@modules/analysis/analysis.controller';

// entities
import { Analysis } from '@modules/analysis/analysis.entity';
import { Merchant } from '@modules/merchants/merchant.entity';

// service
import { AnalysisService } from '@modules/analysis/analysis.service';

// dtos
import { CreateAnalysisDto } from '@modules/analysis/dto/create-analysis.dto';
import { CreateAnalysisResultDto } from '@modules/analysis/dto/create-analysis-result.dto';
import { DeleteAnalysisDto } from '@modules/analysis/dto/delete-analysis.dto';
import { Pattern } from '@modules/patterns/pattern.entity';

describe('AnalysisController', () => {
  const testUUID = 'af7c1fe6-d669-414e-b066-e9733f0de7a8';
  let controller: AnalysisController;
  let service: AnalysisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalysisController],
      providers: [
        {
          provide: AnalysisService,
          useValue: {
            list: jest.fn(),
            create: jest.fn(),
            getMerchantData: jest.fn(),
            getPatternData: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AnalysisController>(AnalysisController);
    service = module.get<AnalysisService>(AnalysisService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('listAnalyses', () => {
    it('should return a list of analyses', async () => {
      const analysesData = [new Analysis({ id: testUUID })];
      jest.spyOn(service, 'list').mockResolvedValue(analysesData);
      const result = await controller.listAnalyses();
      expect(result).toEqual(analysesData);
    });
  });

  describe('createAnalyse', () => {
    it('should create a new analysis', async () => {
      const dto: CreateAnalysisDto = { objectId: '12345' };
      const analysesData = new Analysis({
        id: testUUID,
      });
      jest.spyOn(service, 'create').mockResolvedValue(analysesData);
      const result = await controller.createAnalyse(dto);
      expect(result).toEqual(analysesData);
    });
  });

  describe('analyseMerchant', () => {
    it('should return merchant data', async () => {
      const dto: CreateAnalysisResultDto = {
        analysisId: testUUID,
      };
      const getMerchandData = [new Merchant({ id: testUUID })];
      jest.spyOn(service, 'getMerchantData').mockResolvedValue(getMerchandData);
      const result = await controller.analyseMerchant(dto);
      expect(result).toEqual(getMerchandData);
    });
  });

  describe('analysePatterns', () => {
    it('should return pattern data', async () => {
      const dto: CreateAnalysisResultDto = {
        analysisId: testUUID,
      };
      const getPatternsData = [new Pattern({ id: testUUID })];
      jest.spyOn(service, 'getPatternData').mockResolvedValue(getPatternsData);
      const result = await controller.analysePatterns(dto);
      expect(result).toEqual(getPatternsData);
    });
  });

  describe('deleteAnalysis', () => {
    it('should call service delete method', async () => {
      const dto: DeleteAnalysisDto = {
        id: testUUID,
      };
      jest.spyOn(service, 'delete').mockResolvedValue(0);
      const result = await controller.deleteAnalysis(dto);
      expect(result).toBe(0);
    });
  });
});
