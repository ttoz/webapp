import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // 静的ファイルの提供
    app.useStaticAssets(join(__dirname, '..', 'public'));

    // EJSテンプレートエンジンの設定
    app.setBaseViewsDir(join(__dirname, '..', 'views'));
    app.setViewEngine('ejs');

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
