// src/auth/sso.service.ts
import { http, jar } from "@/http/client";
import { parseExecution } from "./sso.parser";
import { SSO_LOGIN_URL, ZHXC_SERVICE_URL } from "@/config/constants";

export class SSOService {
    async login(username: string, password: string): Promise<boolean> {
        // 每次登录前清空 cookie，避免旧会话导致无法获取 execution
        await jar.removeAllCookies();

        // 1. 获取登录页
        const loginPage = await http.get(SSO_LOGIN_URL, {
            params: { service: ZHXC_SERVICE_URL }
        });

        const execution = parseExecution(loginPage.data);

        // 2. 提交账号密码
        const resp = await http.post(
            SSO_LOGIN_URL,
            new URLSearchParams({
                username: username,
                password: password,
                execution,
                _eventId: "submit",
            }),
            {
                maxRedirects: 0,
                validateStatus: status => status >= 200 && status < 400
            }
        );

        // 3. 弱密码流程
        if (resp.status === 401) {
            const execution2 = parseExecution(resp.data);

            const ignoreResp = await http.post(
                SSO_LOGIN_URL,
                new URLSearchParams({
                    execution: execution2,
                    _eventId: "ignoreAndContinue",
                }),
                { maxRedirects: 0 }
            );

            return this.followRedirect(ignoreResp);
        }

        // 4. 正常重定向
        return this.followRedirect(resp);
    }

    private async followRedirect(resp: any): Promise<boolean> {
        const location = resp.headers.location;
        if (!location) return false;

        const final = await http.get(location);
        return final.request.res.responseUrl.includes("zhihuixiaoche");
    }
}
