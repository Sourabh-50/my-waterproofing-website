/**
 * MY WATERPROOFING — Google Apps Script Backend
 * ============================================
 * Handles contact form submissions from mywaterproofing.in
 *
 * Setup Instructions:
 * 1. Create a new Google Spreadsheet.
 * 2. Copy the Spreadsheet ID from the URL (the long string between /d/ and /edit).
 * 3. Open Apps Script: Extensions > Apps Script.
 * 4. Paste this entire file into the Code.gs editor, replacing any existing content.
 * 5. Set SPREADSHEET_ID and BUSINESS_EMAIL below.
 * 6. Click "Save project" (Ctrl/Cmd + S).
 * 7. Run initSheet() once manually (select it from the function dropdown and click Run).
 * 8. Deploy: Deploy > New Deployment > Web App.
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 9. Copy the Web App URL and paste it into your .env file as VITE_APPS_SCRIPT_URL.
 * 10. Re-deploy after any code changes (New Deployment, not "Manage Deployments").
 *
 * IMPORTANT CORS NOTE:
 * Google Apps Script Web Apps redirect POST requests and may return opaque responses
 * to cross-origin fetch calls from browsers. The React frontend handles this by:
 * - Sending a standard fetch POST with FormData.
 * - Attempting to read the JSON response.
 * - Treating an HTTP 200 with result:"success" as confirmed success.
 * - Showing an honest error state if the response cannot be read.
 *
 * You MUST test the deployed URL after deployment using the instructions in README.md.
 */

// ==========================================
// CONFIGURATION — set these before deploying
// ==========================================

/** Your Google Spreadsheet ID (from the URL) */
const SPREADSHEET_ID = 'PASTE_YOUR_SPREADSHEET_ID_HERE';

/** The email address that should receive new enquiry notifications */
const BUSINESS_EMAIL = 'PASTE_BUSINESS_EMAIL_HERE';

/** The name displayed in outgoing emails */
const BUSINESS_NAME = 'MY Waterproofing';

/** Optional: A secondary email for BCC on business notifications */
const BCC_EMAIL = '';

/** Rate limit: reject if same phone number submits within this many milliseconds */
const RATE_LIMIT_MS = 5 * 60 * 1000; // 5 minutes

// ==========================================
// Sheet column headers
// ==========================================
const HEADERS = [
  'Timestamp',
  'Customer Name',
  'Phone',
  'Email',
  'Service',
  'Property Location',
  'Description',
  'Submission Status',
  'IP Note',
];

// ==========================================
// Initialize the Sheet (run once manually)
// ==========================================
function initSheet() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName('Enquiries');
    if (!sheet) {
      sheet = ss.insertSheet('Enquiries');
    }
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      SpreadsheetApp.flush();
      Logger.log('Sheet initialised successfully.');
    } else {
      Logger.log('Sheet already initialised.');
    }
  } catch (e) {
    Logger.log('Error initialising sheet: ' + e.message);
    throw e;
  }
}

// ==========================================
// Main POST handler
// ==========================================
function doPost(e) {
  try {
    // Parse form data
    const params = e.parameter || {};

    // Extract and sanitise fields
    const name = sanitise(params.name || '');
    const phone = sanitise(params.phone || '');
    const email = sanitise(params.email || '');
    const service = sanitise(params.service || '');
    const location = sanitise(params.location || '');
    const description = sanitise(params.description || '');

    // ---- Server-side validation ----
    const validationResult = validateFields({ name, phone, email, service, location });
    if (!validationResult.valid) {
      return jsonResponse({ result: 'error', message: validationResult.message });
    }

    // ---- Basic rate limiting via sheet lookup ----
    if (isRateLimited(phone)) {
      return jsonResponse({
        result: 'error',
        message: 'A submission from this number was received recently. Please wait a few minutes before trying again.',
      });
    }

    // ---- Save to Google Sheet ----
    const timestamp = new Date();
    const timestampFormatted = Utilities.formatDate(
      timestamp,
      Session.getScriptTimeZone(),
      'yyyy-MM-dd HH:mm:ss'
    );

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Enquiries');
    if (!sheet) {
      Logger.log('Sheet "Enquiries" not found. Run initSheet() first.');
      return jsonResponse({ result: 'error', message: 'Sheet not found. Please contact the administrator.' });
    }

    sheet.appendRow([
      timestampFormatted,
      name,
      phone,
      email,
      service,
      location,
      description,
      'Received',
      'N/A',
    ]);
    SpreadsheetApp.flush();

    // ---- Send business notification email ----
    if (BUSINESS_EMAIL && BUSINESS_EMAIL !== 'PASTE_BUSINESS_EMAIL_HERE') {
      sendBusinessNotification({ name, phone, email, service, location, description, timestamp: timestampFormatted });
    } else {
      Logger.log('Business email not configured. Skipping notification.');
    }

    // ---- Send customer acknowledgement email ----
    if (email) {
      sendCustomerAcknowledgement({ name, email, service, location });
    }

    return jsonResponse({ result: 'success', message: 'Enquiry received successfully.' });

  } catch (err) {
    Logger.log('Error in doPost: ' + err.message + '\n' + err.stack);
    return jsonResponse({ result: 'error', message: 'An error occurred. Please try again or contact us directly.' });
  }
}

