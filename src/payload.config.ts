import path from 'path'

import { payloadCloud } from '@payloadcms/plugin-cloud'
import { mongooseAdapter } from '@payloadcms/db-mongodb' // database-adapter-import
import { webpackBundler } from '@payloadcms/bundler-webpack' // bundler-import
import { slateEditor } from '@payloadcms/richtext-slate' // editor-import
import { buildConfig } from 'payload/config'

import { addAuthorFields } from '@boomworks/payload-plugin-author-fields';

import User from './collections/User'
import Item from "./collections/Item"
import Parent from './collections/Parent'

export default buildConfig({
  collections: [User, Item, Parent],
  admin: {
    user: User.slug,
    bundler: webpackBundler(), // bundler-config
  },
  editor: slateEditor({}), // editor-config
  
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  plugins: [
    payloadCloud(), 
    addAuthorFields({ 
      excludedCollections:[ User.slug ], 
      //"createdByFieldName" : "owner" // TO be implemented. For bughunting should stay as it is.
    }
    ),
  ],

  // database-adapter-config-start
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
  // database-adapter-config-end
})
