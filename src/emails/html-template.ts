export const htmlTemplate = ({
  body,
  style = "",
}: {
  body: string;
  style?: string;
}) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="dark" />
    <style>
      body {
        margin: 0;
        padding: 0;
        background: #121316;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      }
      img { border: 0; outline: none; text-decoration: none; }
      a { text-decoration: none; }
      ${style}
    </style>
  </head>
  <body>
    ${body}
  </body>
</html>`;

export default htmlTemplate;
