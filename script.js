const productsList = document.getElementById("products-list");
const selectedProductsList = document.getElementById("selected-products-list");
const selectedProductContainerTemplate = document.getElementById("selected-product-template");

const cartArray = [];

// a span in top of the cart that shows how many products the client has chose
const productsAmountSpan = document.querySelector("#products-amount-span span");

// a span in the cart that shows the order total price
const totalPriceSpan = document.querySelector('.total-info-container .total');

const wrapper = document.querySelector("div.wrapper");
const confirmOrderCard = document.getElementById("confirmed-order-card");
const totalPriceSpanInConfirmedOrderCard = document.querySelector("span.total-in-confirmed-order-card");
const confirmOrderBtn = document.getElementById("confirm-order-btn");

// orders list in the confirmed order card
const ordersList = document.getElementById("orders-list");

const orderMiniCardTemplate = document.getElementById("order-mini-card-template");
const startNewOrderBtn = document.querySelector("#start-new-order-btn");

startNewOrderBtn.addEventListener("click", () => {
  ordersList.innerHTML = "";
  cartArray.forEach(obj => obj.quantityInCart = 0);
  cartArray.length = 0;
  wrapper.classList.add("hidden");
  selectedProductsList.innerHTML = "";
  displayTotalPrice();
  checkProductInCart();
  renderProductsElements(dataArray);
  document.querySelectorAll("li.product-box").forEach(productBox => {
    productBox.classList.remove("red-border");
    productBox.querySelector("div.control-quantity-buttons-container").classList.add("hidden");
    productBox.querySelector("button.add-to-cart-btn").classList.remove("hidden");
  })
})

function displayTotalPrice() {
  let totalPrice = cartArray.reduce((acc, obj) => {
    return acc += obj.productPrice * obj.quantityInCart;
  }, 0);


  productsAmountSpan.textContent = cartArray.reduce((acc, obj) => {
    return acc += obj.quantityInCart;
  }, 0)
  totalPriceSpan.textContent = '$' + number(totalPrice);
  totalPriceSpanInConfirmedOrderCard.textContent = '$' + number(totalPrice);
}

function setImage(productName, imgElement, imgType) {
  dataArray.forEach(obj => {
    if (obj.name == productName) {
      imgElement.src = obj.image[imgType];
    }
  })
}

function number(num) {
  if (Number.isInteger(num)) {
    return num + ".00";
  } else {
    let [wholePart, fractionalPart] = String(num).split('.');
    fractionalPart = fractionalPart.padEnd(2, '0');
    return `${wholePart}.${fractionalPart}`;
  }
}


confirmOrderBtn.addEventListener("click", () => {
  // display the element in the order info card:
  wrapper.classList.remove("hidden");
  ordersList.innerHTML = "";
  cartArray.forEach(orderObj => {
    if (orderObj.quantityInCart > 0) {
      const orderMiniCard = orderMiniCardTemplate.content.cloneNode(true).firstElementChild;
      orderMiniCard.querySelector("span.order-name").textContent = orderObj.productName;
      orderMiniCard.querySelector("span.order-quantity").textContent = orderObj.quantityInCart + 'x';
      orderMiniCard.querySelector("span.order-price").textContent = '@$' + number(orderObj.productPrice);
      orderMiniCard.querySelector("span.order-total-price").textContent = '$' + number(orderObj.productPrice * orderObj.quantityInCart);
      displayTotalPrice();
      ordersList.append(orderMiniCard)
      setImage(orderObj.productName, orderMiniCard.querySelector("img"), 'thumbnail')
    }
  })
})

confirmOrderCard.addEventListener('click', e => e.stopPropagation());
wrapper.addEventListener("click", (e) => {
  wrapper.classList.add("hidden");
})

let layoutForEmptyCart = document.querySelector(".layout-for-empty-cart");
let layoutForUnEmptyCart = document.querySelector(".layout-for-unempty-cart");
function checkProductInCart() {
  // this function hide and unhide the unempty and empty cart layouts depeding on the cart
  const check = cartArray.some(obj => obj.quantityInCart > 0);
  if (check) {
    layoutForEmptyCart.classList.add("hidden");
    layoutForUnEmptyCart.classList.remove("hidden");
  } else {
    layoutForEmptyCart.classList.remove("hidden");
    layoutForUnEmptyCart.classList.add("hidden");
  }
}

