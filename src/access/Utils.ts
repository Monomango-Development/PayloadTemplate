import { Access, AccessArgs, } from "payload/config"

export function Or(args: AccessArgs, rules:Array<Access>):any {
    const potential_queries = [];
    for (let entry of rules) {
        const result = entry(args);
        if (result === true) {
            return true
        }
        if (result instanceof Object) {
            potential_queries.push( result );
        }
    }
    if ( potential_queries.length) {
        return {
                "or" : potential_queries
        }
    }
    return false
}

export function And(args: AccessArgs, rules:Array<Access>):any {
    const potential_queries = [];
    for (let entry of rules) {
        const result = entry(args);
        if (result === false) {
            return false
        }
        if (result instanceof Object) {
            potential_queries.push( result );
        }
    }
    if ( potential_queries.length) {
        return {
                "and" : potential_queries
        }
    }
    return false
}