const DEFAULT_ADMIN_NOTIFICATION_EMAIL = "mlpreira@gmail.com";

interface NewAccountNotificationInput {
  accountName: string;
  accountEmail: string;
}

interface AccountPendingValidationEmailInput {
  accountName: string;
  accountEmail: string;
}

interface PasswordResetEmailInput {
  accountName: string;
  accountEmail: string;
  resetUrl: string;
}

interface AccountApprovedEmailInput {
  accountName: string;
  accountEmail: string;
}

function sanitizeEnvSecret(value: string | undefined): string {
  if (!value) {
    return "";
  }

  const trimmed = value.trim();
  // Render/UI copy-paste can accidentally include wrapping quotes.
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
}

export async function sendNewAccountNotificationEmail(
  input: NewAccountNotificationInput
): Promise<void> {
  const apiKey = sanitizeEnvSecret(process.env.RESEND_API_KEY);
  const from = process.env.RESEND_FROM_EMAIL ?? "Match Reporter <noreply@matchreporter.io>";
  const adminNotificationEmail =
    process.env.ADMIN_NOTIFICATION_EMAIL?.trim() || DEFAULT_ADMIN_NOTIFICATION_EMAIL;

  if (!apiKey) {
    console.warn("[mailer] RESEND_API_KEY missing: skipping account notification email", {
      to: adminNotificationEmail,
      from,
      accountEmail: input.accountEmail,
    });
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [adminNotificationEmail],
      subject: "Nouveau compte créé sur Match Reporter",
      text: `Un nouveau compte a été créé.\n\nNom: ${input.accountName}\nEmail: ${input.accountEmail}`,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    const keyFingerprint = apiKey.length >= 8 ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}` : "too-short";
    throw new Error(
      `Unable to send account notification email (status ${response.status}, key ${keyFingerprint}): ${details}`
    );
  }

  console.info("[mailer] account notification email sent", {
    to: adminNotificationEmail,
    from,
    accountEmail: input.accountEmail,
  });
}

export async function sendAccountPendingValidationEmail(
  input: AccountPendingValidationEmailInput
): Promise<void> {
  const apiKey = sanitizeEnvSecret(process.env.RESEND_API_KEY);
  const from = process.env.RESEND_FROM_EMAIL ?? "Match Reporter <noreply@matchreporter.io>";

  if (!apiKey) {
    console.warn("[mailer] RESEND_API_KEY missing: skipping pending validation email", {
      to: input.accountEmail,
      from,
      accountEmail: input.accountEmail,
    });
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [input.accountEmail],
      subject: "Ton compte Match Reporter est en cours de validation",
      text:
        `Bonjour ${input.accountName},\n\n` +
        "Ton compte a bien été créé. Il est actuellement en attente de validation par un administrateur.\n\n" +
        "Tu recevras un nouvel email dès que ton compte sera activé.\n\n" +
        "Merci pour ta patience.",
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    const keyFingerprint = apiKey.length >= 8 ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}` : "too-short";
    throw new Error(
      `Unable to send pending validation email (status ${response.status}, key ${keyFingerprint}): ${details}`
    );
  }

  console.info("[mailer] pending validation email sent", {
    to: input.accountEmail,
    from,
    accountEmail: input.accountEmail,
  });
}

export async function sendPasswordResetEmail(input: PasswordResetEmailInput): Promise<void> {
  const apiKey = sanitizeEnvSecret(process.env.RESEND_API_KEY);
  const from = process.env.RESEND_FROM_EMAIL ?? "Match Reporter <noreply@matchreporter.io>";

  if (!apiKey) {
    console.warn("[mailer] RESEND_API_KEY missing: skipping password reset email", {
      to: input.accountEmail,
      from,
      accountEmail: input.accountEmail,
    });
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [input.accountEmail],
      subject: "Reinitialisation de ton mot de passe Match Reporter",
      text:
        `Bonjour ${input.accountName},\n\n` +
        "Tu as demandé la réinitialisation de ton mot de passe.\n\n" +
        `Clique sur ce lien pour définir un nouveau mot de passe : ${input.resetUrl}\n\n` +
        "Ce lien expire dans 30 minutes.\n" +
        "Si tu n'es pas à l'origine de cette demande, tu peux ignorer cet email.",
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    const keyFingerprint = apiKey.length >= 8 ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}` : "too-short";
    throw new Error(
      `Unable to send password reset email (status ${response.status}, key ${keyFingerprint}): ${details}`
    );
  }

  console.info("[mailer] password reset email sent", {
    to: input.accountEmail,
    from,
    accountEmail: input.accountEmail,
  });
}

export async function sendAccountApprovedEmail(input: AccountApprovedEmailInput): Promise<void> {
  const apiKey = sanitizeEnvSecret(process.env.RESEND_API_KEY);
  const from = process.env.RESEND_FROM_EMAIL ?? "Match Reporter <noreply@matchreporter.io>";

  if (!apiKey) {
    console.warn("[mailer] RESEND_API_KEY missing: skipping account approved email", {
      to: input.accountEmail,
      from,
      accountEmail: input.accountEmail,
    });
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [input.accountEmail],
      subject: "Ton compte Match Reporter est actif !",
      text:
        `Bonjour ${input.accountName},\n\n` +
        "Bonne nouvelle : ton compte Match Reporter vient d'etre activé par un administrateur.\n\n" +
        "Tu peux maintenant te connecter avec ton email et ton mot de passe.",
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    const keyFingerprint = apiKey.length >= 8 ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}` : "too-short";
    throw new Error(
      `Unable to send account approved email (status ${response.status}, key ${keyFingerprint}): ${details}`
    );
  }

  console.info("[mailer] account approved email sent", {
    to: input.accountEmail,
    from,
    accountEmail: input.accountEmail,
  });
}
