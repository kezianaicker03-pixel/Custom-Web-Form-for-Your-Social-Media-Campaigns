import { CampaignSubmission } from '../types';

export const DEFAULT_WEB_APP_URL = 'https://script.google.com/macros/s/YOUR_EXEC_ID/exec';

export function generateStandaloneHTML(webAppUrl: string = DEFAULT_WEB_APP_URL): string {
  const targetUrl = webAppUrl.trim() || DEFAULT_WEB_APP_URL;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Social Media Campaign Intake</title>
  <style>
    :root {
      --primary: #4f46e5;
      --primary-hover: #4338ca;
      --bg-gradient: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
      --card-bg: #ffffff;
      --text-main: #0f172a;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --radius: 12px;
      --shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    body {
      background: var(--bg-gradient);
      color: var(--text-main);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px 16px;
    }

    .container {
      width: 100%;
      max-width: 560px;
      background: var(--card-bg);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      border: 1px solid var(--border);
      padding: 32px 28px;
    }

    .header {
      margin-bottom: 24px;
      text-align: center;
    }

    .header-badge {
      display: inline-block;
      padding: 4px 12px;
      background: #e0e7ff;
      color: #3730a3;
      font-size: 12px;
      font-weight: 600;
      border-radius: 9999px;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .header h1 {
      font-size: 24px;
      font-weight: 700;
      color: var(--text-main);
      letter-spacing: -0.5px;
    }

    .header p {
      font-size: 14px;
      color: var(--text-muted);
      margin-top: 6px;
      line-height: 1.5;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: #334155;
      margin-bottom: 6px;
    }

    .form-group label span {
      color: #ef4444;
    }

    .form-control {
      width: 100%;
      padding: 12px 14px;
      font-size: 14px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background-color: #f8fafc;
      color: var(--text-main);
      transition: all 0.2s ease;
      outline: none;
    }

    .form-control:focus {
      background-color: #ffffff;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
    }

    textarea.form-control {
      resize: vertical;
      min-height: 100px;
    }

    select.form-control {
      appearance: none;
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2064748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right 12px center;
      background-size: 16px;
      padding-right: 36px;
    }

    .btn-submit {
      width: 100%;
      padding: 14px;
      font-size: 15px;
      font-weight: 600;
      color: #ffffff;
      background: var(--primary);
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .btn-submit:hover {
      background: var(--primary-hover);
    }

    .btn-submit:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .spinner {
      display: none;
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .alert {
      display: none;
      padding: 14px 16px;
      border-radius: 8px;
      font-size: 14px;
      margin-bottom: 20px;
      line-height: 1.4;
    }

    .alert-success {
      background-color: #f0fdf4;
      border: 1px solid #bbf7d0;
      color: #166534;
    }

    .alert-error {
      background-color: #fef2f2;
      border: 1px solid #fecaca;
      color: #991b1b;
    }

    .alert h4 {
      font-weight: 600;
      margin-bottom: 4px;
    }

    .footer-note {
      text-align: center;
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 16px;
    }
  </style>
</head>
<body>

  <div class="container">
    <div class="header">
      <span class="header-badge">Campaign Intake</span>
      <h1>Social Media Campaign Setup</h1>
      <p>Fill out the form below to submit your campaign details directly to our tracking sheet.</p>
    </div>

    <!-- Alert Messages -->
    <div id="alertSuccess" class="alert alert-success">
      <h4>Submission Received!</h4>
      <p>Your social media campaign intake has been saved successfully.</p>
    </div>

    <div id="alertError" class="alert alert-error">
      <h4>Submission Failed</h4>
      <p id="errorMessage">Unable to submit form. Please check your connection and try again.</p>
    </div>

    <!-- Main Intake Form -->
    <form id="campaignForm">
      <div class="form-group">
        <label for="fullName">Full Name <span>*</span></label>
        <input type="text" id="fullName" name="fullName" class="form-control" placeholder="Jane Doe" required />
      </div>

      <div class="form-group">
        <label for="email">Email Address <span>*</span></label>
        <input type="email" id="email" name="email" class="form-control" placeholder="jane.doe@company.com" required />
      </div>

      <div class="form-group">
        <label for="platform">Platform / Channel <span>*</span></label>
        <select id="platform" name="platform" class="form-control" required>
          <option value="" disabled selected>Select a target platform...</option>
          <option value="Instagram">Instagram</option>
          <option value="TikTok">TikTok</option>
          <option value="YouTube">YouTube</option>
          <option value="X / Twitter">X / Twitter</option>
          <option value="LinkedIn">LinkedIn</option>
          <option value="Facebook">Facebook</option>
          <option value="Meta Ads">Meta Ads (FB + IG)</option>
          <option value="Multi-Channel">Multi-Channel Campaign</option>
        </select>
      </div>

      <div class="form-group">
        <label for="campaignName">Campaign Name <span>*</span></label>
        <input type="text" id="campaignName" name="campaignName" class="form-control" placeholder="Q3 Product Launch Push" required />
      </div>

      <div class="form-group">
        <label for="notesBudget">Notes / Budget</label>
        <textarea id="notesBudget" name="notesBudget" class="form-control" placeholder="Target budget: $5,000. Focus on creator partnerships and video teasers..."></textarea>
      </div>

      <button type="submit" id="btnSubmit" class="btn-submit">
        <span class="spinner" id="spinner"></span>
        <span id="btnText">Submit Campaign Intake</span>
      </button>
    </form>

    <div class="footer-note">
      Connected to Google Sheets via Apps Script Web App
    </div>
  </div>

  <script>
    // Configured Google Apps Script Web App URL
    const GOOGLE_APPS_SCRIPT_URL = "${targetUrl}";

    const form = document.getElementById('campaignForm');
    const btnSubmit = document.getElementById('btnSubmit');
    const spinner = document.getElementById('spinner');
    const btnText = document.getElementById('btnText');
    const alertSuccess = document.getElementById('alertSuccess');
    const alertError = document.getElementById('alertError');
    const errorMessage = document.getElementById('errorMessage');

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Reset state
      alertSuccess.style.display = 'none';
      alertError.style.display = 'none';
      btnSubmit.disabled = true;
      spinner.style.display = 'inline-block';
      btnText.textContent = 'Submitting...';

      // Gather form values matching exact sheet headers:
      // Full Name, Email Address, Platform/Channel, Campaign Name, Notes/Budget
      const payload = {
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        platform: document.getElementById('platform').value,
        campaignName: document.getElementById('campaignName').value.trim(),
        notesBudget: document.getElementById('notesBudget').value.trim(),
        timestamp: new Date().toISOString()
      };

      try {
        // Submit payload using fetch to Apps Script Web App
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8' // Standard CORS-safe header for Apps Script
          },
          body: JSON.stringify(payload)
        });

        // Parse response
        let result;
        try {
          result = await response.json();
        } catch (parseErr) {
          result = { status: 'success' }; // Fallback if no-cors or text response
        }

        if (response.ok || (result && result.status !== 'error')) {
          alertSuccess.style.display = 'block';
          form.reset();
        } else {
          throw new Error(result.message || 'Submission request failed.');
        }
      } catch (err) {
        console.error('Submission Error:', err);
        errorMessage.textContent = err.message || 'Network error occurred while submitting to Google Sheets.';
        alertError.style.display = 'block';
      } finally {
        btnSubmit.disabled = false;
        spinner.style.display = 'none';
        btnText.textContent = 'Submit Campaign Intake';
      }
    });
  </script>

