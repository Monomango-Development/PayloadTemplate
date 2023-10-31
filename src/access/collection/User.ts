import { Access } from "payload/config"
import { Or, And } from "../Utils";

export const publicVisibile:Access = function (args){
    return true
}

export const isAuthenticated:Access = function (args){
    const {req : {user}} = args;
    return Boolean( user )
}

export const isAdmin:Access = function (args){
    const {req : {user}} = args;
    return user.role.includes("Admin")
}

export const isOwner:Access = function (args){
    const {req : {user}} = args
    return {"createdBy.value" : {"equals" : user.id} } 
}

export const isAdminOrOwner:Access = function (args){
    return Or( args, [
        isOwner, isAdmin
    ])
}