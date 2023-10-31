import { CollectionConfig } from 'payload/types'
import { isAuthenticated, isOwner } from '../access/GenericUser'

const Item: CollectionConfig = {
  slug: 'item',
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

export default Item
