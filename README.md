## Task
Create a web-app with order window to buy some goods.

## Stack
# Backend:  JavaScript, Node.js, Express.js, REST API, AJAX
# Frontend: JavaScript, EJS, localStorage, Sass (SCSS), Bootstrap

## Description

# Backend
There was created basic Node.js app with Express.js using MVC with the next modules:
-	Server module: contain main app file with base configurations of app, PORT and connection to DB;
-	Model module: created imitation model DB entities in MongoDB using array of goods;
-	Routes module: built REST API architecture using GET methods;
	
# Frontend
There were created:
-	a web page with cards of goods (items) using the library of Bootstrap and own styles with Sass;
-	an order window as a pop-up window with: items, count, price, order total, personal data.

There was implemented:
-	the addition of items to an order using button “ADD TO BASKET”;
-	save information of an order in local storage until it sent to back-end, reset local storage after sending the order;
-	followings options in the order window using native JavaScript:
1) click buttons to manually change count of items (+ \ -);
2) function to auto change of amount while changing the count;
3) processing of the form with inputs to add personal data of a customer;
4) send order with axios to a router on back-end by button “SEND ORDER”.

 
## Environment
Clone repositore on your machine. Use npm install to add all dependencies in project and open web-app.

## View
![image](https://user-images.githubusercontent.com/46706194/146979811-4947fb52-f994-41a8-9185-0e9270e5970a.png)
![image](https://user-images.githubusercontent.com/46706194/146979819-9cdd89d0-a778-4a78-b3c4-f432c282b96e.png)
