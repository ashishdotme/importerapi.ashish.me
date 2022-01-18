import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { ConfigModule } from '@nestjs/config';
import { ShowsModule } from './shows/shows.module';

@Module({
  imports: [MoviesModule, ConfigModule.forRoot({
    isGlobal: true,
  }), ShowsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
