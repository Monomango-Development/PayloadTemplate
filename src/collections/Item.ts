import { CollectionConfig } from 'payload/types'
import { isAuthenticated, isOwner } from '../access/collection/User'

import { manyToOne } from './utils/Relation'
import Parent from './Parent'

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
    manyToOne({
      "source" : "item",
      "sourceFieldArguments" : {
        "required" : true
      },
      "target" : Parent
    }),

    {
      "name" : "name",
      "type" : "text"
    }
  ]
}

export default Item
