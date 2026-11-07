/*
* This file was created with significant AI assistance (e.g., Claude)
* to handle the booking enquiry: validation, spam checks (honeypot, minimum fill time, link filter)
* and sending the mail via SMTP (nodemailer).
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
*/
import nodemailer from 'nodemailer'
import type { H3Event } from 'h3'

type Body = Partial<Record<'object' | 'arrival' | 'departure' | 'persons' | 'name' | 'email' | 'phone' | 'message' | 'hp', string>> & {
  privacy?: boolean
  elapsed?: number
}

const clean = (v: unknown, max = 500) => String(v ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, max)
function fail(event: H3Event, status: number, message: string) {
  setResponseStatus(event, status)
  return { ok: false, message }
}
const date = (v: unknown) => (/^\d{4}-\d{2}-\d{2}$/.test(String(v)) ? String(v).split('-').reverse().join('.') : '')

export default defineEventHandler(async (event) => {
  const body = (await readBody<Body>(event)) || {}

  // Bots: filled honeypot or form sent faster than a human can type → pretend success
  if (body.hp || (typeof body.elapsed === 'number' && body.elapsed < 3000)) return { ok: true }

  const name = clean(body.name, 120)
  const email = clean(body.email, 200)
  const phone = clean(body.phone, 60)
  const message = String(body.message ?? '').trim().slice(0, 4000)
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !phone || !body.privacy) {
    return fail(event, 422, 'Bitte füllen Sie alle Pflichtfelder aus')
  }
  if ((message.match(/https?:\/\//g) || []).length > 2) {
    return fail(event, 422, 'Bitte senden Sie keine Links')
  }

  const cfg = useRuntimeConfig()
  if (!cfg.smtpHost || !cfg.mailTo) {
    return fail(event, 500, 'Mailversand ist nicht eingerichtet')
  }

  const lines = [
    `Unterkunft: ${clean(body.object, 60)}`,
    `Zeitraum: ${date(body.arrival) || '–'} bis ${date(body.departure) || '–'}`,
    `Personen: ${clean(body.persons, 2)}`,
    '',
    `Name: ${name}`,
    `E-Mail: ${email}`,
    `Telefon: ${phone}`,
    '',
    'Nachricht:',
    message || '–',
  ]

  const transport = nodemailer.createTransport({
    host: cfg.smtpHost,
    port: Number(cfg.smtpPort) || 587,
    secure: cfg.smtpSecure === 'true',
    auth: cfg.smtpUser ? { user: cfg.smtpUser, pass: cfg.smtpPass } : undefined,
  })

  try {
    await transport.sendMail({
      from: { name: 'Huus Windroos Website', address: cfg.mailFrom || cfg.smtpUser },
      to: cfg.mailTo.split(',').map((s: string) => s.trim()),
      replyTo: { name, address: email },
      subject: `Anfrage ${clean(body.object, 60)}: ${date(body.arrival) || 'ohne Datum'} – ${name}`,
      text: lines.join('\n'),
    })
  } catch (e) {
    console.error('[contact] sendMail failed', e)
    return fail(event, 502, 'Die Nachricht konnte nicht versendet werden')
  }

  return { ok: true }
})
