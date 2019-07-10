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
        // Necessary because the closure has no access to this.state
        cognitoUser.getUserAttributes(function(err, result) {
          if (err) {
            console.log(err);
            reject(null);
          }
          resolve(result[2].Value);
        });
      });
    }
  });
};

// Unmarshalls an object from a DynamoDB instance
const unmarshallObject = object => {
  let unmarshalledObject = {};
  for (let key in object) {
    if (object.hasOwnProperty(key)) {
      if (key === "itemid") {
        unmarshalledObject[key] = Number(
          marshaller.unmarshallValue(object[key])
        );
      } else {
        unmarshalledObject[key] = marshaller.unmarshallValue(object[key]);
      }
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
        console.log(data.Items);
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

// Returns a given user's item order  history
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

//Get teh details of an item given its id
export const getItemFromDB = itemID => {
  let itemParams = {
    Key: { itemid: { S: String(itemID) } },
    TableName: "item"
  };
  return new Promise((resolve, reject) => {
    dynamoDB.getItem(itemParams, (err, data) => {
      if (err) {
        console.log("error fetching item", err);
        reject(null);
      } else if (data.Item) {
        console.log("getItemFromDB: ", data);
        let item = unmarshallObject(data.Item);
        resolve(item);
      }
    });
  });
};


// given an array of item ids it returns an array of item objects
export const getItems = items => {
  let keys = [];
  items.map(itemId => {
    keys.push({ itemid: { S: itemId } });
  });
  let params = {
    RequestItems: {
      item: {
        Keys: keys
      }
    }
  };

  return new Promise((resolve, reject) => {
    dynamoDB.batchGetItem(params, (err, data) => {
      if (err) {
        alert(err.message);
        console.log(err.message);
        reject(null)
      } else {
        let items = data.Responses.item.map(item => unmarshallObject(item));
        resolve(items);
      }
    });
  });
};


export const removeItemFromSavedLists = (itemId, userId) => {
  let params = "";
  dynamoDB.updateItem(params, function(err, data) {
    if (err) {
      alert(JSON.stringify(err));
    } else {
      console.log("Removed from Shopping List: " + data);
    }
  });
};

// Returns the items in the given user's lists
// Currently default to shopping list
export const getShoppingListItemsIds = userid => {
  let params = {
    Key: {
      userid: {
        S: userid
      }
    },
    TableName: "user"
  };

  return new Promise((resolve, reject) => {
    dynamoDB.getItem(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
        reject(null);
      } else {
        let items = unmarshallObject(data.Item);
        resolve(items.lists.shoppingList);
      }
    });
  });
};


export const updateShoppingList = (items, userid) => {
  let params = {};
  if (items.length === 0) {
    params = {
      TableName: "user",
      Key: {
        userid: {
          S: userid
        }
      },
      UpdateExpression: "REMOVE lists.shoppingList",
      ReturnValues: "UPDATED_NEW"
    };
  } else {
    params = {
      TableName: "user",
      Key: {
        userid: {
          S: userid
        }
      },
      UpdateExpression: "SET lists = :lists",
      ExpressionAttributeValues: {
        ":lists": {
          M: {
            shoppingList: {
              SS: items
            }
          }
        }
      },
      ReturnValues: "UPDATED_NEW"
    };
  }

  return new Promise((resolve, reject) => {
    dynamoDB.updateItem(params, function(err, data) {
      if (err) {
        alert(JSON.stringify(err));
        reject(null)
      } else {
        console.log("Removed from Shopping List: " + data);
      }
    });
  })
}
