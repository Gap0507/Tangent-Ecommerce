import { Resend } from "resend";
import fs from "fs";
import path from "path";

const resend = new Resend(process.env.RESEND_EMAIL_APIKEY);

const BASE_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://tangentfnb.com").replace(/\/$/, "");

interface OrderItem {
  name: string;
  size: string;
  quantity: number;
  price: number;
  image?: string;
}

interface OrderEmailData {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  items: OrderItem[];
  pricing: {
    subtotal: number;
    shipping: number;
    discount: number;
    total: number;
  };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
}

function buildReceiptHTML(order: OrderEmailData): string {
  const fontStack = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

  // Each item row: name+meta on the left, a dotted leader in the middle, price on the right.
  // Table-based dotted leader so it survives Outlook/Gmail rendering, not just flexbox.
  const itemsHTML = order.items
    .map(
      (item) => `
      <tr>
        <td colspan="3" style="padding: 14px 0 0;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td class="tx-navy" style="vertical-align: top; white-space: nowrap; font-family: ${fontStack}; font-size: 14px; font-weight: 700; color: #091E33;">
                ${item.quantity}&times;&nbsp;${item.name}
              </td>
              <td class="bd-dash" style="border-bottom: 1px dotted #C9C2B4; line-height: 1px; font-size: 1px;">&nbsp;</td>
              <td class="tx-navy" style="vertical-align: top; white-space: nowrap; text-align: right; font-family: ${fontStack}; font-size: 14px; font-weight: 700; color: #091E33;">
                &#8377;${(item.price * item.quantity).toFixed(2)}
              </td>
            </tr>
            <tr>
              <td colspan="3" class="tx-label" style="padding-top: 2px; font-family: ${fontStack}; font-size: 12px; color: #8A8578;">
                ${item.size ? item.size + " &middot; " : ""}&#8377;${item.price.toFixed(2)} each
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    )
    .join("");

  // Serrated / torn-paper edge, built from a repeating diagonal gradient.
  // Degrades gracefully to a flat strip in clients that ignore background gradients (e.g. some Outlook builds).
  const tornEdge = (flip = false) => `
    <tr>
      <td class="tr-card" bgcolor="#FAF7F2" style="height: 14px; line-height: 14px; font-size: 0;
        background-color: #FAF7F2;
        background-image:
          linear-gradient(${flip ? "225deg" : "45deg"}, #FFFFFF 8px, transparent 0),
          linear-gradient(${flip ? "135deg" : "-45deg"}, #FFFFFF 8px, transparent 0);
        background-position: left ${flip ? "bottom" : "top"}, left ${flip ? "bottom" : "top"};
        background-size: 16px 16px;
        background-repeat: repeat-x;">&nbsp;</td>
    </tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light only">
  <meta name="supported-color-schemes" content="light only">
  <meta name="x-apple-disable-message-reformatting">
  <title>Order Confirmed #${order.orderNumber} - Tangent</title>
  <!--[if mso]>
  <style>
    table { border-collapse: collapse; }
    td, p, a, span, h1, h2, h3 { font-family: Arial, sans-serif !important; }
  </style>
  <![endif]-->
  <style>
    /*
      Force this email to stay in its light "receipt" theme even when the
      recipient's mail client / OS is set to dark mode. Several clients
      (Apple Mail, iOS/Android Mail, Outlook desktop, Outlook.com) apply
      their own automatic dark-mode recoloring on top of your inline
      styles. The meta tags above opt certain clients (mainly Gmail,
      Outlook mobile) out of that entirely. This block is the backup for
      clients that still apply forced dark styles by injecting a
      stylesheet with higher priority than plain inline styles - matching
      class + !important here reclaims the original colors.
    */
    @media (prefers-color-scheme: dark) {
      body, .email-bg { background-color: #EFEAE0 !important; }
      .tr-card { background-color: #FAF7F2 !important; }
      .tr-navy { background-color: #091E33 !important; }
      .tx-navy { color: #091E33 !important; }
      .tx-muted { color: #64748B !important; }
      .tx-label { color: #8A8578 !important; }
      .tx-green { color: #059669 !important; }
      .tx-cream { color: #FAF7F2 !important; }
      .tx-cream-60 { color: rgba(250, 247, 242, 0.6) !important; }
      .tx-cream-45 { color: rgba(250, 247, 242, 0.45) !important; }
      .tx-cream-35 { color: rgba(250, 247, 242, 0.35) !important; }
      .bd-dash { border-color: #C9C2B4 !important; }
      .bd-navy { border-color: #091E33 !important; }
      img { filter: none !important; -webkit-filter: none !important; }
    }
    /* Outlook.com web / Windows Mail dark-mode hook */
    [data-ogsc] body, [data-ogsc] .email-bg { background-color: #EFEAE0 !important; }
    [data-ogsc] .tr-card { background-color: #FAF7F2 !important; }
    [data-ogsc] .tr-navy { background-color: #091E33 !important; }
    [data-ogsc] .tx-navy { color: #091E33 !important; }
    [data-ogsc] .tx-muted { color: #64748B !important; }
    [data-ogsc] .tx-label { color: #8A8578 !important; }
    [data-ogsc] .tx-green { color: #059669 !important; }
    [data-ogsc] .tx-cream { color: #FAF7F2 !important; }
    [data-ogsc] .tx-cream-60 { color: rgba(250, 247, 242, 0.6) !important; }
    [data-ogsc] .tx-cream-45 { color: rgba(250, 247, 242, 0.45) !important; }
    [data-ogsc] .tx-cream-35 { color: rgba(250, 247, 242, 0.35) !important; }
    [data-ogsc] .bd-dash { border-color: #C9C2B4 !important; }
    [data-ogsc] img { filter: none !important; }
  </style>
</head>
<body class="email-bg" style="margin: 0; padding: 0; background-color: #EFEAE0; font-family: ${fontStack}; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%;">

  <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#EFEAE0" class="email-bg" style="background-color: #EFEAE0; min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 40px 16px;">

        <!-- Receipt Card -->
        <table cellpadding="0" cellspacing="0" border="0" width="420" bgcolor="#FAF7F2" class="tr-card" style="max-width: 420px; width: 100%; background-color: #FAF7F2; box-shadow: 0 14px 36px rgba(9, 30, 51, 0.12);">

          ${tornEdge(false)}

          <!-- Logo -->
          <tr>
            <td class="tr-card" bgcolor="#FAF7F2" style="padding: 8px 36px 20px; text-align: center; background-color: #FAF7F2;">
              <a href="${BASE_URL}" target="_blank" style="text-decoration: none; display: inline-block;">
                <img src="cid:tangent-logo" alt="Tangent" width="130" style="display: block; width: 130px; height: auto; border: 0; outline: none; margin: 0 auto;" />
              </a>
              <p class="tx-navy" style="margin: 8px 0 0; font-family: ${fontStack}; font-size: 10px; font-weight: 700; color: #091E33; letter-spacing: 2.5px; text-transform: uppercase; opacity: 0.55;">
                Functional Energy Drinks
              </p>
            </td>
          </tr>

          <!-- Dashed rule -->
          <tr><td class="tr-card bd-dash" bgcolor="#FAF7F2" style="border-top: 1px dashed #C9C2B4; padding: 0 36px; background-color: #FAF7F2;"></td></tr>

          <!-- Receipt label + confirmation -->
          <tr>
            <td class="tr-card" bgcolor="#FAF7F2" style="padding: 22px 36px 4px; text-align: center; background-color: #FAF7F2;">
              <p class="tx-label" style="margin: 0 0 10px; font-family: ${fontStack}; font-size: 11px; font-weight: 800; color: #8A8578; letter-spacing: 3px; text-transform: uppercase;">
                &#10003; Order Receipt
              </p>
              <h1 class="tx-navy" style="margin: 0; font-family: ${fontStack}; font-size: 21px; font-weight: 800; color: #091E33; letter-spacing: -0.3px;">
                Order Confirmed!
              </h1>
              <p class="tx-muted" style="margin: 8px 0 0; font-family: ${fontStack}; font-size: 13px; font-weight: 400; color: #64748B; line-height: 1.5;">
                Hey <strong class="tx-navy" style="color: #091E33; font-weight: 600;">${order.customerName}</strong>, your order is being prepared with care.
              </p>
            </td>
          </tr>

          <!-- Order number -->
          <tr>
            <td class="tr-card" bgcolor="#FAF7F2" style="padding: 18px 36px 6px; text-align: center; background-color: #FAF7F2;">
              <span class="tx-label" style="display: inline-block; font-family: ${fontStack}; font-size: 11px; font-weight: 700; color: #8A8578; text-transform: uppercase; letter-spacing: 2px;">Order No.</span><br/>
              <span class="tx-navy" style="display: inline-block; font-family: ${fontStack}; font-size: 20px; font-weight: 800; color: #091E33; letter-spacing: 3px; margin-top: 2px;">#${order.orderNumber}</span>
            </td>
          </tr>

          <!-- Dotted rule -->
          <tr><td class="tr-card" bgcolor="#FAF7F2" style="padding: 16px 36px 0; background-color: #FAF7F2;"><div class="bd-dash" style="border-top: 1px dotted #C9C2B4;"></div></td></tr>

          <!-- Items -->
          <tr>
            <td class="tr-card" bgcolor="#FAF7F2" style="padding: 4px 36px 0; background-color: #FAF7F2;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td colspan="3" class="tx-label" style="padding-top: 14px; font-family: ${fontStack}; font-size: 10px; font-weight: 800; color: #8A8578; text-transform: uppercase; letter-spacing: 2px;">
                    Items
                  </td>
                </tr>
                ${itemsHTML}
              </table>
            </td>
          </tr>

          <!-- Dashed rule -->
          <tr><td class="tr-card" bgcolor="#FAF7F2" style="padding: 20px 36px 0; background-color: #FAF7F2;"><div class="bd-dash" style="border-top: 1px dashed #C9C2B4;"></div></td></tr>

          <!-- Cost breakdown -->
          <tr>
            <td class="tr-card" bgcolor="#FAF7F2" style="padding: 14px 36px 0; background-color: #FAF7F2;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td class="tx-muted" style="padding: 4px 0; font-family: ${fontStack}; font-size: 13px; color: #64748B;">Subtotal</td>
                  <td class="tx-navy" style="padding: 4px 0; text-align: right; font-family: ${fontStack}; font-size: 13px; font-weight: 600; color: #091E33;">&#8377;${order.pricing.subtotal.toFixed(2)}</td>
                </tr>
                ${order.pricing.discount > 0
      ? `<tr>
                  <td class="tx-green" style="padding: 4px 0; font-family: ${fontStack}; font-size: 13px; color: #059669;">Discount</td>
                  <td class="tx-green" style="padding: 4px 0; text-align: right; font-family: ${fontStack}; font-size: 13px; font-weight: 600; color: #059669;">-&#8377;${order.pricing.discount.toFixed(2)}</td>
                </tr>`
      : ""
    }
                <tr>
                  <td class="tx-muted" style="padding: 4px 0; font-family: ${fontStack}; font-size: 13px; color: #64748B;">Shipping</td>
                  <td class="tx-navy" style="padding: 4px 0; text-align: right; font-family: ${fontStack}; font-size: 13px; font-weight: 600; color: #091E33;">&#8377;${(Number(order.pricing.shipping) || 0).toFixed(2)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Double rule + total, like a register tape -->
          <tr>
            <td class="tr-card" bgcolor="#FAF7F2" style="padding: 14px 36px 0; background-color: #FAF7F2;">
              <div class="bd-navy" style="border-top: 3px double #091E33;"></div>
            </td>
          </tr>
          <tr>
            <td class="tr-card" bgcolor="#FAF7F2" style="padding: 12px 36px 0; background-color: #FAF7F2;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td class="tx-navy" style="font-family: ${fontStack}; font-size: 15px; font-weight: 800; color: #091E33; text-transform: uppercase; letter-spacing: 1px;">Total Paid</td>
                  <td class="tx-navy" style="text-align: right; font-family: ${fontStack}; font-size: 22px; font-weight: 800; color: #091E33;">&#8377;${order.pricing.total.toFixed(2)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Dashed rule -->
          <tr><td class="tr-card" bgcolor="#FAF7F2" style="padding: 20px 36px 0; background-color: #FAF7F2;"><div class="bd-dash" style="border-top: 1px dashed #C9C2B4;"></div></td></tr>

          <!-- Delivery address -->
          <tr>
            <td class="tr-card" bgcolor="#FAF7F2" style="padding: 16px 36px 0; background-color: #FAF7F2;">
              <p class="tx-label" style="margin: 0 0 6px; font-family: ${fontStack}; font-size: 10px; font-weight: 800; color: #8A8578; text-transform: uppercase; letter-spacing: 2px;">Delivering To</p>
              <p class="tx-navy" style="margin: 0; font-family: ${fontStack}; font-size: 14px; font-weight: 700; color: #091E33;">${order.customerName}</p>
              <p style="margin: 4px 0 0; font-family: ${fontStack}; font-size: 13px; color: #475569; line-height: 1.5;">
                ${order.shippingAddress.street}<br>
                ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}<br>
                ${order.shippingAddress.country}
              </p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td class="tr-card" bgcolor="#FAF7F2" style="padding: 26px 36px 8px; text-align: center; background-color: #FAF7F2;">
              <a href="${BASE_URL}/shop" target="_blank" class="tr-navy tx-cream" style="display: inline-block; background-color: #091E33; color: #FAF7F2; font-family: ${fontStack}; font-size: 13px; font-weight: 700; text-decoration: none; padding: 13px 34px; letter-spacing: 0.5px;">
                Continue Shopping &rarr;
              </a>
            </td>
          </tr>

          <!-- Dotted rule -->
          <tr><td class="tr-card" bgcolor="#FAF7F2" style="padding: 20px 36px 0; background-color: #FAF7F2;"><div class="bd-dash" style="border-top: 1px dotted #C9C2B4;"></div></td></tr>

          <!-- Footer / dark stub, like the bottom of a receipt -->
          <tr>
            <td class="tr-navy" bgcolor="#091E33" style="background-color: #091E33; padding: 26px 36px; text-align: center;">
              <a href="${BASE_URL}" target="_blank" style="text-decoration: none; display: inline-block;">
                <img src="cid:tangent-logo-white" alt="Tangent" width="110" style="display: block; width: 110px; height: auto; border: 0; outline: none; margin: 0 auto;" />
              </a>
              <p class="tx-cream-60" style="margin: 10px 0 0; font-family: ${fontStack}; font-size: 11px; color: rgba(250, 247, 242, 0.6); line-height: 1.6;">
                Stay Sharp. Stay Tangent.
              </p>
              <p class="tx-cream-45" style="margin: 16px 0 0; font-family: ${fontStack}; font-size: 10px; letter-spacing: 2px; color: rgba(250, 247, 242, 0.45);">#${order.orderNumber}</p>
              <p class="tx-cream-35" style="margin: 14px 0 0; font-family: ${fontStack}; font-size: 10px; color: rgba(250, 247, 242, 0.35);">
                &copy; ${new Date().getFullYear()} Tangent Energy Pvt Ltd. All rights reserved.
              </p>
            </td>
          </tr>

          ${tornEdge(true)}

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendOrderConfirmationEmail(order: OrderEmailData) {
  try {
    const html = buildReceiptHTML(order);

    // Read local logo files and base64-encode them for inline CID attachments
    const publicDir = path.join(process.cwd(), "public");
    const logoBase64 = fs.readFileSync(path.join(publicDir, "tangent-logo.png")).toString("base64");
    const logoWhiteBase64 = fs.readFileSync(path.join(publicDir, "tangent-logo-white.png")).toString("base64");

    const attachments = [
      {
        filename: "tangent-logo.png",
        content: logoBase64,
        contentId: "tangent-logo", // camelCase — this is the field the Node SDK actually reads
      },
      {
        filename: "tangent-logo-white.png",
        content: logoWhiteBase64,
        contentId: "tangent-logo-white",
      },
    ];

    const { data, error } = await resend.emails.send({
      from: "Tangent <onboarding@tangentfnb.com>",
      to: [order.customerEmail],
      subject: `Order Confirmed! 🎉 Your Tangent Order #${order.orderNumber}`,
      html,
      attachments,
    });

    if (error) {
      console.error("Resend email error:", error);
      return { success: false, error };
    }

    console.log("Order confirmation email sent:", data?.id);
    return { success: true, emailId: data?.id };
  } catch (err) {
    console.error("Failed to send order confirmation email:", err);
    return { success: false, error: err };
  }
}