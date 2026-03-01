# TapMeOnce — n8n Workflows to Build

All workflows should be created in your n8n instance at: https://airtribe.app.n8n.cloud

---

## ✅ Workflow 1: AI Bio Generator
**Status:** Already live at `https://airtribe.app.n8n.cloud/webhook/tapmeonce-profile`

**Trigger:** POST webhook
**Input:**
```json
{
  "name": "Ravi Kumar",
  "designation": "Product Manager",
  "company": "Google",
  "isStudent": false,
  "location": "Mumbai",
  "type": "business" // or "personal"
}
```
**Process:** Call Claude API (claude-sonnet) with prompt → return bio
**Output:**
```json
{ "bio": "Ravi Kumar is a results-driven Product Manager..." }
```

---

## 📋 Workflow 2: New Card Order Notification (WhatsApp)
**Endpoint:** `/webhook/tapmeonce-order-notify`
**Trigger:** POST from frontend when order placed

**Objective:** Alert Jesseh on WhatsApp instantly when a new card is ordered.

**Input:**
```json
{
  "customerName": "Ravi Kumar",
  "customerPhone": "+91 9876543210",
  "customerEmail": "ravi@example.com",
  "plan": "professional",
  "cardType": "metallic_premium",
  "shippingAddress": { "line1": "...", "city": "Mumbai", "pincode": "400001" },
  "orderId": "uuid-here",
  "totalAmount": 1798
}
```

**Process:**
1. Receive webhook
2. Format WhatsApp message
3. Send to Jesseh's WhatsApp via AiSensy / Twilio / Meta Cloud API

**Message template:**
```
🆕 New TapMeOnce Order!
Customer: {{customerName}}
Phone: {{customerPhone}}
Plan: {{plan}} | Card: {{cardType}}
Amount: ₹{{totalAmount}}
Shipping: {{city}} - {{pincode}}
Order ID: {{orderId}}
```

---

## 📋 Workflow 3: New Lead Alert (WhatsApp)
**Endpoint:** `/webhook/tapmeonce-lead-notify`
**Trigger:** POST from PublicProfile when visitor submits lead form

**Objective:** Alert card owner on WhatsApp when someone fills the lead form.

**Input:**
```json
{
  "cardOwnerPhone": "+91 9876543210",
  "cardOwnerName": "Ravi Kumar",
  "visitorName": "Priya Sharma",
  "visitorPhone": "+91 9123456789",
  "visitorEmail": "priya@example.com",
  "tapCity": "Delhi"
}
```

**Message to card owner:**
```
🎯 New Lead from {{tapCity}}!
{{visitorName}} wants to connect.
Phone: {{visitorPhone}}
Email: {{visitorEmail}}
```

---

## 📋 Workflow 4: Team Member Invite Notification
**Endpoint:** `/webhook/tapmeonce-team-invite`
**Trigger:** POST when business admin invites a team member

**Objective:** (1) Notify Jesseh to produce a new card. (2) Send invite email to the team member.

**Input:**
```json
{
  "name": "Anjali Singh",
  "email": "anjali@company.com",
  "ownerId": "uuid-of-business-admin",
  "ownerName": "TechCorp Ltd"
}
```

**Process:**
1. Send WhatsApp to Jesseh with member details + card production request
2. Send email invitation to Anjali

**Message to Jesseh:**
```
🏢 New Business Team Member!
Company: {{ownerName}}
Member: {{name}} ({{email}})
Action needed: Create NFC card and ship to admin.
```

---

## 📋 Workflow 5: Order Status Update (WhatsApp to Customer)
**Endpoint:** `/webhook/tapmeonce-order-status`
**Trigger:** POST from admin when updating order status

**Objective:** Update customers automatically on WhatsApp when their card status changes.

**Input:**
```json
{
  "customerPhone": "+91 9876543210",
  "customerName": "Ravi Kumar",
  "status": "dispatched",
  "trackingNumber": "DTDC-123456",
  "estimatedDelivery": "3-5 business days"
}
```

