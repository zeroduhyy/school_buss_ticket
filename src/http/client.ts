// src/http/httpClient.ts
import axios from "axios";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";

export const jar = new CookieJar();

export const http = wrapper(
  axios.create({
    jar,
    withCredentials: true,
    timeout: 10000,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0/5.0 ..."
    }
  })
);
