import Header from './header';
import Footer from './Footer';
import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import HorizontalScroll from './HorizontalScroll';
import {DynamoDB} from "aws-sdk/index";
import Counter from "./Counter";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

var AmazonCognitoIdentity = require('amazon-cognito-identity-js');

var id;
var cognitoUser;
var email;
var dynamodb;
var itemsInList = [];

class Item extends Component {

	constructor(props) {
    	super(props);

    	this.state = {
    		item: {},
    		similarItems: [],
    		quantityInCart: 0
    	}

    	const queryParams = new URLSearchParams(this.props.location.search);
    	id = queryParams.get('id')

    	this.initializeDB()
    	this.getCurrentUser()
    	this.getItem()

    	this.cartChanged = this.cartChanged.bind(this)

    	this.props.history.listen((location, action) => {
    		// This 100ms delay is necessary for the id to change
    		setTimeout(function() {
      			const queryParams = new URLSearchParams(this.props.location.search);
    			id = queryParams.get('id')
    			this.getItem()
  			}.bind(this), 100)
		})

	}

	initializeDB() {
		if(process.env.NODE_ENV === 'development'){
	        dynamodb = require('../db').db;
	    } else {
	        dynamodb = new DynamoDB({
	            region: "us-west-1",
	            credentials: {
	                accessKeyId: process.env.REACT_APP_DB_accessKeyId,
	                secretAccessKey: process.env.REACT_APP_DB_secretAccessKey},
	        });
	    }
	}

	cartChanged() {
		var quantity = this.state.quantityInCart

    	if(localStorage.getItem('cart') != null) {
        	var cartString = localStorage.getItem('cart')
        	console.log(cartString);
        	var cart = JSON.parse(cartString)

        	if(cart.hasOwnProperty(this.state.item.itemid)) {
	        	quantity = cart[this.state.item.itemid].quantityInCart
	        	this.setState({quantityInCart: quantity})
	    	} else {
	    		this.setState({quantityInCart: 0})
	    	}
    	} else {
      		this.setState({quantityInCart: 0})
    	}
	}

	componentWillUnmount(){
        if (typeof window !== 'undefined') {
            window.removeEventListener('cartChanged', this.cartChanged, false)
        }
    }

    componentDidMount() {
        if (typeof window !== 'undefined') {
            window.addEventListener('cartChanged', this.cartChanged, false)
        }
    }

	getCurrentUser() {
		// Get poolData
	    var poolData;
	    if(process.env.NODE_ENV === 'development'){
	        poolData = require('../poolData').poolData;
	    } else {
	      var poolData = {
	        UserPoolId : process.env.REACT_APP_Auth_UserPoolId,
	        ClientId : process.env.REACT_APP_Auth_ClientId
	      };
	    }
	    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

	    cognitoUser = userPool.getCurrentUser();

	    if (cognitoUser != null) {
	        cognitoUser.getSession(function(err, session) {
	            if (err) {
	                alert(err.message || JSON.stringify(err));
	                return;
	            }
	            console.log('session validity: ' + session.isValid());

	            // NOTE: getSession must be called to authenticate user before calling getUserAttributes
	            cognitoUser.getUserAttributes(function(err, attributes) {
	                if (err) {
	                    console.log(err)
	                } else {
	                	attributes.forEach(function(att){
	                		if(att.Name == 'email') {
	                			email = att.Value
	                		}
	                	});
	                }
	            });
	        });
    	}
	}

	getItem() {

		window.scrollTo(0, 0);
		var params = {
		  Key: {
		   "itemid": {
		     S: id
		    }
		  },
		  TableName: "item"
		 };

		dynamodb.getItem(params, function(err, data) {
			if (err) {
		   		console.log(err, err.stack)
		   	} else {
		   		this.setState({ item: { itemid: data.Item.itemid.S, name: data.Item.name.S, department: data.Item.department.S,
		   		image: data.Item.image.S, price: data.Item.price.N, quantity: data.Item.quantity.S, sale: data.Item.sale.N } })
		   		this.getSimilarItems()
		   	}
		 }.bind(this));
	}

	addToList() {
		if(cognitoUser == null) {
			alert("You need to Sign Up for an Account first.")
		} else {
			var params = {
			  Key: {
			   "userid": {
			     S: email
			    }
			  },
			  TableName: "user"
			};

			dynamodb.getItem(params, function(err, data) {
				if (err) {
			   		console.log(err, err.stack)
			   	} else {
			   		try {
			   			itemsInList = data.Item.lists.M.shoppingList.SS
			   		} catch(error) {
			   			console.log("shoppingList not yet created  "+error.message)
			   		} finally {
			   			this.updateList()
			   		}
			   	}
			}.bind(this));
		}
	}

