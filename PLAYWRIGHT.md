# Playwright Testing

How to run and write browser tests for apps on sebland.com.

## Setup (already done on the server)

```bash
python3 -m pip install playwright --break-system-packages
python3 -m playwright install chromium --with-deps
```

Playwright is installed system-wide on `open-neo`. No virtualenv needed.

## Running tests

```bash
# Against local container (fast, no network dependency)
cd /root/box
python3 tests/test_mptodo.py

# Against production
BASE_URL=https://sebland.com python3 tests/test_mptodo.py
```

## Test files

| File | App | What it covers |
|------|-----|----------------|
| `tests/test_mptodo.py` | `/mptodo` | add, toggle, delete, enter key, SSE sync, mobile tap |

## Writing tests for a new app

Put test files in `/root/box/tests/`. Use this pattern:

```python
import os, re, sys, time
from playwright.sync_api import sync_playwright, expect

BASE_URL = os.environ.get("BASE_URL", "http://localhost:PORT")
APP_URL  = f"{BASE_URL}/myapp"

def wait_ready(page):
    page.wait_for_load_state("domcontentloaded")
    page.wait_for_selector("#some-element", timeout=8000)

def test_something(page):
    page.goto(APP_URL)
    wait_ready(page)
    # ... assertions
```

## Key gotchas

### Never use `wait_for_load_state("networkidle")`
SSE/WebSocket connections keep the page from ever reaching `networkidle`.
Always use `"domcontentloaded"` then wait for a specific element instead.

### `to_have_class` takes a compiled regex for partial matches
```python
# WRONG — regex string doesn't work as expected
expect(el).to_have_class(r".*line-through.*")

# CORRECT — compile the regex
import re
expect(el).to_have_class(re.compile(r"line-through"))
```

### SSE tests need a short sleep after page load
The EventSource connection needs ~1s to establish before mutations will
be pushed to the second page:
```python
page1.goto(URL); page2.goto(URL)
wait_ready(page1); wait_ready(page2)
time.sleep(1)  # let SSE connect
page1.do_something()
expect(page2.locator("...")).to_be_visible(timeout=8000)
```

### Mobile tap simulation
```python
ctx = browser.new_context(
    viewport={"width": 390, "height": 844},
    has_touch=True,
    user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 ...)",
)
page = ctx.new_page()
page.locator("button").tap()  # use .tap() not .click() for touch
```

### Hover-to-reveal buttons (delete button)
On desktop the delete button is hidden until hover. Always call
`.hover()` on the list item before clicking delete:
```python
item = page.locator("li").filter(has_text="...")
item.hover()
item.get_by_label("Delete").click()
```
On mobile the delete button is always visible, so `.hover()` is a no-op
but doesn't hurt.
