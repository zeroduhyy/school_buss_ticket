"""
Authentication module for BUAA SSO system.
Handles login and session management.
"""

import requests
from bs4 import BeautifulSoup
import logging
import re
import time
import json
import os

def load_config(path="config.json"):
    """Load user configuration from JSON file."""
    if not os.path.exists(path):
        raise FileNotFoundError("配置文件 config.json 不存在，请创建后重试。")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger('auth')
SSO_LOGIN_URL = "https://sso.buaa.edu.cn/login"
ZHXC_SERVICE_URL = "http://zhihuixiaoche.buaa.edu.cn/wechat/CASLogin"



def load_config(path="config.json"):
    """Load user configuration from JSON file."""
    if not os.path.exists(path):
        raise FileNotFoundError("配置文件 config.json 不存在，请创建后重试。")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)
    

class SSOAuth:
    def __init__(self, username=None, password=None):
        """Initialize the SSO authentication handler."""
        config = load_config("config.json")
        self.username = username or config.get("USERNAME")
        self.password = password or config.get("PASSWORD")
        self.session = requests.Session()
        self.session_id = None
        self.user_info = None

    def login(self):
        """
        Log in to the BUAA SSO system and return the session.
        Returns:
            bool: True if login successful, False otherwise
        """
        if not self.username or not self.password:
            logger.error("Username or password not provided")
            return False

        try:
            # Step 1: Get the login page to obtain the execution parameter
            logger.info("Fetching SSO login page...")
            response = self.session.get(
                SSO_LOGIN_URL,
                params={"service": ZHXC_SERVICE_URL},
                allow_redirects=True
            )

            # Parse the login page to get the execution parameter
            soup = BeautifulSoup(response.text, "html.parser")
            execution = soup.find('input', {'name': 'execution'}).get('value')

            if not execution:
                logger.error("Could not find execution parameter")
                return False

            logger.info(f"Got execution parameter: {execution[:20]}...")

            # Step 2: Submit login credentials
            logger.info("Submitting login credentials...")
            login_data = {
                "username": self.username,
                "password": self.password,
                "submit": "登录",
                "type": "username_password",
                "execution": execution,
                "_eventId": "submit"
            }

            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
                "Referer": SSO_LOGIN_URL,
                "Content-Type": "application/x-www-form-urlencoded"
            }

            # IMPORTANT: Don't follow redirects immediately
            response = self.session.post(
                SSO_LOGIN_URL,
                headers=headers,
                data=login_data,
                allow_redirects=False
            )

            logger.info(f"Initial login response status: {response.status_code}")

            # If 401 Unauthorized, treat it as the weak password page regardless of content
            if response.status_code == 401:
                logger.info("Got 401 Unauthorized - Processing as weak password page")

                # Extract the execution parameter from the response
                soup = BeautifulSoup(response.text, "html.parser")
                continue_form = soup.find('form', {'id': 'continueForm'})

                if continue_form:
                    execution_input = continue_form.find('input', {'name': 'execution'})

                    if execution_input:
                        execution_val = execution_input.get('value')
                        logger.info(f"Found execution value for continue form: {execution_val[:20]}...")

                        # Wait for 6 seconds for the countdown
                        logger.info("Waiting for 6 seconds for the 'Ignore Once' button to become active...")
                        time.sleep(6)

                        # Submit the "ignoreAndContinue" form
                        continue_data = {
                            "execution": execution_val,
                            "_eventId": "ignoreAndContinue"
                        }

                        logger.info("Submitting 'Ignore Once' request...")
                        response = self.session.post(
                            SSO_LOGIN_URL,
                            headers=headers,
                            data=continue_data,
                            allow_redirects=False
                        )

                        logger.info(f"'Ignore Once' response status: {response.status_code}")

                        # Follow the redirect chain from this point
                        if response.status_code in (301, 302, 303, 307, 308):
                            redirect_url = response.headers.get('Location')
                            logger.info(f"Redirecting to: {redirect_url}")

                            # Follow all redirects automatically now
                            response = self.session.get(redirect_url, allow_redirects=True)

                            logger.info(f"Final URL after 'Ignore Once': {response.url}")

                            if "zhihuixiaoche.buaa.edu.cn" in response.url:
                                logger.info("Successfully handled weak password and completed login")
                                
                                return True
                            else:
                                logger.error(f"Failed to redirect to zhihuixiaoche after 'Ignore Once'. URL: {response.url}")
                                return False
                    else:
                        logger.error("Could not find execution parameter in the continue form")
                        return False
                else:
                    logger.error("Could not find continue form on the page")
                    return False

            # If not 401, follow normal redirect flow
            elif response.status_code in (301, 302, 303, 307, 308):
                redirect_url = response.headers.get('Location')
                logger.info(f"Redirecting to: {redirect_url}")

                # Follow the redirect
                response = self.session.get(redirect_url, allow_redirects=True)

                # Check if we're successfully logged in
                logger.info(f"Final URL after redirects: {response.url}")

                if "zhihuixiaoche.buaa.edu.cn" in response.url:
                    logger.info("Login successful")
                    
                    return True

            # If we get here, login failed
            logger.error(f"Login failed. Final URL: {response.url}")
            return False

        except Exception as e:
            logger.error(f"Error during login: {str(e)}")
            return False
