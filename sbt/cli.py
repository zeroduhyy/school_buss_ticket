from utils.auth import SSOAuth
import requests
import re
import io
from PIL import Image
import time
import contextlib
import threading


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
    html  = session.get(ticket_page_url, timeout=10).text
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
    response = session.get(Captcha_url, headers=headers, timeout=10)
    img_bytes = io.BytesIO(response.content)
    img = Image.open(img_bytes)
    
    # 使用线程处理 OCR 识别，支持超时（Windows 兼容）
    print("正在加载 OCR 模块（首次加载可能需要较长时间）...")
    
    checkStr = None
    ocr_error = None
    
    def load_ocr():
        nonlocal checkStr, ocr_error
        try:
            with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
                import ddddocr
                ocr = ddddocr.DdddOcr()
                checkStr = ocr.classification(img)
        except Exception as e:
            ocr_error = str(e)
    
    # 在线程中加载 OCR，设置 30 秒超时（Windows 兼容的方式）
    ocr_thread = threading.Thread(target=load_ocr, daemon=True)
    ocr_thread.start()
    ocr_thread.join(timeout=30)
    
    if ocr_thread.is_alive():
        print("错误: OCR 模块加载超时（超过 30 秒）")
        print("建议: 检查网络连接或尝试重新运行")
        return
    elif ocr_error:
        print(f"错误: OCR 识别失败 - {ocr_error}")
        return
    elif checkStr is None:
        print("错误: OCR 识别结果为空")
        return

    print("OCR result:", checkStr)

    pay_url = "https://zhihuixiaoche.buaa.edu.cn/wechat/buyTicketForWX"

    payload = {
    "checkStr": checkStr,
    "shifts_date": shifts_date,
    "shifts_number": shifts_number,
    }
    headers2 = {"User-Agent": user_agent, "X-Csrf-Token": csrf_token}

    response = session.post(pay_url, data=payload, headers=headers2, timeout=10)
    #time.sleep(1)

    print("Status code:", response.status_code)
    print("Response Content:", response.content.decode("utf-8", "ignore"))


if __name__ == '__main__':
    main()
