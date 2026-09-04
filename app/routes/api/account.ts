import type { ActionFunction, LoaderFunction } from "react-router";
import {
  authenticateAndAssignAccount,
  createAndAssignAccount,
  getConnectedAccountFromRequest,
  buildAccountLogoutCookie,
  buildAnonymousLogoutCookie,
  renameCurrentAccount,
  requestPasswordReset,
  resetPasswordFromToken,
  updateCurrentAccountProfile,
} from "~/utils/account.server";
import {
  sendAccountPendingValidationEmail,
  sendNewAccountNotificationEmail,
} from "~/utils/mailer.server";
import { accountActionSchema, parsePayload } from "~/utils/schemas.server";

export const loader: LoaderFunction = async ({ request }) => {
  const connectedAccount = await getConnectedAccountFromRequest(request);
  if (!connectedAccount) {
    return { connected: false, account: null };
  }
  return { connected: true, account: connectedAccount };
};

export const action: ActionFunction = async ({ request }) => {
  const raw = await request.json();
  const parsed = parsePayload(accountActionSchema, raw);
  if (!parsed.success) return parsed.response;
  const body = parsed.data;

  if (body.intent === "create") {

    let created;
    try {
      created = await createAndAssignAccount({
        name: body.name,
        email: body.email,
        password: body.password,
      });
    } catch {
      return Response.json({ ok: false, error: "create-failed" }, { status: 400 });
    }

    try {
      await sendNewAccountNotificationEmail({
        accountName: created.account.name,
        accountEmail: created.account.email,
      });
    } catch (error) {
      console.error("[account:create] notification email failed", {
        accountId: created.account.id,
        accountEmail: created.account.email,
        to: process.env.ADMIN_NOTIFICATION_EMAIL ?? "mlpreira@gmail.com",
        from: process.env.RESEND_FROM_EMAIL ?? "Match Reporter <noreply@matchreporter.io>",
        error: error instanceof Error ? error.message : String(error),
      });
      // Notification failures should not block account creation.
    }

    try {
      await sendAccountPendingValidationEmail({
        accountName: created.account.name,
        accountEmail: created.account.email,
      });
    } catch (error) {
      console.error("[account:create] pending validation email failed", {
        accountId: created.account.id,
        accountEmail: created.account.email,
        to: created.account.email,
        from: process.env.RESEND_FROM_EMAIL ?? "Match Reporter <noreply@matchreporter.io>",
        error: error instanceof Error ? error.message : String(error),
      });
      // Notification failures should not block account creation.
    }

    return Response.json(
      {
        ok: true,
        account: created.account,
      },
      {
        headers: (() => {
          const headers = new Headers();
          for (const cookie of created.setCookieHeaders) {
            headers.append("Set-Cookie", cookie);
          }
          return headers;
        })(),
      }
    );
  }

  if (body.intent === "login") {
    const logged = await authenticateAndAssignAccount({
      email: body.email,
      password: body.password,
    });
    if (!logged.account) {
      if (logged.reason === "not-approved") {
        return Response.json({ ok: false, error: "account-not-approved" }, { status: 403 });
      }
      return Response.json({ ok: false, error: "invalid-credentials" }, { status: 401 });
    }

    return Response.json(
      {
        ok: true,
        account: logged.account,
      },
      {
        headers: (() => {
          const headers = new Headers();
          for (const cookie of logged.setCookieHeaders) {
            headers.append("Set-Cookie", cookie);
          }
          return headers;
        })(),
      }
    );
  }

  if (body.intent === "rename") {
    const connectedAccount = await getConnectedAccountFromRequest(request);
    if (!connectedAccount) {
      return Response.json({ ok: false, error: "not-connected" }, { status: 401 });
    }

    const account = await renameCurrentAccount(connectedAccount.id, body.name);

    return Response.json({ ok: true, account });
  }

  if (body.intent === "update-profile") {
    const connectedAccount = await getConnectedAccountFromRequest(request);
    if (!connectedAccount) {
      return Response.json({ ok: false, error: "not-connected" }, { status: 401 });
    }

    try {
      const account = await updateCurrentAccountProfile({
        accountId: connectedAccount.id,
        email: body.email,
        currentPassword: body.currentPassword,
        password: body.password,
      });
      return Response.json({ ok: true, account });
    } catch {
      return Response.json({ ok: false, error: "update-profile-failed" }, { status: 400 });
    }
  }

  if (body.intent === "forgot-password") {
    try {
      await requestPasswordReset(body.email);
      // Always return success to avoid account enumeration.
      return Response.json({ ok: true });
    } catch {
      return Response.json({ ok: true });
    }
  }

  if (body.intent === "reset-password") {
    try {
      const updated = await resetPasswordFromToken({
        token: body.token,
        password: body.password,
      });

      if (!updated) {
        return Response.json({ ok: false, error: "invalid-or-expired-token" }, { status: 400 });
      }

      return Response.json({ ok: true });
    } catch {
      return Response.json({ ok: false, error: "reset-failed" }, { status: 400 });
    }
  }

  if (body.intent === "logout") {
    return Response.json(
      { ok: true },
      {
        headers: (() => {
          const headers = new Headers();
          headers.append("Set-Cookie", buildAccountLogoutCookie());
          headers.append("Set-Cookie", buildAnonymousLogoutCookie());
          return headers;
        })(),
      }
    );
  }

  return Response.json({ ok: false, error: "invalid-intent" }, { status: 400 });
};
