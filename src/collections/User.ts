import { CollectionConfig } from 'payload/types'

const User: CollectionConfig = {
  slug: 'user',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name : "role",
      type : "select",
      options : ["Admin", "Moderator", "User"],
      defaultValue : "User",
      saveToJWT : true,
      admin : {
        isClearable : false
      }
    },
    // Email added by default
    // Add more fields as needed
  ],
}

export default User
