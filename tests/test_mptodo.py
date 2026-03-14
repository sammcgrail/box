"""
Playwright tests for mptodo.

Run locally:
    python3 tests/test_mptodo.py

Run against production:
    BASE_URL=https://sebland.com python3 tests/test_mptodo.py
"""

import os
import re
import sys
import time
from playwright.sync_api import sync_playwright, expect

BASE_URL = os.environ.get("BASE_URL", "http://localhost:8767")
MPTODO = f"{BASE_URL}/mptodo"


def log(msg: str):
    print(f"  {msg}", flush=True)


def wait_ready(page):
    page.wait_for_load_state("domcontentloaded")
    page.wait_for_selector("input[placeholder='Add a todo...']", timeout=8000)


def test_add_todo(page):
    page.goto(MPTODO)
    wait_ready(page)

    unique = f"pw-{int(time.time())}"
    page.get_by_placeholder("Add a todo...").fill(unique)
    page.get_by_role("button", name="Add").click()

    expect(page.locator("li").filter(has_text=unique)).to_be_visible(timeout=5000)
    log(f"add: '{unique}' appears ✓")
    return unique


def test_toggle_todo(page, text: str):
    item = page.locator("li").filter(has_text=text)
    checkbox = item.locator("button").first

    checkbox.click()
    # to_have_class checks individual class tokens, not the full string
    span = item.locator("span").first
    expect(span).to_have_class(re.compile(r"line-through"), timeout=5000)
    log(f"toggle: marked done ✓")

    checkbox.click()
    expect(span).not_to_have_class(re.compile(r"line-through"), timeout=5000)
    log(f"toggle: unmarked ✓")


def test_delete_todo(page, text: str):
    item = page.locator("li").filter(has_text=text)
    item.hover()
    item.get_by_label("Delete").click()
    expect(page.locator("li").filter(has_text=text)).to_have_count(0, timeout=5000)
    log(f"delete: removed ✓")


def test_sse_sync(browser):
    """Two tabs: add in tab1, should appear in tab2 via SSE."""
    ctx = browser.new_context()
    page1 = ctx.new_page()
    page2 = ctx.new_page()

    page1.goto(MPTODO)
    page2.goto(MPTODO)
    wait_ready(page1)
    wait_ready(page2)
    # Give SSE connections a moment to establish
    time.sleep(1)

    unique = f"sse-{int(time.time())}"
    page1.get_by_placeholder("Add a todo...").fill(unique)
    page1.get_by_role("button", name="Add").click()

    expect(page2.locator("li").filter(has_text=unique)).to_be_visible(timeout=8000)
    log(f"sse: '{unique}' appeared in tab2 without refresh ✓")

    # Cleanup
    page1.locator("li").filter(has_text=unique).hover()
    page1.locator("li").filter(has_text=unique).get_by_label("Delete").click()
    ctx.close()


def test_enter_key(page):
    page.goto(MPTODO)
    wait_ready(page)

    unique = f"enter-{int(time.time())}"
    page.get_by_placeholder("Add a todo...").fill(unique)
    page.keyboard.press("Enter")

    expect(page.locator("li").filter(has_text=unique)).to_be_visible(timeout=5000)
    log(f"enter key: added ✓")

    page.locator("li").filter(has_text=unique).hover()
    page.locator("li").filter(has_text=unique).get_by_label("Delete").click()


def test_mobile_single_tap(browser):
    """Mobile viewport — toggle fires on first tap."""
    ctx = browser.new_context(
        viewport={"width": 390, "height": 844},
        has_touch=True,
        user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
    )
    page = ctx.new_page()
    page.goto(MPTODO)
    wait_ready(page)

    unique = f"mob-{int(time.time())}"
    page.get_by_placeholder("Add a todo...").fill(unique)
    page.get_by_role("button", name="Add").tap()

    item = page.locator("li").filter(has_text=unique)
    expect(item).to_be_visible(timeout=5000)

    item.locator("button").first.tap()
    expect(item.locator("span").first).to_have_class(re.compile(r"line-through"), timeout=5000)
    log("mobile single-tap: toggled in one tap ✓")

    item.get_by_label("Delete").tap()
    ctx.close()


def run_suite(target: str):
    print(f"\n{'='*50}")
    print(f"mptodo — {target}")
    print(f"{'='*50}")
    passed = failed = 0

    with sync_playwright() as p:
        browser = p.chromium.launch()

        suites = [
            ("add + toggle + delete", lambda: _desktop(browser)),
            ("enter key", lambda: _enter(browser)),
            ("SSE real-time sync", lambda: test_sse_sync(browser)),
            ("mobile single-tap", lambda: test_mobile_single_tap(browser)),
        ]

        for name, fn in suites:
            print(f"\n[{name}]")
            try:
                fn()
                passed += 1
                print(f"  PASS")
            except Exception as e:
                print(f"  FAIL: {e}")
                failed += 1

        browser.close()

    print(f"\n{'='*50}")
    print(f"{passed} passed  {failed} failed")
    print(f"{'='*50}\n")
    return failed == 0


def _desktop(browser):
    page = browser.new_page()
    text = test_add_todo(page)
    test_toggle_todo(page, text)
    test_delete_todo(page, text)
    page.close()


def _enter(browser):
    page = browser.new_page()
    test_enter_key(page)
    page.close()


if __name__ == "__main__":
    ok = run_suite(BASE_URL)
    sys.exit(0 if ok else 1)
