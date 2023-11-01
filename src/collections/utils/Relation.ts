import { FieldAccess, FieldHookArgs } from "payload/dist/fields/config/types";
import { Access, CollectionConfig, Field } from "payload/types";

type Slug = string;

type ReadOnlyFieldAccessSettings  = {
    read?   : FieldAccess;
    //create? : FieldAccess;    //Setting the value needs to be done on source-field!
    //update?: Access;          //Changes need to be made on Source
}

type FieldAccessSettings = {
    create? : FieldAccess;
    read?   : FieldAccess;
    update?: FieldAccess; 
}

type relationshipArguments = {
    source : Slug //This Config!
    target : CollectionConfig //The Collection pointing to many of this!
    prefix?: string
    sourceAccess? : FieldAccessSettings
    targetAccess? : ReadOnlyFieldAccessSettings
}

export function manyToOne( args:relationshipArguments) : Field {
    const {prefix, source, target, sourceAccess, targetAccess} = args

    const sourceField:Field = {
        name : `${prefix}${target.slug}`,
        type : "relationship",
        relationTo : target.slug,
        hasMany : false,
        access : sourceAccess
    }

    const targetField:Field = {
        name : `${prefix}${source}s`,
        type : "relationship",
        relationTo : source,
        hasMany : true,
        access : {
            ...targetAccess,
            update : (args) => false,
            create : (args) => false,
        },
        hooks : {
            afterRead : [
                (args) => findChildren(source, `${prefix}${target.slug}`, args)
            ]
        }
    }
    target.fields.push( targetField );
    return sourceField
}
export function onToOne( args:relationshipArguments) : Field {
    const {prefix, source, target, sourceAccess, targetAccess} = args

    const sourceField:Field = {
        name : `${prefix}${target.slug}`,
        type : "relationship",
        relationTo : target.slug,
        hasMany : false,
        access : sourceAccess
    }

    const targetField:Field = {
        name : `${prefix}${source}`,
        type : "relationship",
        relationTo : source,
        hasMany : false,
        access : {
            ...targetAccess,
            update : (args) => false,
            create : (args) => false,
        },
        hooks : {
            afterRead : [
                (args) => findOne(source, `${prefix}${target.slug}`, args)
            ]
        }
    }
    target.fields.push( targetField );
    return sourceField
}
async function findChildren( target:Slug, targetFieldName:string, {originalDoc, req }:FieldHookArgs) {
    const {payload} = req;
    const query_config = {
      collection : target,
      depth : 0,
      where : { [targetFieldName] : { equals : originalDoc.id } } 
    }
    const children = await payload.find(query_config)
    return children.docs.map(item => item.id);
}
async function findOne( target:Slug, targetFieldName:string, {originalDoc, req }:FieldHookArgs) {
    const {payload} = req;
    const query_config = {
      collection : target,
      depth : 0,
      limit: 1,
      where : { [targetFieldName] : { equals : originalDoc.id } } 
    }
    const children = await payload.find(query_config)
    return children.pagingCounter ? children.docs.map(item => item.id)[0] : null;
}