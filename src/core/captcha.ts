import { logger } from '@/utils/logger';
import { CAPTCHA_URL } from '@/config/constants';
import { http } from '@/http/client'
import Tesseract from 'tesseract.js';
// 假设你以后可能换成 ddddocr 的 python 接口，或者打码平台，这里预留好位置
// 目前先用 tesseract 或者简单的 mock

export class CaptchaService {

  static async resolve(): Promise<string> {
    // 这里填入你具体的 OCR 逻辑 (Tesseract 或 调用 Python 服务)
    // 为了演示流程，先假设我们已经拿到了结果

    logger.debug('正在识别验证码...');

    try {
      const maxAttempts = 10;
      const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const res = await http.get(CAPTCHA_URL, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(res.data as ArrayBuffer);
        const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng');
        const cleaned = (text || '').replace(/\s+/g, '').trim();
        logger.debug(`OCR attempt ${attempt}:`, cleaned);

        if (/^[A-Za-z0-9]{4}$/.test(cleaned)) {
          logger.info('OCR result:', cleaned);
          return cleaned;
        }

        logger.warn(`OCR invalid result on attempt ${attempt}: "${cleaned}", retrying...`);
        await sleep(300);
      }

      logger.error(`OCR failed after ${maxAttempts} attempts`);
      return '';
    } catch (err) {
      logger.error('OCR 失败', err);
      return '';
    }
  }
}