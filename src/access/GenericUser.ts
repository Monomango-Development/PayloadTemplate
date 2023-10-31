import { AccessArgs, AccessResult} from "payload/config"
import { Or } from "./Utils";

export function publicVisibile(args:AccessArgs) : AccessResult {
    return true
}

export function isAuthenticated (args:AccessArgs) : AccessResult {
    const {req : {user}} = args;
    return Boolean( user )
}

export function isAdmin (args:AccessArgs) : AccessResult {
    const {req : {user}} = args;
    return user.role.includes("Admin")
}

export function isOwner (args:AccessArgs) :AccessResult {
    const {req : {user}} = args
    const queryObject =  {owner : {equals : user.id} }
    return queryObject
}
export function isAdminOrOwner( args:AccessArgs ) : AccessResult {
    return Or( args, [
        isOwner, isAdmin
    ])
}