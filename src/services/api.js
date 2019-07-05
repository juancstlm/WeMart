import AWS from "aws-sdk";
import {
  CognitoUserAttribute,
  CognitoUserPool
} from "amazon-cognito-identity-js";
import { DynamoDB } from "aws-sdk";
import { Marshaller } from "@aws/dynamodb-auto-marshaller";

const marshaller = new Marshaller({ unwrapNumbers: true });

const ITEM_SEARCH_PARAMS = {
  TableName: "item"
};

/// AWS Services

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

export const lambda = new AWS.Lambda({
  region: process.env.REACT_APP_AWS_REGION,
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
  }
});

export const userPool = new CognitoUserPool(poolData);

// Attempts to get the current logged in cognito user's email
export const getCogtnioUser = () => {
  return new Promise((resolve, reject) => {
    let cognitoUser = userPool.getCurrentUser();
    if (cognitoUser !== null) {
      cognitoUser.getSession(function(err, session) {
        if (err) {
          console.log(err);
          reject(null);
        }
      });
      // Necessary because the closure has no access to this.state
      cognitoUser.getUserAttributes(function(err, result) {
        if (err) {
          console.log(err);
          reject(null);
        }
        resolve(result[2].Value);
      });
    }
  });
};

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
export const getDepartments = limit => {
  const params = {
    TableName: "department",
    Limit: limit
  };
  return new Promise((resolve, reject) => {
    dynamoDB.scan(params, (err, data) => {
      if (err) {
        reject(null);
      } else {
        let unmarshalledData = data.Items.map(item => {
          return unmarshallObject(item);
        });
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
        resolve(items);
      }
    });
  });
};

// Queries the DynamoDB for all the items that are on sale
export const getSavingsItems = limit => {
  const savingItemsParams = {
    ExpressionAttributeValues: {
      ":s": {
        N: "0"
      }
    },
    FilterExpression: "sale <> :s",
    TableName: "item",
    Limit: limit
  };
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

// BACK END API IS BROKEN ATM
export const getOrderHistory = (userID, limit) => {
  let orderParams = {
    ExpressionAttributeValues: {
      ":u": {
        S: userID
      }
    },
    ExpressionAttributeNames: {
      "#S": "items"
    },
    FilterExpression: "userid = :u",
    ProjectionExpression: "#S",
    Limit: limit,
    TableName: "orders"
  };
  return new Promise((resolve, reject) => {
    dynamoDB.scan(orderParams, (err, data) => {
      if (err) {
        console.log(err, err.stack);
        reject(null);
      } else {
        console.log("order history", data);
        // data.Items.forEach(order => {
        //   console.log("ORDER", order);
        //   order.items.L.forEach(i => {
        //     let itemId = i.M.itemid.S;
        //     console.log("[itemids]", itemId);
        //     var set = this.state.orderHistory;
        //     set.add(itemId);
        //     this.setState({ orderHistory: set });
        //   });
        // });
      }
    });
  });
};

// Get item from db
export const getItemFromDB = itemID => {
  let itemParams = {
    Key: { itemid: { S: itemid } },
    TableName: "item"
  };
  return new Promise((resolve, reject) => {
    dynamoDB.getItem(itemParams, (err, data) => {
      if (err) {
        reject(null);
      } else if (data.Item) {
        let item = unmarshallObject(data.Item);
        resolve({...item, inCart: 0})
      }
    });
  });
};
