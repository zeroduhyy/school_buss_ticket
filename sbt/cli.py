from utils.auth import SSOAuth
import requests
import re
import io
from PIL import Image
import ddddocr
import time
import contextlib


def main(shifts_date, shifts_number):
    """Main entry for buying a ticket. Kept same behaviour as original root app.py.

    Args:
        shifts_date (str): date string like 'YYYY-MM-DD'
        shifts_number (str): shift number string
    Returns:
        None
    """
    auth = SSOAuth()
    # 执行登录
    success = auth.login()

    # 输出登录结果
    if success:
        print("登录成功！")
        print("Session cookies:", auth.session.cookies.get_dict())
    else:
        print("登录失败！")

    user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0"
    session = auth.session
    ticket_page_url = f"https://zhihuixiaoche.buaa.edu.cn/wechat/ticketInfoPage?shifts_date={shifts_date}&shifts_number={shifts_number}"
    html  = session.get(ticket_page_url).text
    match = re.search(r"var csrf_token='([a-f0-9-]+)';", html)
    if match:
        csrf_token = match.group(1)
        print("CSRF_TOKEN:",csrf_token)
    else:
        raise ValueError("csrf_token no found")

    Captcha_url =  "https://zhihuixiaoche.buaa.edu.cn/wechat/getCaptchaImage"
    headers = {
        "User-Agent": user_agent,
    }
    response = session.get(Captcha_url,headers=headers)
    img_bytes = io.BytesIO(response.content)
    img = Image.open(img_bytes)
    # 静默执行 ddddocr，不打印欢迎信息
    with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
        ocr = ddddocr.DdddOcr()
        checkStr = ocr.classification(img)

    print("OCR result:", checkStr)

    pay_url = "https://zhihuixiaoche.buaa.edu.cn/wechat/buyTicketForWX"

    payload = {
    "checkStr": checkStr,
    "shifts_date": shifts_date,
    "shifts_number": shifts_number,
    }
    headers2 = {"User-Agent": user_agent, "X-Csrf-Token": csrf_token}

    response = session.post(pay_url,data=payload,headers=headers2)
    #time.sleep(1)

    print("Status code:", response.status_code)
    print("Response Content:", response.content.decode("utf-8", "ignore"))


if __name__ == '__main__':
    main()
