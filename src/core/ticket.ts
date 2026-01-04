import { SSOService } from "@/core/sso.service";
import { logger } from "@/utils/logger";
import { jar, http } from '@/http/client';
import { CaptchaService } from "./captcha";
import { TICKET_URL, PAY_URL } from "@/config/constants";


export class ticket {
    static async buy(shifts_date: string, shifts_number: number):
        Promise<void> {
        const auth = new SSOService()
        if (await auth.login()) {
            logger.info("sso登录成功")

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
            logger.info("CSRF_TOKEN:", csrf_token)

        } else {
            throw new Error("csrf_token not found")
        }
        const checkStr = await CaptchaService.resolve()

        const resp2 = await http.post(PAY_URL,
            new URLSearchParams({
                "checkStr": checkStr,
                "shifts_date": shifts_date,
                "shifts_number": String(shifts_number),
            }), {
            headers: {
                'X-Csrf-Token': csrf_token
            }
        })
        logger.info("购票成功,请及时付款\n");
        logger.info("Status code:", resp2.status);
        logger.debug("Response data:", resp2.data);

    }




}