import { FieldAccess, FieldHookArgs, RelationshipField } from "payload/dist/fields/config/types";
import { CollectionConfig, Field } from "payload/types";

type Slug = string;

type ReadOnlyFieldAccessSettings  = {
    read?   : FieldAccess;
}

type FieldAccessSettings = {
    create? : FieldAccess;
    read?   : FieldAccess;
    update?: FieldAccess; 
}

type Partial<T> = {
    [P in keyof T]?: T[P];
  };

  
type relationshipArguments = {
    source                  : Slug //This Config!
    target                  : CollectionConfig //The Collection pointing to many of this!
    prefix?                 : string
    sourceAccess?           : FieldAccessSettings
    targetAccess?           : ReadOnlyFieldAccessSettings
    sourceFieldArguments?   : Partial<RelationshipField>
    targetFieldArguments?   : Partial<RelationshipField>
}

const defaultRelationshipArguments : Partial<relationshipArguments> = {
    prefix                  : "",
    sourceFieldArguments    : {},
    targetFieldArguments    : {}
}


export function manyToOne( args:relationshipArguments) : Field {
    const { prefix, source, target, 
        sourceAccess, targetAccess, 
        sourceFieldArguments, targetFieldArguments} = {...args, ...defaultRelationshipArguments}

    const sourceField:RelationshipField = {
            ...sourceFieldArguments,
            name        : `${prefix}${target.slug}`,
            type        : "relationship",
            relationTo  : target.slug,
            hasMany     : false,
            access      : sourceAccess,
            
            //OK; WHAT THE CRAP? Why does this need to be here? Why this for? This partial businnes is, lets say, interresting -.-
            max         : undefined,
            maxRows     : undefined,
            min         : undefined,
            minRows     : undefined
    }

    const targetField:RelationshipField = {
        ...targetFieldArguments,
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
export function oneToOne( args:relationshipArguments) : Field {
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