	updateList() {
		if(!itemsInList.includes(id)) {
			itemsInList.push(id)
			var params = {
			    TableName: 'user',
			    Key:{
			        "userid": {
			        	S: email
			        }
			    },
			    UpdateExpression: "SET lists = :lists",
			    ExpressionAttributeValues:{
			        ":lists": { M: {
			        		"shoppingList": {
			        			SS: itemsInList
			        		}
			        	}
			        }
			    },
			    ReturnValues:"UPDATED_NEW"
			};

			dynamodb.updateItem(params, function(err, data) {
				if(err) {
			   		alert(JSON.stringify(err))
			   	} else {
			   		toast.error("Added to List")
			   		console.log("Added to Shopping List: "+data)
				}
			});
		} else {
			alert("Already in List")
		}
	}

	renderButtonBar() {

		var buttonBarStyle;
		// Mobile
		if(window.innerWidth < 550) {
			buttonBarStyle = {
				height:'46px',
				width: '100%',
			}
		} else {
			buttonBarStyle = {
				marginTop: '3%',
				height:'44px',
				width: '40%',
				float: 'left'
			}
		}
        if(this.state.quantityInCart == 0) {return(
                <button style={buttonBarStyle} class="primary" onClick={() => {this.handleAddToCart()}}>
                	Add to Cart
                </button>
        );} else {
            return(
            	<div style={buttonBarStyle}>
                    <Counter quantity={this.state.quantityInCart}
                             onIncrease={this.handleIncrease}
                             onDecrease={this.handleDecrease}
                             onRemove={this.handleRemove}/>
                </div>
            );
        }
    }

    // Increases the quantity of this item in the cart
    handleIncrease = () => {
      var quantity = this.state.quantityInCart
      if(localStorage.getItem('cart') != null) {
        var cartString = localStorage.getItem('cart')
        var cart = JSON.parse(cartString)

        if(cart.hasOwnProperty(this.state.item.itemid)) {
        	var item = this.state.item
          	item.quantityInCart = quantity + 1
          	cart[this.state.item.itemid] = item
          	localStorage.setItem('cart', JSON.stringify(cart))
          	this.setState({quantityInCart: quantity + 1})
        }
      }
    };

    // Decreases the quantity of this item by 1 in the cart.
    handleDecrease = () => {
      var quantity = this.state.quantityInCart

      if(localStorage.getItem('cart') != null) {
        var cartString = localStorage.getItem('cart')
        var cart = JSON.parse(cartString)

        if(cart.hasOwnProperty(this.state.item.itemid)) {
          var item = this.state.item
          item.quantityInCart = quantity - 1
          cart[this.state.item.itemid] = item
          localStorage.setItem('cart', JSON.stringify(cart))
          this.setState({quantityInCart: quantity - 1})
        }
      }
    };

    // Remove the item from the cart
    handleRemove = () => {
      if(localStorage.getItem('cart') != null) {
        var cartString = localStorage.getItem('cart')
        var cart = JSON.parse(cartString)

        if(cart.hasOwnProperty(this.state.item.itemid)) {
          delete cart[this.state.item.itemid]
          localStorage.setItem('cart', JSON.stringify(cart))
          this.setState({quantityInCart: 0})
        }
      }
    };

    handleAddToCart = () => {
     	var quantity = this.state.quantityInCart

    	if(localStorage.getItem('cart') != null) {
        	var cartString = localStorage.getItem('cart')
        	console.log(cartString);
        	var cart = JSON.parse(cartString)

        	if(cart.hasOwnProperty(this.state.item.itemid)) {
	        	quantity = cart[this.state.item.itemid].quantityInCart
	    	}

        	var item = this.state.item
          	item.quantityInCart = quantity + 1
          	cart[this.state.item.itemid] = item
        	localStorage.setItem('cart', JSON.stringify(cart))
        	this.setState({quantityInCart: quantity + 1})
    	} else {
      		var cart = {}
      		var item = this.state.item
      		item.quantityInCart = quantity + 1
      		cart[this.state.item.itemid] = item
      		localStorage.setItem('cart', JSON.stringify(cart))
      		this.setState({quantityInCart: quantity + 1})
    	}
    };

    handleSeeMoreClick() {
    	this.props.history.push({
			pathname: 'search',
			search: '?query='+this.state.item.department+'&special=true'
		})
    }