</body>
</html>`;
}

export function generateAppsScriptCode(): string {
  return `/**
 * Google Apps Script Web App Endpoint for Social Media Campaign Intake
 * Target Headers: Full Name | Email Address | Platform/Channel | Campaign Name | Notes/Budget | Timestamp
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // Wait up to 10 seconds for concurrent writes

  try {
    // Access the active spreadsheet or get by ID
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Required headers configuration
    var expectedHeaders = [
      "Full Name",
      "Email Address",
      "Platform/Channel",
      "Campaign Name",
      "Notes/Budget",
      "Timestamp"
    ];

    // Auto-create header row if sheet is brand new / empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(expectedHeaders);
      var headerRange = sheet.getRange(1, 1, 1, expectedHeaders.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#E0E7FF");
      headerRange.setFontColor("#3730A3");
    }

    // Parse JSON payload or fallback to parameters
    var data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter;
      }
    } else if (e.parameter) {
      data = e.parameter;
    }

    // Map payload fields to column values
    var fullName = data.fullName || data["Full Name"] || "";
    var email = data.email || data["Email Address"] || "";
    var platform = data.platform || data["Platform/Channel"] || "";
    var campaignName = data.campaignName || data["Campaign Name"] || "";
    var notesBudget = data.notesBudget || data["Notes/Budget"] || "";
    var timestamp = data.timestamp ? new Date(data.timestamp) : new Date();

    // Append submission row to sheet
    sheet.appendRow([
      fullName,
      email,
      platform,
      campaignName,
      notesBudget,
      timestamp
    ]);

    // Format timestamp column for readability
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 6).setNumberFormat("yyyy-mm-dd hh:mm:ss");

    // Return success response with CORS support
    return ContentService.createTextOutput(
      JSON.stringify({
        status: "success",
        message: "Campaign intake row recorded successfully",
        row: lastRow
      })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return error details
    return ContentService.createTextOutput(
      JSON.stringify({
        status: "error",
        message: error.toString()
      })
    ).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

/**
 * Optional Test Function (Run in Apps Script IDE to verify spreadsheet permissions)
 */
function testIntakeSubmission() {
  var mockEvent = {
    postData: {
      contents: JSON.stringify({
        fullName: "Test Marketer",
        email: "marketer@example.com",
        platform: "Instagram",
        campaignName: "Summer Solstice Promo",
        notesBudget: "$10,000 budget - Influencer outreach",
        timestamp: new Date().toISOString()
      })
    }
  };
  var response = doPost(mockEvent);
  Logger.log(response.getContent());
}
`;
}

export const INITIAL_SUBMISSIONS: CampaignSubmission[] = [
  {
    id: 'sub-101',
    fullName: 'Sophia Chen',
    email: 'sophia.chen@brandvibe.io',
    platform: 'TikTok',
    campaignName: 'GenZ Snack Craze Challenge',
    notesBudget: '$12,500 budget. Goal: 5M views with top micro-influencers in food & lifestyle.',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    status: 'submitted'
  },
  {
    id: 'sub-102',
    fullName: 'Marcus Vance',
    email: 'm.vance@apexmedialab.com',
    platform: 'Meta Ads',
    campaignName: 'Fall Footwear Retargeting',
    notesBudget: '$8,000 budget. Focusing on lookalike audiences & dynamic carousel ads.',
    timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
    status: 'submitted'
  },
  {
    id: 'sub-103',
    fullName: 'Elena Rostova',
    email: 'elena@cyberpulse.tech',
    platform: 'LinkedIn',
    campaignName: 'B2B SaaS AI Automation Webinar',
    notesBudget: '$4,500 budget. Lead gen form objective targeting VP of Ops in US & UK.',
    timestamp: new Date(Date.now() - 3600000 * 42).toISOString(),
    status: 'simulated'
  }
];
