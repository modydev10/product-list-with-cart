const productsList = document.getElementById("products-list");

const cartArray = [];

const selectedProductsList = document.getElementById("selected-products-list");

const selectedProductContainerTemplate = document.getElementById("selected-product-template");


const productsAmountSpan = document.querySelector("#products-amount-span span");
const totalPriceSpan = document.querySelector('.total-info-container .total');
const totalPricePsnaInConfirmedOrderCard = document.querySelector("span.total-in-confirmed-order-card");

const confirmOrderBtn = document.getElementById("confirm-order-btn");
const wrapper = document.querySelector("div.wrapper");
const confirmOrderCard = document.getElementById("confirmed-order-card");

const ordersList = document.getElementById("orders-list");
const orderMiniCardTemplate = document.getElementById("order-mini-card-template");

const startNewOrderBtn = document.querySelector("#start-new-order-btn");
startNewOrderBtn.addEventListener("click", () => {
  ordersList.innerHTML = "";
  cartArray.forEach(obj => obj.quantityInCart = 0);
  wrapper.classList.add("hidden");
  renderProductsInCart();
  displayTotalPrice();
})

function setImage(productName, imgElement, imgType) {
  dataArray.forEach(obj => {
    if (obj.name == productName) {
      imgElement.src = obj.image[imgType];
    }
  })
}



confirmOrderBtn.addEventListener("click", () => {

  // display the element in the final order info card:

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

function number(num) {
  if (Number.isInteger(num)) {
    return num + ".00";
  } else {
    let [wholePart, fractionalPart] = String(num).split('.');
    fractionalPart = fractionalPart.padEnd(2, '0');
    return `${wholePart}.${fractionalPart}`;
  }
}


function addProductToCart() { }

function renderProductsInCart() {
  selectedProductsList.innerHTML = "";

  if (cartArray.some(obj => obj.quantityInCart > 0)) {
    cartArray.forEach(productObject => {
      if (productObject.quantityInCart > 0) {
        let selectedProductContainer = selectedProductContainerTemplate.content.cloneNode(true).firstElementChild;
        selectedProductContainer.querySelector(".product-name-in-cart").textContent = productObject.productName;
        selectedProductContainer.querySelector(".product-quantity").textContent = productObject.quantityInCart + 'x';
        selectedProductContainer.querySelector(".selected-product-price").textContent = `@ $${number(productObject.productPrice)}`;
        selectedProductContainer.querySelector(".selected-product-total-price").textContent = `$${number(productObject.productPrice * productObject.quantityInCart)}`;

        selectedProductContainer.querySelector("button.remove-product-btn").addEventListener('click', () => {
          productObject.quantityInCart = 0;
          selectedProductContainer.remove();
          displayTotalPrice();
          checkProductInCart();
        })

        selectedProductsList.append(selectedProductContainer);
      }
    })
  } else {
    checkProductInCart();
  }
  displayTotalPrice();
}

function checkProductInCart() {
  // this function does:
  // hide and unhide the unempty and empty cart layouts depeding on the cart
  // hide the control quantity buttons container depending on the state

  let layoutForEmptyCart = document.querySelector(".layout-for-empty-cart")
  let layoutForUnEmptyCart = document.querySelector(".layout-for-unempty-cart")

  const check = cartArray.some(obj => obj.quantityInCart > 0);

  document.querySelectorAll(".product-box").forEach(box => { })

  if (check) {
    layoutForEmptyCart.classList.add("hidden");
    layoutForUnEmptyCart.classList.remove("hidden");
  } else {
    layoutForEmptyCart.classList.remove("hidden");
    layoutForUnEmptyCart.classList.add("hidden");
  }

  cartArray.forEach(productObject => {
    if (productObject.quantityInCart == 0) {
      document.querySelectorAll("div.product-box").forEach(productBox => {
        if (productBox.querySelector(".product-name").textContent == productObject.productName) {
          productBox.classList.remove("red-border");
          productBox.querySelector(".control-quantity-buttons-container").classList.add("hidden");
          productBox.querySelector(".add-to-cart-btn").classList.remove("hidden");
        }
      })
    }
  })
}

function displayTotalPrice() {
  let totalPrice = 0;
  let productsAmount = 0;
  cartArray.forEach(obj => {
    if (obj.quantityInCart > 0) {
      productsAmount += obj.quantityInCart;
      totalPrice += (obj.productPrice * obj.quantityInCart);
    }
  })
  totalPriceSpan.textContent = '$' + number(totalPrice);
  totalPricePsnaInConfirmedOrderCard.textContent = '$' + number(totalPrice);
  productsAmountSpan.textContent = productsAmount;
}
displayTotalPrice();


function renderProductsElements(productsArray) {

  const productBoxTemplate = document.getElementById("product-box-template");
  let screenWidth = window.innerWidth;

  productsArray.forEach((obj) => {
    const productBox = productBoxTemplate.content.cloneNode(true);
    const actualBox = productBox.firstElementChild;
    productBox.querySelector('.product-img').src = obj.image.mobile;
    productBox.querySelector('span.category').textContent = obj.category;
    productBox.querySelector('span.product-name').textContent = obj.name;
    productBox.querySelector('span.product-price').textContent = '$' + number(obj.price);

    cartArray.push({
      productName: obj.name,
      productPrice: obj.price,
      quantityInCart: 0
    })

    const addToCartBtn = productBox.querySelector("button.add-to-cart-btn");
    const controlQuantityButtonsContainer = productBox.querySelector("div.control-quantity-buttons-container");
    const controlQuantityButtons = controlQuantityButtonsContainer.querySelectorAll("button")
    const quantitySpan = controlQuantityButtonsContainer.querySelector('.quantity-to-add-span')

    function decreaseQuantity(product) {
      cartArray.forEach(productObject => {
        if (productObject.productName == product) {
          if (productObject.quantityInCart > 1) {
            productObject.quantityInCart == 0 ? 0 : productObject.quantityInCart--;
            quantitySpan.textContent = productObject.quantityInCart;
          } else {
            actualBox.classList.remove('red-border');
            productObject.quantityInCart--;
            addToCartBtn.classList.remove('hidden');
            actualBox.classList.remove('red-border');
            controlQuantityButtonsContainer.classList.add('hidden');
          }
        }
      })
      renderProductsInCart();
      checkProductInCart();
    }
    function increaseQuantity(product) {
      actualBox.classList.add('red-border');
      cartArray.forEach(productObject => {
        if (productObject.productName == product) {
          productObject.quantityInCart++;
          quantitySpan.textContent = productObject.quantityInCart;
        }
      })
      renderProductsInCart();
      checkProductInCart();
    }

    addToCartBtn.addEventListener('click', () => {
      addToCartBtn.classList.add('hidden');
      controlQuantityButtonsContainer.classList.remove('hidden');
      increaseQuantity(obj.name);
    })

    controlQuantityButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (btn.className == "decrease-quantity-btn") {
          decreaseQuantity(obj.name);
        } else {
          increaseQuantity(obj.name);
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
  renderProductsElements(products);
}

document.addEventListener('DOMContentLoaded', function () {
  loadProducts();
})



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
window.addEventListener('resize', changeImgDependingOnScreenSize)

