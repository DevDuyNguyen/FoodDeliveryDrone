import jwt from "jsonwebtoken";
import type {Request, Response, NextFunction} from "express"
import type FlexibleObject from "../interfaces/FlexibleObject";

import Account from "../modules/accesscontrol/models/account"
// const Account =require("../modules/accesscontrol/models/account");

const verifyToken = (req:Request, res:Response) => {

  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error:FlexibleObject = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }

  const token = authHeader.split(" ")[1]!;
  let decodedToken:FlexibleObject;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY!) as jwt.JwtPayload;
  } catch (err) {
    let error=err as FlexibleObject;
    error.statusCode = 500;
    throw error;
  }
  if (!decodedToken) {
    const error:FlexibleObject = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }

  return decodedToken.accountId;
};

exports.verifySeller =(req:(Request&FlexibleObject), res:Response, next:NextFunction) => {
  const accountId = verifyToken(req, res);
  Account.findById(accountId)
    .then((account) => {
      if (!account) {
        const error:FlexibleObject = new Error("Internal server error");
        error.statusCode = 500;
        throw error;
      }
      if (account.role !== "ROLE_SELLER") {
        const error:FlexibleObject = new Error("Forbidden Access");
        error.statusCode = 403;
        throw error;
      }
      req.loggedInUserId = accountId;
      next();
    })
    .catch((err) => {
      const error=err as FlexibleObject
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.verifyUser = (req:(Request&FlexibleObject), res:Response, next:NextFunction) => {
  const accountId = verifyToken(req, res);
  Account.findById(accountId)
    .then((account) => {
      if (!account) {
        const error:FlexibleObject = new Error("Internal server error");
        error.statusCode = 500;
        throw error;
      }
      if (account.role !== "ROLE_USER") {
        const error:FlexibleObject = new Error("Forbidden Access");
        error.statusCode = 403;
        throw error;
      }
      req.loggedInUserId = accountId;
      next();
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};
