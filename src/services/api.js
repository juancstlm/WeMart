import AWS from "aws-sdk";
import {
  CognitoUserAttribute,
  CognitoUserPool
} from "amazon-cognito-identity-js";
import { DynamoDB } from "aws-sdk";
import { Marshaller } from "@aws/dynamodb-auto-marshaller";

const marshaller = new Marshaller({ unwrapNumbers: true });

const params = {
  TableName: "department"
};
const dotenv = require("dotenv");

export const poolData = {
  UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
  ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID
};

export const dynamoDB = new DynamoDB({
  region: process.env.REACT_APP_AWS_REGION,
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
  }
});

// Unmarshalls an object from a DynamoDB instance
const unmarshallObject = object => {
  let unmarshalledObject = {};
  for (let key in object) {
    if (object.hasOwnProperty(key)) {
      unmarshalledObject[key] = marshaller.unmarshallValue(object[key]);
    }
  }
  return unmarshalledObject;
};


// Gets the data list of current departments
export const getDepartments = (onSuccess, onFail) => {
  return new Promise((resolve, reject) => {
    dynamoDB.scan(params, (err, data) => {
      if (err) {
        reject(null);
      } else {
        let unmarshalledData = data.Items.map(item => {
          return unmarshallObject(item);
        });

        console.log("unmarshalledData: ", unmarshalledData);
        resolve(unmarshalledData);
      }
    });
  });
};

// export const getDepartments = () => {
//   return async data => {
//     dynamoDB.scan(
//       {
//         TableName: "department"
//       },
//       (err, data) => {
//         if (err) {
//           alert(JSON.stringify(err));
//           return null;
//         } else {
//           return data.Items;
//         }
//       }
//     );
//   };
// };
