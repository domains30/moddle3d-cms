import type { CollectionConfig, PayloadRequest } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    forgotPassword: {
      generateEmailHTML: (args?: { token?: string }) => {
        const resetLink = `${process.env.WEB_FRONT_URL}/forgot-password?token=${args?.token}`

        return `
          <div style="font-family: sans-serif; line-height: 1.5;">
            <h2>Password Reset Request</h2>
            <p>You requested a password reset. Click the button below to reset your password.</p>
            <p><a href="${resetLink}" style="display: inline-block; background-color: white; color: black; padding: 16px 24px; text-decoration: none; border: 1px solid black;">Reset Password</a></p>
            <p>If you didn’t request this, just ignore this email.</p>
          </div>
        `
      },
    },
  },
  access: {
    /*read: function (args: { req: PayloadRequest }) {
      return args.req.user?.role === 'admin'
    },*/
    read: () => true,
    create: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      label: 'Current email',
      required: true,
      unique: true,
      admin: {
        description:
          'The email the customer currently uses to log in. Updates automatically when they change it in their account.',
      },
    },
    {
      name: 'registrationEmail',
      type: 'email',
      label: 'Email at registration',
      admin: {
        readOnly: true,
        description:
          'The original email captured at registration — the address that received the welcome / credentials email. Never changes.',
      },
    },
    {
      name: 'firstName',
      type: 'text',
      label: 'First Name',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      label: 'Last Name',
      required: true,
    },
    {
      name: 'username',
      type: 'text',
      label: 'Username',
      required: false,
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone',
      required: false,
    },
    {
      name: 'address1',
      type: 'text',
      label: 'Address line 1',
      required: false,
    },
    {
      name: 'address2',
      type: 'textarea',
      label: 'Address line 2',
      required: false,
    },
    {
      name: 'city',
      type: 'text',
      label: 'City',
      required: false,
    },
    {
      name: 'state',
      type: 'text',
      label: 'State',
      required: false,
    },
    {
      name: 'zip',
      type: 'text',
      label: 'Zip Code',
      required: false,
    },
    {
      name: 'country',
      type: 'text',
      label: 'Country',
      required: false,
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Customer', value: 'customer' },
      ],
      defaultValue: 'customer',
      required: true,
    },
    {
      name: 'emailHistory',
      type: 'array',
      label: 'Email change log',
      admin: {
        readOnly: true,
        initCollapsed: true,
        description: 'Record of every email change the customer made in their account.',
      },
      fields: [
        {
          name: 'previousEmail',
          type: 'email',
          label: 'Previous email',
        },
        {
          name: 'changedAt',
          type: 'date',
          label: 'Changed at',
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation, originalDoc }) => {
        // Capture the registration email once, when the account is first created.
        if (operation === 'create') {
          if (!data.registrationEmail) {
            data.registrationEmail = data.email
          }
        }

        // When the customer changes their email, keep the registration email
        // intact and log the previous address.
        if (operation === 'update' && originalDoc && data.email && data.email !== originalDoc.email) {
          if (!data.registrationEmail) {
            data.registrationEmail = originalDoc.registrationEmail || originalDoc.email
          }

          const history = Array.isArray(originalDoc.emailHistory) ? originalDoc.emailHistory : []
          data.emailHistory = [
            ...history,
            {
              previousEmail: originalDoc.email,
              changedAt: new Date().toISOString(),
            },
          ]
        }

        return data
      },
    ],
  },
}
