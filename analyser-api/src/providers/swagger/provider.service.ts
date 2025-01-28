import { INestApplication, Injectable } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { SwaggerConfigService } from 'src/configs/swagger';

@Injectable()
export class SwaggerService {
  constructor(private readonly configService: SwaggerConfigService) {}

  setup(app: INestApplication): void {
    const config = new DocumentBuilder()
      .setTitle(this.configService.title)
      .setDescription(this.configService.description)
      .setVersion(this.configService.version)
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(this.configService.path, app, document);
  }
}
