import AWS from "aws-sdk";
import {
  CognitoUserAttribute,
  CognitoUserPool
} from "amazon-cognito-identity-js";
import { DynamoDB } from "aws-sdk/index";

export const poolData = {
  UserPoolId: process.env.REACT_APP_Auth_UserPoolId,
  ClientId: process.env.REACT_APP_Auth_ClientId
};


export const dynamoDB = new DynamoDB({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});
