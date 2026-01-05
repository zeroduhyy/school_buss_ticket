import { SSOService } from "@/core/sso.service";
import { logger } from "@/utils/logger";
import { jar, http } from '@/http/client';
import { CaptchaService } from "./captcha";
import { TICKET_URL, PAY_URL } from "@/config/constants";

interface PayResponse {
    message?: string;
    status?: string;
    [key: string]: unknown;
}


export class ticket {
    static async buy(shifts_date: string, shifts_number: number):
        Promise<void> {
        const auth = new SSOService()
        if (await auth.login()) {
            //logger.info("sso登录成功")

        } else {
            logger.warn("登录失败")
        }
        const ticket_url = `${TICKET_URL}shifts_date=${encodeURIComponent(shifts_date)}&shifts_number=${encodeURIComponent(String(shifts_number))}`

        const resp1 = await http.get<string>(ticket_url)
        const html = resp1.data
        let csrf_token: string | undefined
        const match = html.match(/var csrf_token='([a-f0-9-]+)';/)
        if (match && match[1]) {
            csrf_token = match[1]
            //logger.info("CSRF_TOKEN:", csrf_token)

        } else {
            throw new Error("csrf_token not found")
        }
        const maxCaptchaRetries = 5;
        for (let attempt = 1; attempt <= maxCaptchaRetries; attempt++) {
            const checkStr = await CaptchaService.resolve()

            const resp2 = await http.post<PayResponse>(PAY_URL,
                new URLSearchParams({
                    "checkStr": checkStr,
                    "shifts_date": shifts_date,
                    "shifts_number": String(shifts_number),
                }), {
                headers: {
                    'X-Csrf-Token': csrf_token
                }
            })

            const message = resp2.data?.message ?? ''
            logger.info("购票结果:", message || '无返回消息')
            logger.info("付款链接:", resp2.data?.url ?? '')
       

            if (message == '下单成功') {
                logger.info("购票成功,请及时付款(限时15分钟)\n")
                return
            }

            logger.warn(`第${attempt}次购票验证码错误，准备重试...`)
            await new Promise(resolve => setTimeout(resolve, 300))
        }

        throw new Error(`连续${maxCaptchaRetries}次验证码错误，放弃重试`)

    }




}