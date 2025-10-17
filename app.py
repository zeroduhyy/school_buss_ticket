"""Lightweight wrapper that calls the refactored sbt.cli.main entrypoint.

This keeps the original entrypoint `app.py` while moving implementation into
the `sbt` package for a cleaner project layout.
"""

from sbt import main


if __name__ == '__main__':
    input_date = input("请输入班次日期(格式:YYYY-MM-DD):")
    input_number = input("请输入班次编号:")
    main(shifts_date=input_date, shifts_number=input_number)

