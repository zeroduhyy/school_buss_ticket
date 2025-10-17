# School Bus Ticketing System (SBT)

This project automates the process of booking tickets for the BUAA school bus system. It includes login via the BUAA SSO system, captcha recognition, and ticket purchasing.

## Features
- **SSO Login**: Automatically logs in using BUAA credentials.
- **Captcha Recognition**: Uses OCR to solve captchas during the ticket booking process.
- **Ticket Booking**: Automates the process of selecting shifts and purchasing tickets.

## Project Structure
- `app.py`: Entry point for the application. Calls the main logic in `sbt.cli`.
- `sbt/cli.py`: Contains the main logic for the ticket booking process.
- `utils/auth.py`: Handles SSO login and session management.
- `config.json`: Stores user-specific credentials (username and password).
- `urls.py`: Centralized file for managing endpoint URLs.

## Installation
1. Clone the repository:
   ```powershell
   git clone https://github.com/zeroduhyy/school_buss_ticket.git
   cd school_buss_ticket/SBT_v1.0
   ```
2. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```

## Usage
1. Update `config.json` with your BUAA SSO credentials:
   ```json
   {
       "USERNAME": "your_username",
       "PASSWORD": "your_password"
   }
   ```
2. Run the application:
   ```powershell
   python .\app.py
   ```

## Dependencies
- `requests`: For HTTP requests.
- `Pillow`: For image processing.
- `ddddocr`: For captcha recognition.
- `beautifulsoup4`: For HTML parsing.

## Notes
- Ensure your credentials are correct in `config.json`.
- The application is designed for educational purposes and personal use only.

## License
This project is licensed under the MIT License.
