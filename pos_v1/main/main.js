'use strict';

let printReceipt = (tags) => {
  let cartItems = buildCartItems(tags);
  let promotionItems = buildPromotionItems(cartItems);
  let receiptItems = buildReceiptItems(promotionItems);
  let receiptText = buildReceiptText(receiptItems);

  console.log(receiptText);
};

let buildCartItems = (tags) => {
  let cartItems = [];
  for (let tag of tags) {
    let splitTag = tag.split('-');
    let barcode = splitTag[0];
    let count = parseFloat(splitTag[1] || 1);

    let cartItem = cartItems.find((cartItem) => cartItem.item.barcode === barcode);

    if (cartItem) {
      cartItem.count++;
    } else {
      let item = loadAllItems().find((item) => item.barcode === barcode);

      cartItems.push({item: item, count: count});
    }
  }

  return cartItems;
};

let getPromotionType = (barcode, promotions) => {
  let promotion = promotions.find(promotion => promotion.barcodes.includes(barcode));
  return promotion ? promotion.type : '';
};

let discount = (cartItem, promotionType) => {
  let freeItemCount = 0;
  if (promotionType === 'BUY_TWO_GET_ONE_FREE') {
    freeItemCount = parseInt(cartItem.count / 3);
  }
  let subSave = freeItemCount * cartItem.item.price;
  let subTotal = cartItem.item.price * cartItem.count - subSave;

  return {subSave, subTotal};
};

let buildPromotionItems = (cartItems) => {
  let promotions = loadPromotions();
  return cartItems.map(cartItem => {
    let promotionType = getPromotionType(cartItem.item.barcode, promotions);
    let {subSave, subTotal}= discount(cartItem, promotionType);
    return {cartItem, subSave, subTotal};
  });
};

let buildReceiptItems = (promotionItems) => {
  let total = 0;
  let save = 0;
  for (let promotionItem of promotionItems) {
    total += promotionItem.subTotal;
    save += promotionItem.subSave;
  }
  return {promotionItems, total, save};
};

let buildReceiptText = (receiptItems) => {

  let itemTexts = receiptItems.promotionItems.map(promotionItem => {
    let item = promotionItem.cartItem.item;
    return `名称：${item.name}，\
数量：${promotionItem.cartItem.count}${item.unit}，\
单价：${item.price.toFixed(2)}(元)，\
小计：${promotionItem.subTotal.toFixed(2)}(元)`;
  }).join('\n');

  return `***<没钱赚商店>收据***
${itemTexts}
----------------------
总计：${receiptItems.total.toFixed(2)}(元)
节省：${receiptItems.save.toFixed(2)}(元)
**********************`;
};
