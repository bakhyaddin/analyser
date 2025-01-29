import { Body, Controller, Post, Get, Delete, Param } from '@nestjs/common';

import { AnalysisService } from './analysis.service';

// dto
import { CreateAnalysisDto } from './dto/create-analysis.dto';
import { CreateAnalysisResultDto } from './dto/create-analysis-result.dto';
import { DeleteAnalysisDto } from './dto/delete-analysis.dto';

@Controller('analyse')
export class AnalysisController {
  constructor(private readonly service: AnalysisService) {}

  @Get('')
  listAnalyses() {
    return this.service.list();
  }

  @Post('')
  createAnalyse(@Body() dto: CreateAnalysisDto) {
    return this.service.create(dto.objectId);
  }

  @Post('merchant')
  analyseMerchant(@Body() { analysisId }: CreateAnalysisResultDto) {
    return this.service.getMerchantData(analysisId);
  }

  @Post('patterns')
  analysePatterns(@Body() { analysisId }: CreateAnalysisResultDto) {
    return this.service.getPatternData(analysisId);
  }

  @Delete(':id')
  deleteAnalysis(@Param() { id }: DeleteAnalysisDto) {
    return this.service.delete(id);
  }
}
