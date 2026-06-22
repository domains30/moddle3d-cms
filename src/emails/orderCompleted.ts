import { htmlTemplate } from "./html-template";
import { emailStyle, moddleEmailFooter } from "./shared";

type DownloadFile = {
  name: string;
  url: string;
};

type OrderCompletedArgs = {
  orderNumber: string;
  clientName: string;
  downloads: DownloadFile[];
};

const downloadButton = ({ name, url }: DownloadFile) => `
  <a href="${url}" target="_blank" rel="noopener" style="display: inline-block; background: #2583FF; color: #fff; padding: 16px 32px; border-radius: 24px; text-decoration: none; font-weight: 500; font-size: 16px;">
    &#8595;&nbsp;&nbsp;Download${name ? ` &ndash; ${name}` : ""}
  </a>`;

export const orderCompletedBody = ({
  orderNumber,
  clientName,
  downloads,
}: OrderCompletedArgs) => {
  const buttons = downloads.length
    ? downloads
        .map(
          (file) =>
            `<p style="margin: 0 0 16px; text-align: center;">${downloadButton(file)}</p>`,
        )
        .join("")
    : `<p class="text" style="text-align: center; margin: 0;">Your files will be shared with you shortly.</p>`;

  return htmlTemplate({
    style: emailStyle,
    body: `
      <div style="width: 595px; margin: 0 auto;">
        <img style="display:block; border:0; outline:none; text-decoration:none; font-size:0; line-height:0;" src="https://moddle3d.com/images/email/header.png" alt="Moddle 3D" width="595" height="100" />
        <div class="wrapper">
          <div class="main">
            <p style="font-size: 24px; color: #fff; margin-bottom: 24px; font-weight: 600;">Your Moddle 3D Order is Ready for Download &ndash; <span style="color: #2583FF;">${orderNumber}</span></p>
            <p class="text" style="color: #717173; margin-bottom: 16px;">Dear ${clientName},</p>
            <p class="text" style="color: #717173; margin-bottom: 24px;">Your order is all set and waiting for you! Your files are ready to be downloaded &mdash; just click below and enjoy the magic!</p>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-bottom: 24px;">
              <tr>
                <td style="background: #191A1C; padding: 24px; border-radius: 12px;">
                  <p style="color: #fff; font-size: 20px; font-weight: 600; text-align: center; margin: 0 0 24px;">Download Your Files Here</p>
                  ${buttons}
                </td>
              </tr>
            </table>
            <p class="text" style="color: #717173; margin-bottom: 16px;">If you have any issues accessing your files or need assistance, just give us a shout. We&rsquo;re here for you!</p>
            <p class="text" style="color: #717173; margin-bottom: 24px;">Thanks so much for choosing Moddle 3D. We can&rsquo;t wait to see what you do with your new designs!</p>
            <p style="color: #fff; font-size: 20px; font-weight: 600; margin: 0;">Best, <br /><span style="color: #2583FF;">The Moddle 3D Team</span></p>
          </div>
        </div>
        ${moddleEmailFooter}
      </div>
    `,
  });
};

export default orderCompletedBody;
