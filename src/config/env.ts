import { z } from "zod";
import "dotenv/config";

const EnvSchema = z.object({
  BUAA_USERNAME: z.string().min(1, "用户名不能为空"),
  BUAA_PASSWORD: z.string().min(1, "密码不能为空"),
});

export const env = EnvSchema.parse(process.env);