function renderProductsElements(productsArray) {
  // the product box that contains the product info and control quanitity buttons
  const productBoxTemplate = document.getElementById("product-box-template");

  productsArray.forEach((productInfoObject) => {

    // here I use the template to create a product box and give it
    // the product info and img using productArray
    const productBox = productBoxTemplate.content.cloneNode(true);
    const actualBox = productBox.firstElementChild;
    productBox.querySelector('.product-img').src = productInfoObject.image.mobile;
    productBox.querySelector('span.category').textContent = productInfoObject.category;
    productBox.querySelector('span.product-name').textContent = productInfoObject.name;
    productBox.querySelector('span.product-price').textContent = '$' + number(productInfoObject.price);

    const productObjectForCart = {
      "productName": productInfoObject.name,
      "productPrice": productInfoObject.price,
      "quantityInCart": 0,
    }

    // creating variables for:
    // "add to cart" button and the control quanitity buttons container
    // and the quantity span
    const addToCartBtn = productBox.querySelector("button.add-to-cart-btn");
    const controlQuantityButtonsContainer = productBox.querySelector("div.control-quantity-buttons-container");
    const controlQuantityButtons = controlQuantityButtonsContainer.querySelectorAll("button");
    const quantitySpan = controlQuantityButtonsContainer.querySelector('.quantity-to-add-span');

    // creating a container in the cart for the element using a template
    const selectedProductContainer = selectedProductContainerTemplate.content.cloneNode(true).firstElementChild;
    selectedProductContainer.querySelector(".product-name-in-cart").textContent = productInfoObject.name;
    selectedProductContainer.querySelector(".product-quantity").textContent = productObjectForCart.quantityInCart + 'x';
    selectedProductContainer.querySelector(".selected-product-price").textContent = `@ $${number(productObjectForCart.productPrice)}`;
    selectedProductContainer.querySelector("button.remove-product-btn").addEventListener('click', () => {
      productObjectForCart.quantityInCart = 0;
      selectedProductContainer.remove();
      actualBox.classList.remove("red-border");
      actualBox.querySelector(".control-quantity-buttons-container").classList.add("hidden");
      actualBox.querySelector(".add-to-cart-btn").classList.remove("hidden")
      cartArray.forEach((object, i) => {
        if (object.productName == productObjectForCart.productName) {
          cartArray.splice(i, 1);
        }
      })
      displayTotalPrice();
      checkProductInCart();
    })

    function decreaseQuantity() {
      if (productObjectForCart.quantityInCart > 1) {
        productObjectForCart.quantityInCart--;
        quantitySpan.textContent = productObjectForCart.quantityInCart;
        selectedProductContainer.querySelector(".selected-product-total-price").textContent = `$${number(productObjectForCart.productPrice * productObjectForCart.quantityInCart)}`;
        selectedProductContainer.querySelector(".product-quantity").textContent = productObjectForCart.quantityInCart + 'x';
        selectedProductContainer.querySelector(".selected-product-price").textContent = `@ $${number(productObjectForCart.productPrice)}`;
      } else {
        cartArray.forEach((object, i) => {
          if (object.productName == productObjectForCart.productName) {
            cartArray.splice(i, 1);
          }
        })
        actualBox.classList.remove('red-border');
        addToCartBtn.classList.remove('hidden');
        controlQuantityButtonsContainer.classList.add('hidden');
        selectedProductContainer.remove();
        productObjectForCart.quantityInCart = 0;
      }
      displayTotalPrice();
      checkProductInCart();
    }

    function increaseQuantity() {
      if (productObjectForCart.quantityInCart == 0) {
        productObjectForCart.quantityInCart++;
        cartArray.push(productObjectForCart);
        actualBox.classList.add('red-border');
        selectedProductsList.append(selectedProductContainer);
      } else {
        productObjectForCart.quantityInCart++;
      }
      quantitySpan.textContent = productObjectForCart.quantityInCart;
      selectedProductContainer.querySelector(".selected-product-total-price").textContent = `$${number(productObjectForCart.productPrice * productObjectForCart.quantityInCart)}`;
      selectedProductContainer.querySelector(".product-quantity").textContent = productObjectForCart.quantityInCart + 'x';
      selectedProductContainer.querySelector(".selected-product-price").textContent = `@ $${number(productObjectForCart.productPrice)}`;
      checkProductInCart();
      displayTotalPrice();
    }

    addToCartBtn.addEventListener('click', () => {
      addToCartBtn.classList.add('hidden');
      controlQuantityButtonsContainer.classList.remove('hidden');
      increaseQuantity();
    })

    controlQuantityButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (btn.className == "decrease-quantity-btn") {
          decreaseQuantity();
        } else {
          increaseQuantity();
        }
      })
    })
    productsList.append(productBox);
  });

  changeImgDependingOnScreenSize();
}

let dataArray = null;

async function loadProducts() {
  const response = await fetch("./data.json");
  const products = await response.json();
  dataArray = products;
  renderProductsElements(dataArray);
}

document.addEventListener('DOMContentLoaded', loadProducts);

let screenWidth = window.innerWidth;

function changeImgDependingOnScreenSize() {
  const imgElements = document.querySelectorAll('.product-img')
  const newScreenWidth = window.innerWidth;

  imgElements.forEach(img => {
    if (newScreenWidth >= 900 && screenWidth < 900) {
      img.src = img.getAttribute('src').replace(/mobile/, 'desktop');
    } else if (newScreenWidth < 900 && screenWidth >= 900) {
      img.src = img.getAttribute('src').replace(/desktop/, 'mobile');
    }
  })
  screenWidth = window.innerWidth;
}
window.addEventListener('resize', changeImgDependingOnScreenSize);