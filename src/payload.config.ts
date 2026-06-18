// storage-adapter-import-placeholder
import { postgresAdapter } from "@payloadcms/db-postgres";
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";
import nodemailerSendgrid from "nodemailer-sendgrid";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Categories } from "./collections/Categories";
import { Trends } from "./collections/Trends";
import { Policies } from "./collections/Policies";
import { Products } from "./collections/Products";
import { PricingCategories } from "./collections/PricingCategories";
import { PricingPackages } from "./collections/PricingPackages";
import { Orders } from "./collections/Orders";

import { s3Storage } from "@payloadcms/storage-s3";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";

import { deeplTranslatorPlugin } from "./deepl-translator";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Orders,
    Products,
    Categories,
    Media,
    Trends,
    Policies,
    PricingCategories,
    PricingPackages,
    Users,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  localization: {
    locales: ["en", "de", "it", "pl"],
    defaultLocale: "en",
  },
  cors: {
    origins: [`${process.env.LOCAL_FRONT_URL}`, `${process.env.WEB_FRONT_URL}`],
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
  }),
  sharp,
  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: "media",
        },
      },
      bucket: process.env.S3_BUCKET || "",
      config: {
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
        },
        region: process.env.S3_REGION || "",
        endpoint: process.env.S3_ENDPOINT || "",
      },
    }),
    deeplTranslatorPlugin({
      enabled: true,
      fallbackLocales: ["de", "it", "pl"],
      collections: {
        policies: {
          fields: ["title", "content"],
        },
        products: {
          fields: ["title", "content", "excerpt"],
        },
        categories: {
          fields: ["title", "subtitle", "description"],
        },
        "pricing-categories": {
          fields: ["title", "description"],
        },
        "pricing-packages": {
          fields: ["title", "description", "includes", "button_text"],
        },
        trends: {
          fields: ["title", "content", "excerpt"],
        },
      },
    }),
  ],
  email: nodemailerAdapter({
    defaultFromName: "Moddle 3D",
    defaultFromAddress: "info@moddle3d.com",
    transportOptions: nodemailerSendgrid({
      apiKey: process.env.SENDGRID_API_KEY ?? "",
    }),
  }),
});
