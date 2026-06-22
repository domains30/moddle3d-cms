import type { CollectionConfig } from "payload";

import { renderOrderCompletedEmail } from "../emails/orderCompleted";

export const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    useAsTitle: "orderNumber",
  },
  access: {
    read: () => true,
    create: () => true,
    update: ({ req }) => req.user?.role === "admin",
    delete: ({ req }) => req.user?.role === "admin",
  },
  fields: [
    {
      name: "orderNumber",
      type: "text",
      label: "Order Number",
      unique: true,
    },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: false,
    },
    {
      name: "items",
      type: "array",
      label: "Ordered Items",
      fields: [
        {
          name: "product",
          type: "relationship",
          relationTo: "products",
          required: false,
        },
        {
          name: "quantity",
          type: "number",
          required: false,
          min: 1,
        },
        {
          name: "price",
          type: "number",
          required: false,
        },
        {
          name: "file_name",
          type: "text",
          required: false,
        },
        {
          name: "file_url",
          type: "text",
          required: false,
        },
      ],
    },
    {
      name: "total",
      type: "number",
      label: "Total Amount",
      required: true,
    },
    {
      name: "currency",
      type: "select",
      label: "Currency",
      options: [
        { label: "EUR", value: "EUR" },
        { label: "USD", value: "USD" },
        { label: "GBP", value: "GBP" },
        { label: "CAD", value: "CAD" },
        { label: "AUD", value: "AUD" },
      ],
      defaultValue: "EUR",
      required: false,
    },
    {
      name: "status",
      type: "select",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Processing", value: "processing" },
        { label: "Completed", value: "completed" },
        { label: "Cancelled", value: "cancelled" },
      ],
      defaultValue: "pending",
      required: true,
    },
    {
      name: "paymentMethod",
      type: "text",
      label: "Payment method",
      required: false,
    },
    {
      name: "orderNotes",
      type: "text",
      label: "Order Notes",
      required: false,
    },
    {
      name: "billingAddress",
      type: "group",
      fields: [
        { name: "address1", type: "text", required: false },
        { name: "address2", type: "text", required: false },
        { name: "city", type: "text", required: false },
        { name: "state", type: "text", required: false },
        { name: "zip", type: "text", required: false },
        { name: "country", type: "text", required: false },
      ],
    },
    {
      name: "createdAt",
      type: "date",
      admin: {
        position: "sidebar",
      },
      defaultValue: () => new Date().toISOString(),
    },
    {
      name: "invoice",
      type: "upload",
      relationTo: "media",
      label: "Invoice file",
      required: false,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "files",
      type: "upload",
      relationTo: "media",
      label: "Files",
      required: false,
      admin: {
        position: "sidebar",
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation === "create") {
          const result = await req.payload.find({
            collection: "orders",
            limit: 1,
            sort: "-createdAt",
          });

          const lastOrderNumber = result.docs.length
            ? parseInt(
                (result.docs[0].orderNumber ?? "MDL_100").replace("MDL_", ""),
                10,
              )
            : 100;

          data.orderNumber = `MDL_${lastOrderNumber + 1}`;
        }
        return data;
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        const becameCompleted =
          doc.status === "completed" && previousDoc?.status !== "completed";

        if (!becameCompleted) return doc;

        // Resolve the user (may be an ID or a populated object).
        let user = doc.user;
        if (user && typeof user !== "object") {
          try {
            user = await req.payload.findByID({
              collection: "users",
              id: user,
            });
          } catch {
            user = null;
          }
        }

        const to = user && typeof user === "object" ? user.email : null;
        if (!to) {
          req.payload.logger.warn(
            `Order ${doc.orderNumber} marked completed but has no user email to notify.`,
          );
          return doc;
        }

        const clientName =
          [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
          user.username ||
          "there";

        // Collect every downloadable file: per-item links + order-level upload.
        const downloads: { name: string; url: string }[] = [];

        for (const item of doc.items ?? []) {
          if (item?.file_url) {
            downloads.push({
              name: item.file_name || "File",
              url: item.file_url,
            });
          }
        }

        let files = doc.files;
        if (files && typeof files !== "object") {
          try {
            files = await req.payload.findByID({
              collection: "media",
              id: files,
            });
          } catch {
            files = null;
          }
        }
        if (files && typeof files === "object" && files.url) {
          downloads.push({
            name: files.filename || "File",
            url: files.url,
          });
        }

        try {
          await req.payload.sendEmail({
            to,
            subject: `Your Moddle 3D Order is Ready for Download – ${doc.orderNumber}`,
            html: renderOrderCompletedEmail({
              orderNumber: doc.orderNumber ?? "",
              clientName,
              downloads,
            }),
          });
        } catch (error) {
          req.payload.logger.error(
            `Failed to send order completion email for ${doc.orderNumber}: ${error}`,
          );
        }

        return doc;
      },
    ],
  },
};

export default Orders;
