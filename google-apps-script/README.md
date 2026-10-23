# Google Apps Script — MY Waterproofing Contact Form Backend

This directory contains the Google Apps Script project that processes contact form submissions from the MY Waterproofing website.

---

## What It Does

1. **Receives** form POST submissions from the website.
2. **Validates** all fields server-side (name, phone, email, service, location).
3. **Saves** each enquiry to a Google Sheet.
4. **Sends** a notification email to the business.
5. **Sends** an acknowledgement email to the customer.
6. **Rate-limits** submissions to reduce duplicate enquiries.
7. **Returns** a JSON response indicating success or failure.

---

## Setup Instructions

### Step 1 — Create the Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet.
2. Name it: **MY Waterproofing Enquiries**
3. Copy the **Spreadsheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_IS_HERE/edit
   ```

### Step 2 — Open Apps Script

1. In the Google Spreadsheet, go to **Extensions > Apps Script**.
2. Delete any existing code in `Code.gs`.
3. Paste the entire contents of `Code.gs` from this directory.

### Step 3 — Configure Variables

At the top of `Code.gs`, set:

```javascript
const SPREADSHEET_ID = 'paste-your-spreadsheet-id-here';
const BUSINESS_EMAIL = 'paste-business-email@example.com';
```

> **Important:** Do not commit real credentials to version control.

### Step 4 — Save the Project

Press **Ctrl+S** (or **Cmd+S** on Mac) to save.

### Step 5 — Initialise the Sheet

1. In the Apps Script editor, select `initSheet` from the function dropdown.
2. Click **Run**.
3. When prompted, **Authorise** the script to access your Google Sheets and Gmail.
4. Confirm that the Enquiries sheet has been created with column headers.

### Step 6 — Deploy as a Web App

1. Click **Deploy > New Deployment**.
2. Click the gear icon next to "Type" and select **Web app**.
3. Set:
   - **Description**: MY Waterproofing Contact Form
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click **Deploy**.
5. Copy the **Web App URL** — it looks like:
   ```
   https://script.google.com/macros/s/SCRIPT_ID/exec
   ```

### Step 7 — Configure the Frontend

1. In the React project root, create a file called `.env`:
   ```
   VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```
2. Restart the development server (`npm run dev`) after adding the `.env` file.
3. For production builds, set this environment variable in your build pipeline or CI/CD process.

> **Security note:** The Apps Script URL is not a secret — it is publicly accessible by design. It is safe to include in the frontend. Do not confuse it with the Spreadsheet ID or your Google account credentials.

---

## Testing the Deployed Script

### Test 1 — GET request (confirm endpoint is live)

Open the Web App URL directly in a browser. You should see:
```json
{"result":"ok","message":"MY Waterproofing enquiry endpoint is active."}
```

### Test 2 — POST request (simulate a form submission)

Using curl:
```bash
curl -L -X POST "YOUR_WEB_APP_URL" \
  -F "name=Test User" \
  -F "phone=9876543210" \
  -F "email=test@example.com" \
  -F "service=Pressure Injection Grouting" \
  -F "location=Baner, Pune" \
  -F "description=Test submission from curl"
```

Expected response:
```json
{"result":"success","message":"Enquiry received successfully."}
```

After a successful test:
- Check that a new row has appeared in the Google Sheet.
- Check that the business notification email was received.
- Check that the customer acknowledgement email was received at `test@example.com`.

---

## CORS Behaviour

Google Apps Script Web Apps redirect POST requests and set `Content-Security-Policy` headers that can interfere with cross-origin `fetch` calls from browsers.

**How this project handles it:**

- The React frontend sends a `fetch` POST with `FormData` (not JSON).
- The Apps Script responds with `ContentService.MimeType.JSON` — no redirect is triggered for non-browser agents.
- In browsers, the redirect may result in an opaque response depending on the browser and Apps Script configuration.
- If the fetch fails, the frontend shows a clear error state with retry and direct-contact options.

**If you encounter persistent CORS issues:**

Options (in order of preference):

1. **Use `no-cors` fetch mode** and trigger a "pending" confirmation state — inform the user their enquiry may have been received and to check their email.
2. **Add a lightweight reverse proxy** (e.g., Cloudflare Worker) that forwards the POST to Apps Script and returns the JSON response directly. This eliminates the redirect.
3. **Use a different backend** such as a serverless function (AWS Lambda, Netlify Functions) to relay the submission to Google Sheets via the Sheets API.

> Do not use `mode: 'no-cors'` and then display a success message — the opaque response cannot be read and provides no confirmation that the submission succeeded.

---

## Re-deploying After Changes

When you update `Code.gs`:

1. Click **Deploy > New Deployment** (not "Manage Deployments").
2. Choose **Web app** again with the same settings.
3. Copy the new Web App URL and update `VITE_APPS_SCRIPT_URL` in `.env`.

> Each deployment creates a new URL. Old deployment URLs continue to work until explicitly removed.

---

## Google Sheet Columns

| Column | Description |
|---|---|
| Timestamp | Date and time of submission |
| Customer Name | Full name submitted |
| Phone | Phone number submitted |
| Email | Email address submitted |
| Service | Selected service |
| Property Location | Location entered |
| Description | Problem description (optional) |
| Submission Status | Initially "Received" |
| IP Note | Reserved for future use |

---

## Known Limitations

- **Rate limiting** is based on phone number and time, checked against the Google Sheet. It is not cryptographically secure and can be bypassed by someone who changes their phone number.
- **No server-side deduplication** beyond the rate limit check. Identical submissions with different phone numbers will both be recorded.
- **Apps Script execution quota** applies. Refer to Google's documentation for daily MailApp and script execution limits under the free Google Workspace tier.
- **Email delivery** is not guaranteed. Gmail may occasionally rate-limit email sending. Monitor the Apps Script execution log for errors.
