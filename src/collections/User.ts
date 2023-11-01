import { CollectionConfig } from 'payload/types'
import { isAdmin as isFieldAdmin } from '../access/field/User'
import { isAdminOrOwner, isAuthenticated } from "../access/collection/User"

const User: CollectionConfig = {
  slug: 'user',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access : {
    create : isAdminOrOwner,
    delete : isAdminOrOwner,
    update : isAdminOrOwner,
    read : isAuthenticated
  },
  fields: [
    {
      name : "role",
      type : "select",
      options : ["Admin", "Moderator", "User"],
      defaultValue : "User",
      saveToJWT : true,
      access : {
        "update" : isFieldAdmin
      },
      admin : {
        isClearable : false
      }
    },
    // Email added by default
    // Add more fields as needed
  ],
}

export default User
