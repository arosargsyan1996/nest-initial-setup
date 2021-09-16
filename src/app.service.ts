import { Injectable } from '@nestjs/common';
import { configServiceInstance, ConfigService } from "./config/config.service";

@Injectable()
export class AppService {
  private readonly config: ConfigService;

  constructor(config: ConfigService) {
    this.config = config;
    config.ensureValues(['API_URL'])
  }

  getHello(): string {
    console.log(this.config);
    return 'Hello World!';
  }
}
