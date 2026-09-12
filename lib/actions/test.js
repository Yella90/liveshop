import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'
import 'dotenv/config'

// ============================================
// CONFIG
// ============================================
const SUPABASE_URL = 'https://duilcacabsfokrxuvmjm.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1aWxjYWNhYnNmb2tyeHV2bWptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxNjMzMzAsImV4cCI6MjEwNDczOTMzMH0.v8l9HXLXLIKf5HIjc1ooMXtdYDsCrtCUHh0NJQQmHd8'
const SITE_URL = process.env.SITE_URL || 'https://liveshop-dusky.vercel.app'

const SMTP_HOST = 'smtp.gmail.com'
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465')
const SMTP_USER = 'doumbialayesoma@gmail.com'
const SMTP_PASS = 'ojpyyuhbbgaexcvb'
const SMTP_FROM = process.env.SMTP_FROM || `LiveShop <${SMTP_USER}>`

const BATCH_SIZE = 10
const MAX_ATTEMPTS = 3

// ============================================
// CLIENTS
// ============================================
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
})

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
})

// ============================================
// TEMPLATE EMAIL
// ============================================
function buildEmail({ resetUrl }) {
  const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellspacing="0" cellpadding="0" style="background:#f1f5f9;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 10px 40px rgba(15,23,42,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:32px 40px;">
            <h1 style="margin:0;color:#fff;font-size:22px;font-weight:800;">LiveShop</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <h2 style="margin:0 0 16px;color:#0f172a;font-size:24px;">Réinitialisation de mot de passe</h2>
            <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">
              Vous avez demandé à réinitialiser votre mot de passe LiveShop. Cliquez sur le bouton ci-dessous.
            </p>
            <table width="100%"><tr><td align="center" style="padding:8px 0 24px;">
              <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:16px 32px;border-radius:14px;">
                Réinitialiser mon mot de passe
              </a>
            </td></tr></table>
            <p style="margin:0;color:#64748b;font-size:13px;">Ce lien expire dans 1 heure.</p>
            <p style="margin:16px 0 0;color:#64748b;font-size:13px;">
              Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.
            </p>
            <div style="margin-top:28px;padding-top:24px;border-top:1px solid #e2e8f0;">
              <p style="margin:0 0 8px;color:#94a3b8;font-size:12px;">Si le bouton ne fonctionne pas :</p>
              <p style="margin:0;color:#6366f1;font-size:12px;word-break:break-all;">${resetUrl}</p>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px;background:#f8fafc;border-top:1px solid #e2e8f0;">
            <p style="margin:0;color:#94a3b8;font-size:12px;text-align:center;">
              © ${new Date().getFullYear()} LiveShop · UNITECH
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim()

  const text = `Réinitialisation de mot de passe LiveShop

Cliquez sur ce lien pour définir un nouveau mot de passe :
${resetUrl}

Ce lien expire dans 1 heure.

Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.`

  return { html, text }
}

// ============================================
// MAIN
// ============================================
async function processResets() {
  const startedAt = Date.now()
  console.log(`[${new Date().toISOString()}] 🚀 Worker démarré`)

  const { data: resets, error } = await supabase
    .from('password_resets')
    .select('*')
    .eq('sent', false)
    .gt('expires_at', new Date().toISOString())
    .lt('attempts', MAX_ATTEMPTS)
    .order('created_at', { ascending: true })
    .limit(BATCH_SIZE)

  if (error) {
    console.error('❌ Erreur:', error.message)
    process.exit(1)
  }

  if (!resets || resets.length === 0) {
    console.log('✅ Aucun reset à traiter')
    process.exit(0)
  }

  console.log(`📬 ${resets.length} reset(s) à traiter`)

  let sentCount = 0
  let failedCount = 0

  for (const reset of resets) {
    try {
      const resetUrl = `${SITE_URL}/auth/callback?token=${reset.token}`
      const { html, text } = buildEmail({ resetUrl })

      await transporter.sendMail({
        from: SMTP_FROM,
        to: reset.email,
        subject: 'Réinitialisation de votre mot de passe LiveShop',
        html,
        text,
      })

      await supabase
        .from('password_resets')
        .update({
          sent: true,
          sent_at: new Date().toISOString(),
        })
        .eq('id', reset.id)

      console.log(`✅ Envoyé : ${reset.email}`)
      sentCount++
    } catch (err) {
      const attempts = (reset.attempts || 0) + 1
      await supabase
        .from('password_resets')
        .update({
          attempts,
          error_message: err.message || String(err),
          sent: attempts >= MAX_ATTEMPTS, // abandon après 3 essais
        })
        .eq('id', reset.id)

      console.error(`❌ Échec (${attempts}/${MAX_ATTEMPTS}) : ${reset.email}`)
      failedCount++
    }
  }

  const duration = ((Date.now() - startedAt) / 1000).toFixed(2)
  console.log(
    `[${new Date().toISOString()}] 🏁 ${sentCount} envoyé(s), ${failedCount} échec(s) en ${duration}s`
  )
}

processResets()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('💥 Erreur fatale :', err)
    process.exit(1)
  })