// ==========================================
// GET handler (for testing deployed URL)
// ==========================================
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ result: 'ok', message: 'MY Waterproofing enquiry endpoint is active.' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ==========================================
// Validation
// ==========================================
function validateFields({ name, phone, email, service, location }) {
  if (!name || name.length < 2) {
    return { valid: false, message: 'Name is required (minimum 2 characters).' };
  }
  const phoneDigits = phone.replace(/\D/g, '');
  if (!/^[6-9]\d{9}$/.test(phoneDigits)) {
    return { valid: false, message: 'A valid 10-digit Indian mobile number is required.' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'A valid email address is required.' };
  }
  if (!service) {
    return { valid: false, message: 'Service selection is required.' };
  }
  if (!location || location.length < 3) {
    return { valid: false, message: 'Property location is required.' };
  }
  return { valid: true };
}

// ==========================================
// Rate limiting (phone number based)
// ==========================================
function isRateLimited(phone) {
  try {
    const phoneDigits = phone.replace(/\D/g, '');
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Enquiries');
    if (!sheet || sheet.getLastRow() < 2) return false;

    const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 3).getValues();
    const now = new Date().getTime();

    for (let i = data.length - 1; i >= 0; i--) {
      const rowPhone = String(data[i][2]).replace(/\D/g, '');
      if (rowPhone === phoneDigits) {
        const rowTime = new Date(data[i][0]).getTime();
        if (now - rowTime < RATE_LIMIT_MS) {
          return true;
        }
        break; // Only check most recent match
      }
    }
    return false;
  } catch (e) {
    Logger.log('Rate limit check error: ' + e.message);
    return false; // Fail open — do not block on error
  }
}

