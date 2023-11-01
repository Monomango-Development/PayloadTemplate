import { CollectionConfig } from 'payload/types'
import { isAuthenticated, isOwner } from '../access/collection/User'

const Parent: CollectionConfig = {
  slug: 'parent',
  admin: {
    useAsTitle: 'email',
  },
  access : {
    "create" : isAuthenticated,
    "delete" : isOwner,
    "read"   : isAuthenticated,
    "update" : isOwner,
  },
  fields: [
    {
      "name" : "name",
      "type" : "text"
    }
  ]
}

export default Parent
