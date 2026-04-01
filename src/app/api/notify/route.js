import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const ADMIN_EMAILS = ['ooimunhong8898@gmail.com']
const FROM = process.env.RESEND_FROM || 'GWG Notifications <onboarding@resend.dev>'

function row(label, value) {
  if (!value) return ''
  return `<tr>
    <td style="padding:8px 24px;font-family:sans-serif;font-size:13px;color:#888;white-space:nowrap;vertical-align:top;border-bottom:1px solid #f0ede8;">${label}</td>
    <td style="padding:8px 24px;font-family:sans-serif;font-size:13px;color:#111;vertical-align:top;border-bottom:1px solid #f0ede8;">${String(value).replace(/\n/g,'<br/>')}</td>
  </tr>`
}

function template(title, badge, rows) {
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f5f4f1;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #e0ddd8;border-radius:4px;overflow:hidden;">
  <tr><td style="background:#0a0a0a;padding:28px 32px;">
    <p style="margin:0 0 8px;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#b08d57;font-family:sans-serif;">Grand Watch Gallery</p>
    <h1 style="margin:0;font-size:20px;font-weight:800;color:#fff;font-family:sans-serif;letter-spacing:-0.3px;">${title}</h1>
    <span style="display:inline-block;margin-top:10px;background:#b08d57;color:#fff;font-size:10px;letter-spacing:2px;text-transform:uppercase;padding:3px 12px;border-radius:2px;font-family:sans-serif;">${badge}</span>
  </td></tr>
  <tr><td>
    <table width="100%" cellpadding="0" cellspacing="0">${rows}</table>
  </td></tr>
  <tr><td style="padding:16px 24px;border-top:1px solid #ede9e3;background:#faf9f7;">
    <p style="margin:0;font-size:11px;color:#aaa;font-family:sans-serif;">Grand Watch Gallery Admin System &middot; This is an automated notification</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`
}

export async function POST(req) {
  // Initialise Resend inside the handler so missing env var never crashes the build
  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const { type, data } = await req.json()
    let subject = ''
    let html = ''

    switch (type) {
      case 'appointment':
        subject = `New Appointment Request \u2014 ${data.name}`
        html = template('New Appointment Request', 'Appointment',
          row('Name', data.name) + row('Email', data.email) + row('Phone', data.phone) +
          row('Date', data.date) + row('Time', data.time) + row('Purpose', data.interest) +
          row('Notes', data.notes))
        break

      case 'trade_in':
        subject = `Trade-In Request \u2014 ${data.brand} ${data.model} \u00b7 ${data.name}`
        html = template('New Trade-In Request', 'Trade-In',
          row('Name', data.name) + row('Email', data.email) + row('Phone', data.phone) +
          row('Brand', data.brand) + row('Model', data.model) + row('Reference', data.ref) +
          row('Year', data.year) + row('Condition', data.condition) + row('Box & Papers', data.papers) +
          row('Notes', data.notes))
        break

      case 'career':
        subject = `Job Application \u2014 ${data.role} \u00b7 ${data.name}`
        html = template('New Job Application', 'Career',
          row('Name', data.name) + row('Email', data.email) + row('Phone', data.phone) +
          row('Position', data.role) + row('Message', data.message))
        break

      case 'partner':
        subject = `Partner Enquiry \u2014 ${data.type} \u00b7 ${data.name}`
        html = template('New Partner Enquiry', 'Partnership',
          row('Name', data.name) + row('Email', data.email) + row('Phone', data.phone) +
          row('Company', data.company) + row('Type', data.type) + row('Message', data.message))
        break

      case 'contact':
        subject = `Contact Message \u2014 ${data.name}`
        html = template('New Contact Message', 'Contact',
          row('Name', data.name) + row('Email', data.email) + row('Phone', data.phone) +
          row('Subject', data.subject) + row('Message', data.message))
        break

      case 'newsletter':
        subject = `New Newsletter Subscriber — ${data.email}`
        html = template('New Newsletter Subscriber', 'Newsletter',
          row('Email', data.email))
        break

      default:
        return NextResponse.json({ error: 'Unknown type' }, { status: 400 })
    }

    const { error } = await resend.emails.send({ from: FROM, to: ADMIN_EMAILS, subject, html })
    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Notify error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
