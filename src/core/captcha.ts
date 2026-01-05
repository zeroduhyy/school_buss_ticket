import { logger } from '@/utils/logger';
import { CAPTCHA_URL } from '@/config/constants';
import { http } from '@/http/client'
import * as ort from 'onnxruntime-node';
import { Jimp } from 'jimp';
import { promises as fs } from 'fs';
import path from 'path';

const IMG_W = 128;
const IMG_H = 32;
const MODEL_PATH = path.resolve(__dirname, '../model/captcha.onnx');
const CHARSET_PATH = path.resolve(__dirname, '../model/charset.txt');

export class CaptchaService {
  private static session: ort.InferenceSession | null = null;
  private static charset: string[] = [];

  static async resolve(): Promise<string> {
    logger.debug('正在识别验证码...');

    try {
      await this.ensureModel();
      const maxAttempts = 10;
      const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const res = await http.get(CAPTCHA_URL, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(res.data as ArrayBuffer);

        const prediction = await this.runModel(imageBuffer);
        //logger.debug(`OCR attempt ${attempt}:`, prediction);

        if (/^[A-Za-z0-9]{4}$/.test(prediction)) {
          //logger.info('OCR result:', prediction);
          return prediction;
        }

        logger.warn(`OCR invalid result on attempt ${attempt}: "${prediction}", retrying...`);
        await sleep(300);
      }

      logger.error(`OCR failed after ${maxAttempts} attempts`);
      return '';
    } catch (err) {
      logger.error('OCR 失败', err);
      return '';
    }
  }

  private static async ensureModel(): Promise<void> {
    if (!this.session) {
      this.charset = (await fs.readFile(CHARSET_PATH, 'utf8')).trim().split('');
      this.session = await ort.InferenceSession.create(MODEL_PATH);
    }
  }

  private static async runModel(imageBuffer: Buffer): Promise<string> {
    if (!this.session) {
      throw new Error('ONNX session not initialized');
    }

    const img = await Jimp.read(imageBuffer);
    img.resize({ w: IMG_W, h: IMG_H }).greyscale();
    const data = new Float32Array(IMG_W * IMG_H);

    img.scan(0, 0, img.bitmap.width, img.bitmap.height, (x, y, idx) => {
      const gray = img.bitmap.data[idx] / 255;
      data[y * IMG_W + x] = gray;
    });

    const tensor = new ort.Tensor('float32', data, [1, 1, IMG_H, IMG_W]);
    const output = await this.session.run({ image: tensor });
    const logits = output.logits.data as Float32Array;
    return this.greedyDecode(logits);
  }

  private static greedyDecode(logits: Float32Array): string {
    const C = this.charset.length;
    let pred = '';

    for (let i = 0; i < 4; i++) {
      let best = 0;
      let max = Number.NEGATIVE_INFINITY;
      for (let c = 0; c < C; c++) {
        const score = logits[i * C + c];
        if (score > max) {
          max = score;
          best = c;
        }
      }
      pred += this.charset[best] ?? '';
    }

    return pred;
  }
}