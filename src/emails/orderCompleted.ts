type DownloadFile = {
  name: string;
  url: string;
};

type OrderCompletedEmailArgs = {
  orderNumber: string;
  clientName: string;
  downloads: DownloadFile[];
};

const COLORS = {
  page: "#121316",
  card: "#141517",
  cardBorder: "#222325",
  downloadBox: "#191a1c",
  accent: "#2583ff",
  white: "#ffffff",
  muted: "#717173",
  footer: "#b3b3b5",
};

const FONT_STACK =
  "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const downloadButton = (file: DownloadFile): string => `
  <a href="${file.url}" target="_blank" rel="noopener" style="display:inline-block;background-color:${COLORS.accent};color:${COLORS.white};font-family:${FONT_STACK};font-size:16px;font-weight:500;text-decoration:none;padding:16px 32px;border-radius:24px;">
    &#8595;&nbsp;&nbsp;Download${file.name ? ` &mdash; ${file.name}` : ""}
  </a>`;

export const renderOrderCompletedEmail = ({
  orderNumber,
  clientName,
  downloads,
}: OrderCompletedEmailArgs): string => {
  const buttons = downloads.length
    ? downloads
        .map(
          (file) => `
            <tr>
              <td align="center" style="padding-top:8px;padding-bottom:8px;">
                ${downloadButton(file)}
              </td>
            </tr>`,
        )
        .join("")
    : `
        <tr>
          <td align="center" style="font-family:${FONT_STACK};font-size:16px;color:${COLORS.muted};">
            Your files will be shared with you shortly.
          </td>
        </tr>`;

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="dark" />
    <title>Your Moddle 3D Order is Ready for Download</title>
  </head>
  <body style="margin:0;padding:0;background-color:${COLORS.page};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.page};">
      <tr>
        <td align="center" style="padding:24px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:595px;width:100%;">
            <!-- Header -->
            <tr>
              <td style="padding:16px 8px 24px 8px;font-family:${FONT_STACK};font-size:20px;font-weight:700;color:${COLORS.white};">
                Moddle 3D
              </td>
            </tr>
            <!-- Card -->
            <tr>
              <td style="background-color:${COLORS.card};border:1px solid ${COLORS.cardBorder};border-radius:24px;padding:24px;">
                <p style="margin:0 0 24px 0;font-family:${FONT_STACK};font-size:24px;line-height:1.3;font-weight:700;color:${COLORS.white};">
                  Your Moddle 3D Order is Ready for Download &ndash; <span style="color:${COLORS.accent};">${orderNumber}</span>
                </p>

                <p style="margin:0 0 16px 0;font-family:${FONT_STACK};font-size:16px;line-height:1.5;font-weight:500;color:${COLORS.muted};">
                  Dear ${clientName},
                </p>
                <p style="margin:0 0 24px 0;font-family:${FONT_STACK};font-size:16px;line-height:1.5;font-weight:500;color:${COLORS.muted};">
                  Your order is all set and waiting for you! Your files are ready to be downloaded &mdash; just click below and enjoy the magic!
                </p>

                <!-- Download box -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.downloadBox};border-radius:12px;">
                  <tr>
                    <td style="padding:24px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding-bottom:16px;font-family:${FONT_STACK};font-size:20px;font-weight:600;color:${COLORS.white};">
                            Download Your Files Here
                          </td>
                        </tr>
                        ${buttons}
                      </table>
                    </td>
                  </tr>
                </table>

                <p style="margin:24px 0 16px 0;font-family:${FONT_STACK};font-size:16px;line-height:1.5;font-weight:500;color:${COLORS.muted};">
                  If you have any issues accessing your files or need assistance, just give us a shout. We&rsquo;re here for you!
                </p>
                <p style="margin:0 0 24px 0;font-family:${FONT_STACK};font-size:16px;line-height:1.5;font-weight:500;color:${COLORS.muted};">
                  Thanks so much for choosing Moddle 3D. We can&rsquo;t wait to see what you do with your new designs!
                </p>

                <p style="margin:0;font-family:${FONT_STACK};font-size:20px;line-height:1.4;font-weight:600;color:${COLORS.white};">
                  Best,<br />
                  <span style="color:${COLORS.accent};">The Moddle 3D Team</span>
                </p>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="padding:24px 8px;font-family:${FONT_STACK};font-size:14px;font-weight:500;color:${COLORS.footer};">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="color:${COLORS.footer};">
                      info@moddle3d.com&nbsp;&nbsp;&nbsp;&nbsp;+1 000 000 000
                    </td>
                    <td align="right" style="font-size:16px;font-weight:700;color:${COLORS.white};">
                      Moddle 3D
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

export default renderOrderCompletedEmail;