	getSimilarItems() {
		var params = {
		  ExpressionAttributeValues: {
		   ":d": {
		     S: this.state.item.department
		    }
		  },
		  FilterExpression: "department = :d",
		  TableName: "item"
		 };

		 var similarItems = []
		 dynamodb.scan(params, function(err, data) {
		 	if(err) {
				alert(JSON.stringify(err))
		 	} else {
		 		data.Items.forEach((element) => {
		 			let tempItem = { itemid: element.itemid.S, name: element.name.S, department: element.department.S,
		   		image: element.image.S, price: element.price.N, quantity: element.quantity.S, sale: element.sale.N }
		   			if(tempItem.itemid !== this.state.item.itemid) {
		   				similarItems.push(tempItem)
		   			}
		 		});
		 		this.setState({similarItems: similarItems})
		 	}
		 }.bind(this));
	}

	renderPrice() {
		if(this.state.item.sale != 0) {
			return (
				<p style={{marginTop: '5%', color: 'red', fontSize: '1.8em'}}>
					${Number(this.state.item.sale).toFixed(2)} &nbsp;&nbsp;
					<span style={{color: '#808080', textDecoration: 'line-through'}}>${Number(this.state.item.price).toFixed(2)}</span>
				</p>
			);
		} else {
			return (
				<p style={{marginTop: '5%', fontSize: '1.8em'}}>
					${Number(this.state.item.price).toFixed(2)}
				</p>
			);
		}
	}

	render() {

		if(window.innerWidth < 550) {
			const astext = {
			    background:'none',
			    border:'none',
			    width: '40%',
			    padding:'0',
			    fontSize: '1.2em',
				textAlign: 'center',
				float: 'right',
				marginTop: '-40px',
			}

			return (
			<div>
			    <Header />
			    <div id="pageBody">
				    <div style={{
				    	marginTop: '3%',
				    	marginLeft: '25%',
				    	marginRight: '25%',
						width: '50%',
						float: 'left'
					}}>
				    	<img className="img-responsive" style={{width: '100%', width: '100%'}} src={this.state.item.image} />
				    </div>
				    <div style={{
				    	margin: '3%',
						width: '94%',
						float: 'right',
					}}>

						<h1 style={{marginTop: '0', fontSize: '2em'}}>{this.state.item.name}</h1>
						<p style={{marginTop: '3%', color: 'grey', fontSize: '1.4em'}} >{this.state.item.quantity}</p>
						{this.renderPrice()}
						<button className="primaryRedWithHover" style={astext} onClick={this.addToList.bind(this)} >
							<i class="fa fa-th-list" style={{width: '20%'}}/>&nbsp;
							Add to List
						</button>
						{this.renderButtonBar()}
						<div style={{marginLeft: '-3%', marginRight: '-3%'}}>
							<HorizontalScroll items={this.state.similarItems} title="Similar Items"  onSeeMoreClick={() => this.handleSeeMoreClick()} />
						</div>
						<ToastContainer hideProgressBar={true} autoClose={2000} />
				    </div>
				</div>
				<Footer />
			</div>
			);
		} else {
			const astext = {
			    background:'none',
			    border:'none',
			    width: '80px',
			    marginLeft: '10%',
			    marginTop: '3%',
			    padding:'0',
			    fontSize: '1em',
				textAlign: 'center',
			}

			return (
			<div>
			    <Header />
			    <div id="pageBody"  style ={{minHeight:window.innerHeight-245}} >
				    <div style={{
				    	margin: '3%',
						width: '45%',
						height: '500px',
						float: 'left'
					}}>
				    	<img className="img-responsive" style={{width: '100%', width: '100%', maxWidth: '500px', margin: '0 auto 0 auto'}} src={this.state.item.image} />
				    </div>
				    <div style={{
				    	margin: '3%',
				    	marginLeft: '0%',
						width: '45%',
						height: 'auto',
						float: 'right',
					}}>

						<h1 style={{marginTop: '0', fontSize: '2em'}}>{this.state.item.name}</h1>
						<p style={{marginTop: '5%', color: 'grey', fontSize: '1.4em'}} >{this.state.item.quantity}</p>
						{this.renderPrice()}
						{this.renderButtonBar()}
						<div>
						<button className="primaryRedWithHover" style={astext} onClick={this.addToList.bind(this)} >
							<i class="fa fa-th-list fa-2x" style={{width: '80px'}}/>
							Add to List
						</button>
						</div>
						<div style={{marginLeft: '-3%', marginRight: '-3%'}}>
							<HorizontalScroll items={this.state.similarItems} title="Similar Items" onSeeMoreClick={() => this.handleSeeMoreClick()} />
						</div>
						<ToastContainer hideProgressBar={true} autoClose={2000} />
				    </div>
				</div>
				<Footer />
			</div>
		);
	}
  }
}

export default withRouter(Item);
