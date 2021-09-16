import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configServiceInstance } from './config/config.service';
import { ItemModule } from './item/item.module';
import { ConfigModule } from "./config/config.module";

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRoot(configServiceInstance.getTypeOrmConfig()),
    ItemModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
