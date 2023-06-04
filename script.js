let container = document.getElementsByClassName("container")[0];
let foodItemContainer = document.getElementsByClassName("foodItems")[0];
let heading = document.getElementById("welcome-heading");
let btn = document.getElementById("menu-btn");
let totalPrice = 0;
let foodItems;

window.addEventListener("load", async () => {
  setTimeout(restaurantHandler, 1400);
});

async function restaurantHandler() {
  let foodItems = await getMenu();
}

//fetching menu for customer---------

async function getMenu() {
  const endpoint =
    "https://raw.githubusercontent.com/saksham-accio/f2_contest_3/main/food.json";
  try {
    const response = await fetch(endpoint);
    foodItems = await response.json();
    console.log(foodItems);
    showItems(foodItems);
  } catch (error) {
    console.log("Not able to fetch data ", error);
  }
}

function showItems(foodItems) {
  heading.innerHTML = "Restaurant Menu !";
  btn.innerText = "Order Food";

  btn.addEventListener("click", handleOrder);
  foodItemContainer.innerHTML = "";
  if (foodItems && foodItems.length > 0) {
    for (let item of foodItems) {
      foodItemContainer.innerHTML += ` 
  
    <div class="items">
        <div class="image">
            <img src=${item.imgSrc} alt=${item.name}>
        </div>
        <h4 class="title">${item.name}</h4>
         <p class="price">${item.price}$</p>
    </div>
   `;
    }
  }
}
// for clicking on Order items it will call and it will call takeOrder() firstly,
async function handleOrder() {
  try {
    const selectedItems = await TakeOrder(foodItems);
    console.log("Order taken", selectedItems);
    showSelectedOrder(selectedItems);
    const status = await orderPrep();
    console.log("Order is prepared", status);
    isOrderPrep(status);
    const paymentStatus = await payOrder();
    console.log("Order paid !", paymentStatus);
    isOrderPaid(paymentStatus);
    thankyouFnc();
  } catch (error) {
    console.log(error);
  }
}

//select 3 random items from menu --------------------
function getRandomItems(data) {
  let order = [];
  for (let i = 0; i < 3; i++) {
    order.push(data[Math.floor(Math.random() * data.length)]);
  }
  return order;
}

//take order from customer------------------------
function TakeOrder(foodItems) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (foodItems && foodItems.length > 0) {
        let selectedItems = getRandomItems(foodItems);
        resolve(selectedItems);
      } else {
        console.log("foodItem is empty");
      }
    }, 2500);
  });
}

// it show the selected order items--------------------------
function showSelectedOrder(showSelectedOrder) {
  foodItemContainer.innerHTML = "";
  if (showSelectedOrder && showSelectedOrder.length > 0) {
    for (let item of showSelectedOrder) {
      foodItemContainer.innerHTML += ` 
      
        <div class="items">
            <div class="image">
                <img src=${item.imgSrc} alt=${item.name}>
            </div>
            <h4 class="title">${item.name}</h4>
             <p class="price">${item.price}$</p>
        </div>
       `;
      totalPrice = totalPrice + item.price;
    }
  }
}

//prepraing food for customer-----------------------------
async function orderPrep() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ order_status: true, paid: false });
    }, 1500);
  });
}
//this function will call and show the result on UI after executing orderPrep----
let isOrderPrep = (status) => {
  let orderStatus = document.createElement("h2");
  orderStatus.className = "ready";
  orderStatus.innerText = `Order Status : ${totalPrice}$(ready) `;
  orderStatus.style.color = "greenyellow";
  foodItemContainer.append(orderStatus);
  let orderPaid = document.createElement("h2");
  orderPaid.className = "ready";
  orderPaid.innerText = `${
    status.paid ? `Order Paid :SuccessFully !` : `Pending..`
  }`;
  orderPaid.style.color = "red";
  foodItemContainer.append(orderPaid);
};

// for paying rupee for order--------
async function payOrder() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ order_status: true, paid: true });
    }, 1000);
  });
}
//this function will call and show the result on UI executing payOrder----
let isOrderPaid = (status) => {
  let orderPaid = document.createElement("h1");
  orderPaid.className = "ready";
  orderPaid.innerText = `${status.paid && `Payment SuccessFull !`}`;
  orderPaid.style.color = "red";
  foodItemContainer.append(orderPaid);
  foodItemContainer.innerHTML = "";
  foodItemContainer.append(orderPaid);
  heading.innerText = "ThankYou for visiting Our Restaurant <3 !";
  btn.innerText = "Back to the Menu !";
  btn.removeEventListener("click", handleOrder);
  totalPrice = 0;
  btn.onclick = function () {
    showItems(foodItems);
  };
};

function thankyouFnc() {
  alert("Thank you For having your meal with us <3");
}