**Status messages:**
- `confirmed`: "Your TapMeOnce card is confirmed! We're preparing it."
- `in_production`: "Your card is being produced. Usually takes 2-3 days."
- `dispatched`: "Your card has been dispatched! Tracking: {{trackingNumber}}"
- `delivered`: "Your TapMeOnce card has been delivered! Tap it to activate."

---

## 📋 Workflow 6: Subscription Renewal Reminder
**Endpoint:** Scheduled (no webhook)
**Trigger:** Daily cron at 9am

**Objective:** Send WhatsApp reminder 7 days before subscription expires.

**Process:**
1. Query Supabase: `profiles WHERE plan_expires_at <= now() + 7 days`
2. For each result, send WhatsApp reminder
3. Include upgrade incentive for Free users

---

## 🔧 WhatsApp Setup Checklist

To implement WhatsApp notifications, Jesseh needs to do the following:

### Option A: AiSensy (Recommended for India)
- [ ] Create account at https://aisensy.com
- [ ] Connect WhatsApp Business number
- [ ] Create message templates (get approved by Meta — takes 24-48 hours)
- [ ] Get API key from AiSensy dashboard
- [ ] Add AiSensy node in n8n workflows

### Option B: Twilio WhatsApp
- [ ] Create Twilio account at https://twilio.com
- [ ] Enable WhatsApp sandbox or apply for production
- [ ] Get Account SID + Auth Token
- [ ] Add HTTP Request node in n8n

### Option C: Meta Cloud API (Direct)
- [ ] Create Meta Business account
- [ ] Register WhatsApp Business number
- [ ] Create WhatsApp Business App in Meta Developer Portal
- [ ] Get permanent token
- [ ] Submit message templates for approval

**Recommendation:** Start with AiSensy — fastest setup for India, has pre-built n8n integration.

---

## 📊 Supabase Edge Function: Create Razorpay Order

You need one Supabase Edge Function to create Razorpay orders securely (Razorpay secret key must never be in frontend):

**File:** `supabase/functions/create-razorpay-order/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Razorpay from 'npm:razorpay'

const razorpay = new Razorpay({
  key_id: Deno.env.get('RAZORPAY_KEY_ID')!,
  key_secret: Deno.env.get('RAZORPAY_KEY_SECRET')!,
})

serve(async (req) => {
  const { amount, plan, email } = await req.json()

  const order = await razorpay.orders.create({
    amount, // in paise
    currency: 'INR',
    receipt: `tmo_${Date.now()}`,
    notes: { plan, email },
  })

  return new Response(
    JSON.stringify({ order_id: order.id }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
```

**Deploy:** `supabase functions deploy create-razorpay-order`
**Set secrets:** `supabase secrets set RAZORPAY_KEY_ID=rzp_live_xxx RAZORPAY_KEY_SECRET=your_secret`

---

## ✅ Your Complete Setup Checklist

### 1. Supabase
- [ ] Create project at https://supabase.com
- [ ] Run `supabase/schema.sql` in SQL Editor
- [ ] Create "avatars" Storage bucket (public)
- [ ] Copy Project URL + anon key to Lovable env vars
- [ ] Deploy Edge Function for Razorpay orders

### 2. Razorpay
- [ ] Create account at https://razorpay.com
- [ ] Complete KYC verification
- [ ] Set up subscription plans (monthly & yearly)
- [ ] Get API keys (test first, then live)
- [ ] Add `VITE_RAZORPAY_KEY_ID` to Lovable env vars

### 3. WhatsApp (via AiSensy)
- [ ] Create AiSensy account
- [ ] Connect WhatsApp Business number
- [ ] Create and get approved message templates
- [ ] Set up n8n workflows (Workflows 2, 3, 4, 5, 6 above)

### 4. Domain (for subdomain routing)
- [ ] Point `*.tapmeonce.com` DNS to your Vercel/Lovable deployment
- [ ] Configure subdomain routing in deployment settings

### 5. Lovable
- [ ] Add all env vars in Project Settings → Environment Variables
- [ ] Deploy and test

---

*Last updated: Built by Claude — March 2026*
