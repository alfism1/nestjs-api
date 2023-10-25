import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { CoreModule } from './core/core.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    CoreModule,
    // add jwt module
    JwtModule.register({
      global: true,
      secret: 'super_secret_key',
      signOptions: { expiresIn: '12h' },

      // secret: process.env.JWT_SECRET,
      // signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
