import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://geccntccvsxzxmhwimtf.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlY2NudGNjdnN4enhtaHdpbXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNDAxMDksImV4cCI6MjA4ODgxNjEwOX0.z-N7krtQDwidYhrIBHKsyqhDvTX1TYPsb3vs9_zFjiY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Send email via Resend (through Supabase Edge Function)
export async function sendEmail(to, subject, html) {
  try {
    const { data, error } = await supabase.functions.invoke('send-notification', {
      body: { to, subject, html }
    })
    if (error) console.warn('Email send failed:', error)
    return { data, error }
  } catch (e) {
    console.warn('Email error:', e)
    return { error: e }
  }
}

// Email templates
export const emailTemplates = {
  approved: (eventTitle, organiserName) => ({
    subject: `🎉 Event Approved — ${eventTitle}`,
    html: `
      <div style="font-family:'Segoe UI',sans-serif;max-width:560px;margin:0 auto;background:#0d1526;color:#e2e8f0;border-radius:16px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#6b1f8a,#c2410c);padding:28px 32px;text-align:center">
          <div style="font-size:13px;font-weight:800;letter-spacing:2px;color:rgba(255,255,255,.7);margin-bottom:6px">GSSS IET FOR WOMEN</div>
          <div style="font-size:22px;font-weight:800;color:#fff">Event Approved! 🎉</div>
        </div>
        <div style="padding:28px 32px">
          <p style="color:#94a3b8;margin:0 0 18px">Hi <strong style="color:#e2e8f0">${organiserName}</strong>,</p>
          <p style="color:#94a3b8;margin:0 0 18px">Great news! Your event proposal has been <strong style="color:#10B981">approved</strong> by the admin.</p>
          <div style="background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.25);border-radius:10px;padding:16px 20px;margin:18px 0">
            <div style="font-size:16px;font-weight:700;color:#e2e8f0">${eventTitle}</div>
          </div>
          <p style="color:#94a3b8;font-size:13px">Please upload event media within 24 hours after the event concludes.</p>
        </div>
        <div style="padding:16px 32px;background:rgba(0,0,0,.2);text-align:center;font-size:11px;color:#475569">
          GSSS Institute of Engineering and Technology for Women · Mysuru
        </div>
      </div>`
  }),
  rejected: (eventTitle, organiserName, reason, comment) => ({
    subject: `Event Update — ${eventTitle}`,
    html: `
      <div style="font-family:'Segoe UI',sans-serif;max-width:560px;margin:0 auto;background:#0d1526;color:#e2e8f0;border-radius:16px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#6b1f8a,#c2410c);padding:28px 32px;text-align:center">
          <div style="font-size:13px;font-weight:800;letter-spacing:2px;color:rgba(255,255,255,.7);margin-bottom:6px">GSSS IET FOR WOMEN</div>
          <div style="font-size:22px;font-weight:800;color:#fff">Event Status Update</div>
        </div>
        <div style="padding:28px 32px">
          <p style="color:#94a3b8;margin:0 0 18px">Hi <strong style="color:#e2e8f0">${organiserName}</strong>,</p>
          <p style="color:#94a3b8;margin:0 0 18px">Your event proposal <strong style="color:#e2e8f0">${eventTitle}</strong> could not be approved at this time.</p>
          <div style="background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);border-radius:10px;padding:16px 20px;margin:18px 0">
            <div style="font-size:11px;font-weight:700;color:#ef4444;letter-spacing:.8px;margin-bottom:6px">REASON</div>
            <div style="color:#fca5a5">${reason}</div>
            ${comment ? `<div style="margin-top:10px;font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:.8px">ADMIN SUGGESTION</div><div style="color:#94a3b8;margin-top:4px">${comment}</div>` : ''}
          </div>
          <p style="color:#94a3b8;font-size:13px">Please address the concerns and resubmit if applicable.</p>
        </div>
        <div style="padding:16px 32px;background:rgba(0,0,0,.2);text-align:center;font-size:11px;color:#475569">
          GSSS Institute of Engineering and Technology for Women · Mysuru
        </div>
      </div>`
  }),
  mediaUploaded: (eventTitle, recipientName) => ({
    subject: `📸 Media Ready — ${eventTitle}`,
    html: `
      <div style="font-family:'Segoe UI',sans-serif;max-width:560px;margin:0 auto;background:#0d1526;color:#e2e8f0;border-radius:16px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#6b1f8a,#c2410c);padding:28px 32px;text-align:center">
          <div style="font-size:13px;font-weight:800;letter-spacing:2px;color:rgba(255,255,255,.7);margin-bottom:6px">GSSS IET FOR WOMEN</div>
          <div style="font-size:22px;font-weight:800;color:#fff">Media Ready to Post 📸</div>
        </div>
        <div style="padding:28px 32px">
          <p style="color:#94a3b8;margin:0 0 18px">Hi <strong style="color:#e2e8f0">${recipientName}</strong>,</p>
          <p style="color:#94a3b8;margin:0 0 18px">Media for <strong style="color:#8B5CF6">${eventTitle}</strong> has been uploaded and is ready to post on social media platforms.</p>
          <p style="color:#94a3b8;font-size:13px">Please log into the portal to review and post.</p>
        </div>
        <div style="padding:16px 32px;background:rgba(0,0,0,.2);text-align:center;font-size:11px;color:#475569">
          GSSS Institute of Engineering and Technology for Women · Mysuru
        </div>
      </div>`
  }),
  eventReminder: (eventTitle, organiserName, daysAway, eventDate, venue) => ({
    subject: `⏰ ${daysAway === 0 ? 'TODAY' : 'Tomorrow'}: Event Reminder — ${eventTitle}`,
    html: `
      <div style="font-family:'Segoe UI',sans-serif;max-width:560px;margin:0 auto;background:#0d1526;color:#e2e8f0;border-radius:16px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#5C1A75,#8B35A3 50%,#D4451F);padding:28px 32px;text-align:center">
          <div style="font-size:13px;font-weight:800;letter-spacing:2px;color:rgba(255,255,255,.7);margin-bottom:6px">GSSS IET FOR WOMEN</div>
          <div style="font-size:22px;font-weight:800;color:#fff">${daysAway === 0 ? '🌟 Your Event is TODAY!' : '📅 Event Tomorrow!'}</div>
        </div>
        <div style="padding:28px 32px">
          <p style="color:#94a3b8;margin:0 0 18px">Hi <strong style="color:#e2e8f0">${organiserName}</strong>,</p>
          <div style="background:rgba(139,53,163,.12);border:1px solid rgba(139,53,163,.3);border-radius:10px;padding:16px 20px;margin:18px 0">
            <div style="font-size:16px;font-weight:700;color:#e2e8f0;margin-bottom:8px">${eventTitle}</div>
            <div style="font-size:13px;color:#94a3b8">📅 ${eventDate} &nbsp;·&nbsp; 📍 ${venue}</div>
          </div>
          <div style="background:rgba(212,69,31,.1);border:1px solid rgba(212,69,31,.25);border-radius:10px;padding:14px 18px;margin:16px 0">
            <div style="font-size:13px;font-weight:700;color:#f97316;margin-bottom:4px">📸 Important Reminder</div>
            <div style="font-size:13px;color:#94a3b8">Please remember to capture <strong style="color:#e2e8f0">photos and videos</strong> during your event. You will have a <strong style="color:#e2e8f0">24-hour window</strong> after the event ends to upload them through the portal.</div>
          </div>
          <p style="color:#94a3b8;font-size:13px">Log into the portal to view full event details and upload media after the event.</p>
        </div>
        <div style="padding:16px 32px;background:rgba(0,0,0,.2);text-align:center;font-size:11px;color:#475569">
          GSSS Institute of Engineering and Technology for Women · Mysuru
        </div>
      </div>`
  }),
  socialPostShared: (eventTitle, description, links, recipientName) => ({
    subject: `📣 Event Posted on Social Media — ${eventTitle}`,
    html: `
      <div style="font-family:'Segoe UI',sans-serif;max-width:560px;margin:0 auto;background:#0d1526;color:#e2e8f0;border-radius:16px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#5C1A75,#8B35A3 50%,#D4451F);padding:28px 32px;text-align:center">
          <div style="font-size:13px;font-weight:800;letter-spacing:2px;color:rgba(255,255,255,.7);margin-bottom:6px">GSSS IET FOR WOMEN</div>
          <div style="font-size:22px;font-weight:800;color:#fff">📣 Now Live on Social Media!</div>
        </div>
        <div style="padding:28px 32px">
          <p style="color:#94a3b8;margin:0 0 18px">Hi <strong style="color:#e2e8f0">${recipientName}</strong>,</p>
          <p style="color:#94a3b8;margin:0 0 18px">The event <strong style="color:#e2e8f0">${eventTitle}</strong> has been posted on our social media channels.</p>
          ${description ? `<div style="background:rgba(255,255,255,.04);border-radius:10px;padding:14px 18px;margin:16px 0;font-size:14px;color:#cbd5e1;line-height:1.6;font-style:italic">"${description}"</div>` : ''}
          ${links && links.length > 0 ? `
          <div style="margin:18px 0">
            <div style="font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:1px;margin-bottom:10px;text-transform:uppercase">View the posts:</div>
            ${links.map(l => `<a href="${l.url}" style="display:block;background:rgba(139,53,163,.1);border:1px solid rgba(139,53,163,.25);border-radius:8px;padding:10px 14px;margin-bottom:7px;color:#a855f7;text-decoration:none;font-size:13px;">🔗 ${l.platform} — ${l.url}</a>`).join('')}
          </div>` : ''}
          <p style="color:#94a3b8;font-size:13px">Check our official college social media handles for more details.</p>
        </div>
        <div style="padding:16px 32px;background:rgba(0,0,0,.2);text-align:center;font-size:11px;color:#475569">
          GSSS Institute of Engineering and Technology for Women · Mysuru
        </div>
      </div>`
  }),
  newSubmission: (eventTitle, adminName, organiserName, dept) => ({
    subject: `📋 New Event Submission — ${eventTitle}`,
    html: `
      <div style="font-family:'Segoe UI',sans-serif;max-width:560px;margin:0 auto;background:#0d1526;color:#e2e8f0;border-radius:16px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#6b1f8a,#c2410c);padding:28px 32px;text-align:center">
          <div style="font-size:13px;font-weight:800;letter-spacing:2px;color:rgba(255,255,255,.7);margin-bottom:6px">GSSS IET FOR WOMEN</div>
          <div style="font-size:22px;font-weight:800;color:#fff">New Event Submitted 📋</div>
        </div>
        <div style="padding:28px 32px">
          <p style="color:#94a3b8;margin:0 0 18px">Hi <strong style="color:#e2e8f0">${adminName}</strong>,</p>
          <p style="color:#94a3b8;margin:0 0 18px">A new event proposal has been submitted and requires your review.</p>
          <div style="background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.2);border-radius:10px;padding:16px 20px;margin:18px 0">
            <div style="font-size:16px;font-weight:700;color:#e2e8f0;margin-bottom:6px">${eventTitle}</div>
            <div style="font-size:13px;color:#94a3b8">Submitted by: ${organiserName} · ${dept}</div>
          </div>
          <p style="color:#94a3b8;font-size:13px">Please log in to approve or reject this proposal.</p>
        </div>
        <div style="padding:16px 32px;background:rgba(0,0,0,.2);text-align:center;font-size:11px;color:#475569">
          GSSS Institute of Engineering and Technology for Women · Mysuru
        </div>
      </div>`
  }),
}
