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

const savingItemsParams = {
  ExpressionAttributeValues: {
    ":s": {
      N: "0"
    }
  },
  FilterExpression: "sale <> :s",
  TableName: "item"
};

const ITEM_SEARCH_PARAMS = {
  TableName: "item"
};

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

// Queries the DynamoDB for all the items in a department.
export const getDepartmentItems = department => {
  const DEPARTMENT_QUERRY_PARAMS = {
    ExpressionAttributeValues: {
      ":d": {
        S: department
      }
    },
    FilterExpression: "department = :d",
    TableName: "item"
  };
  return new Promise((resolve, reject) => {
    dynamoDB.scan(DEPARTMENT_QUERRY_PARAMS, function(err, data) {
      if (err) {
        console.log(JSON.stringify(err));
        reject(null);
      } else {
        let items = data.Items.map(element => {
          return unmarshallObject(element);
        });
        console.log(items);
        resolve(items);
      }
    });
  });
};

// Queries the DynamoDB for all the items that are on sale
export const getSavingsItems = () => {
  return new Promise((resolve, reject) => {
    dynamoDB.scan(savingItemsParams, function(err, data) {
      if (err) {
        console.log(JSON.stringify(err));
        reject(null);
      } else {
        let items = data.Items.map(element => {
          return unmarshallObject(element);
        });
        resolve(items);
      }
    });
  });
};

// Queries the DynamoDB for all the specific search term.
export const searchItems = query => {
  return new Promise((resolve, reject) => {
    dynamoDB.scan(ITEM_SEARCH_PARAMS, (err, data) => {
      if (err) {
        console.log(JSON.stringify(err));
        reject(null);
      } else {
        let items = data.Items.map(element => {
          return unmarshallObject(element);

          // // Grab parameters for search
          // let department = element.department.S;
          // let name = element.name.S;
          // let keywords = element.keywords.S.toLowerCase().split(",");
          // query = query.toLowerCase();
          //
          // if (
          //   department.toLowerCase().includes(query) ||
          //   name.toLowerCase().includes(query) ||
          //   keywords.includes(query)
          // ) {
          //   items.push({
          //     itemid: element.itemid.S,
          //     name: name,
          //     image: element.image.S,
          //     price: element.price.N,
          //     quantity: element.quantity.S,
          //     sale: element.sale.N,
          //     departmentid: department,
          //     inCart: 0
          //   });
          // }
        });
        resolve(items);
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