// ==========================================
// Business notification email
// ==========================================
function sendBusinessNotification({ name, phone, email, service, location, description, timestamp }) {
  const subject = 'New Website Enquiry — MY Waterproofing';
  const body = `
New enquiry received through mywaterproofing.in

─────────────────────────────────────────
ENQUIRY DETAILS
─────────────────────────────────────────
Customer Name:      ${name}
Phone Number:       ${phone}
Email Address:      ${email}
Service Required:   ${service}
Property Location:  ${location}
Submitted At:       ${timestamp}

Problem Description:
${description || '(Not provided)'}
─────────────────────────────────────────

This enquiry was submitted through the website contact form.
Please contact the customer at your earliest convenience.

─────────────────────────────────────────
MY Waterproofing — Leakage Solution Specialist
Pune, Maharashtra, India
Phone: +91 9822278989
Website: https://mywaterproofing.in
─────────────────────────────────────────
`.trim();

  const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="font-family:'Segoe UI',Arial,sans-serif;color:#102A43;max-width:600px;margin:0 auto;padding:24px;">
  <div style="background:#071B2C;padding:20px 24px;border-radius:8px 8px 0 0;">
    <h2 style="margin:0;color:#ffffff;font-size:18px;">
      <span style="color:#E5232E;">MY</span> Waterproofing — New Enquiry
    </h2>
  </div>
  <div style="background:#ffffff;border:1px solid #E2EAF0;border-top:none;border-radius:0 0 8px 8px;padding:24px;">
    <p style="color:#617184;font-size:14px;margin-bottom:24px;">
      A new enquiry was submitted through <a href="https://mywaterproofing.in" style="color:#078DCB;">mywaterproofing.in</a>
    </p>
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:10px 0;border-bottom:1px solid #E2EAF0;width:40%;font-size:13px;color:#617184;font-weight:600;">Customer Name</td><td style="padding:10px 0;border-bottom:1px solid #E2EAF0;font-size:14px;font-weight:700;">${escapeHtml(name)}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #E2EAF0;font-size:13px;color:#617184;font-weight:600;">Phone Number</td><td style="padding:10px 0;border-bottom:1px solid #E2EAF0;font-size:14px;font-weight:700;"><a href="tel:${escapeHtml(phone.replace(/\D/g,'').replace(/^/,'+91'))}" style="color:#078DCB;">${escapeHtml(phone)}</a></td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #E2EAF0;font-size:13px;color:#617184;font-weight:600;">Email Address</td><td style="padding:10px 0;border-bottom:1px solid #E2EAF0;font-size:14px;">${escapeHtml(email)}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #E2EAF0;font-size:13px;color:#617184;font-weight:600;">Service Required</td><td style="padding:10px 0;border-bottom:1px solid #E2EAF0;font-size:14px;"><strong>${escapeHtml(service)}</strong></td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #E2EAF0;font-size:13px;color:#617184;font-weight:600;">Property Location</td><td style="padding:10px 0;border-bottom:1px solid #E2EAF0;font-size:14px;">${escapeHtml(location)}</td></tr>
      <tr><td style="padding:10px 0;font-size:13px;color:#617184;font-weight:600;">Submitted At</td><td style="padding:10px 0;font-size:13px;">${escapeHtml(timestamp)}</td></tr>
    </table>
    ${description ? `<div style="margin-top:20px;padding:16px;background:#F5F8FA;border-radius:8px;border-left:3px solid #078DCB;"><p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#617184;">Problem Description</p><p style="margin:0;font-size:14px;line-height:1.6;">${escapeHtml(description)}</p></div>` : ''}
    <div style="margin-top:24px;padding:16px;background:#E5232E;border-radius:8px;text-align:center;">
      <p style="margin:0;color:white;font-weight:700;font-size:14px;">Please contact the customer at your earliest convenience.</p>
    </div>
  </div>
  <p style="font-size:11px;color:#aaa;text-align:center;margin-top:16px;">MY Waterproofing · Pune, Maharashtra · +91 9822278989</p>
</body>
</html>
  `.trim();

  const mailOptions = {
    htmlBody: htmlBody,
    name: 'MY Waterproofing Website',
  };

  if (BCC_EMAIL) {
    mailOptions.bcc = BCC_EMAIL;
  }

  MailApp.sendEmail(BUSINESS_EMAIL, subject, body, mailOptions);
}

// ==========================================
// Customer acknowledgement email
// ==========================================
function sendCustomerAcknowledgement({ name, email, service, location }) {
  const subject = "We've Received Your Waterproofing Enquiry | MY Waterproofing";
  const body = `
Hello ${name},

Thank you for contacting MY Waterproofing.

We've received your enquiry regarding ${service} at ${location}.

Our team will review the details and contact you using the phone number you provided.

For assistance, you can reach us at +91 9822278989 or message us on WhatsApp.

Thank you for considering MY Waterproofing.

Regards,
MY Waterproofing
Leakage Solution Specialist
Pune, Maharashtra
+91 9822278989
https://mywaterproofing.in
`.trim();

  const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="font-family:'Segoe UI',Arial,sans-serif;color:#102A43;max-width:600px;margin:0 auto;padding:24px;">
  <div style="background:#071B2C;padding:20px 24px;border-radius:8px 8px 0 0;">
    <h2 style="margin:0;color:#ffffff;font-size:18px;">
      <span style="color:#E5232E;">MY</span> Waterproofing
    </h2>
    <p style="margin:4px 0 0;color:rgba(255,255,255,0.6);font-size:13px;">Leakage Solution Specialist</p>
  </div>
  <div style="background:#ffffff;border:1px solid #E2EAF0;border-top:3px solid #078DCB;border-radius:0 0 8px 8px;padding:32px 24px;">
    <p style="font-size:16px;font-weight:700;margin:0 0 16px;">Hello ${escapeHtml(name)},</p>
    <p style="font-size:14px;color:#617184;line-height:1.7;margin-bottom:16px;">
      Thank you for contacting MY Waterproofing. We've received your enquiry and our team will review the details shortly.
    </p>
    <div style="background:#F5F8FA;border-radius:8px;padding:16px;margin-bottom:24px;">
      <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#617184;text-transform:uppercase;letter-spacing:0.08em;">Your Enquiry Summary</p>
      <p style="margin:0 0 4px;font-size:14px;"><strong>Service:</strong> ${escapeHtml(service)}</p>
      <p style="margin:0;font-size:14px;"><strong>Property Location:</strong> ${escapeHtml(location)}</p>
    </div>
    <p style="font-size:14px;color:#617184;line-height:1.7;margin-bottom:24px;">
      Our team will contact you using the phone number you provided. If you need to reach us directly:
    </p>
    <div style="display:flex;gap:12px;flex-wrap:wrap;">
      <a href="tel:+919822278989" style="display:inline-block;background:#102A43;color:white;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">📞 +91 9822278989</a>
      <a href="https://wa.me/919822278989" style="display:inline-block;background:#25D366;color:white;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">💬 WhatsApp</a>
    </div>
  </div>
  <p style="font-size:11px;color:#aaa;text-align:center;margin-top:16px;">
    MY Waterproofing · Pune, Maharashtra · <a href="https://mywaterproofing.in" style="color:#078DCB;">mywaterproofing.in</a>
  </p>
</body>
</html>
  `.trim();

  MailApp.sendEmail(email, subject, body, {
    htmlBody: htmlBody,
    name: 'MY Waterproofing',
    replyTo: BUSINESS_EMAIL !== 'PASTE_BUSINESS_EMAIL_HERE' ? BUSINESS_EMAIL : undefined,
  });
}

// ==========================================
// Utilities
// ==========================================
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function sanitise(str) {
  if (typeof str !== 'string') return '';
  return str.trim().substring(0, 1000);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
