/** Brevo (Sendinblue) transactional email — account verification + password reset only */

const BREVO_URL = 'https://api.brevo.com/v3/smtp/email';

type EmailPayload = {
	to: string;
	subject: string;
	html: string;
	text?: string;
};

export async function sendEmail(
	payload: EmailPayload,
	apiKey: string,
	fromEmail = 'noreply@rakatoss.com',
	fromName = 'Rakatoss'
) {
	const res = await fetch(BREVO_URL, {
		method: 'POST',
		headers: {
			accept: 'application/json',
			'api-key': apiKey,
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			sender: { name: fromName, email: fromEmail },
			to: [{ email: payload.to }],
			subject: payload.subject,
			htmlContent: payload.html,
			textContent: payload.text
		})
	});

	if (!res.ok) {
		const err = await res.text();
		throw new Error(`Brevo email failed: ${res.status} ${err}`);
	}
}

export function verifyEmailHtml(username: string, verifyUrl: string) {
	return `
    <div style="font-family:sans-serif;max-width:500px;margin:auto">
      <h2 style="color:#7c3aed">Welcome to Rakatoss, ${username}!</h2>
      <p>Click the button below to verify your email address and start playing.</p>
      <a href="${verifyUrl}" style="
        display:inline-block;padding:12px 24px;
        background:#7c3aed;color:#fff;border-radius:8px;
        text-decoration:none;font-weight:bold;margin:16px 0
      ">Verify Email →</a>
      <p style="color:#888;font-size:13px">Link expires in 24 hours. If you didn't create an account, ignore this email.</p>
    </div>`;
}

export function passwordResetHtml(username: string, resetUrl: string) {
	return `
    <div style="font-family:sans-serif;max-width:500px;margin:auto">
      <h2 style="color:#7c3aed">Password Reset — Rakatoss</h2>
      <p>Hi ${username}, click below to reset your password.</p>
      <a href="${resetUrl}" style="
        display:inline-block;padding:12px 24px;
        background:#7c3aed;color:#fff;border-radius:8px;
        text-decoration:none;font-weight:bold;margin:16px 0
      ">Reset Password →</a>
      <p style="color:#888;font-size:13px">Link expires in 1 hour. If you didn't request this, ignore this email.</p>
    </div>`;
}
