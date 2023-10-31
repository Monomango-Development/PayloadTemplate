
import { FieldAccess } from "payload/types";

export const publicVisibile:FieldAccess = function (args){
    return true
}

export const isAuthenticated:FieldAccess = function (args){
    const {req : {user}} = args;
    return Boolean( user )
}

export const isAdmin:FieldAccess = function (args){
    const {req : {user}} = args;
    return user.role.includes("Admin")
}

export const isOwner:FieldAccess = function (args){
    const {req : {user}} = args
    const { data : {owner} } = args
    return user == owner.value
}

export const isAdminOrOwner:FieldAccess = function (args){
    return isAdmin( args ) || isOwner ( args )
}