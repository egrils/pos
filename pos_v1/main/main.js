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
  for (let tag of tags){
    let splitTag = tag.split('-');
    let barcode = splitTag[0];
    let count = parseFloat(splitTag[1] || 1);

    let cartItem = cartItems.find((cartItem) => cartItem.item.barcode === barcode);

    if (cartItem){
      cartItem.count ++;
    }else {
      let item = loadAllItems().find((item) => item.barcode === barcode);

      cartItems.push({item:item,count:count});
    }
  }

  return cartItems;
};

let buildPromotionItems = (cartItems) => {
  let allPromotions = loadPromotions();
  let getPromotionTags = () => {
    for (let promotion of allPromotions){
      if (promotion.type === 'BUY_TWO_GET_ONE_FREE'){
        return promotion.barcodes;
      }
    }
  };
  let promotionTags = getPromotionTags();
  let promotionItems = [];

  for (let cartItem of cartItems){
    let subSave = 0;
    let subTotal = 0;

    for (let promotionTag of promotionTags){
      if (promotionTag === cartItem.item.barcode){
        if (cartItem.count >= 3){
          subSave = cartItem.item.price *　parseInt(cartItem.count / 3);
        }
      }
    }

    subTotal = cartItem.item.price * cartItem.count - subSave;
    promotionItems.push({cartItem:cartItem,subSave:subSave,subTotal:subTotal})
  }

  return promotionItems;
};

let buildReceiptItems = (promotionItems) => {
  let total = 0;
  let save = 0;
  for (let promotionItem of promotionItems) {
    total += promotionItem.subTotal;
    save += promotionItem.subSave;
  }
  return {promotionItems:promotionItems,total:total,save:save};
};

let buildReceiptText = (receiptItems) => {
  let receiptText = `***<没钱赚商店>收据***\n`;
  for (let promotionItem of receiptItems.promotionItems) {
    let item = promotionItem.cartItem.item;
    receiptText += `名称：` + item.name + `，数量：` + promotionItem.cartItem.count +
      item.unit + `，单价：` + item.price.toFixed(2) + `(元)，小计：`+ promotionItem.subTotal.toFixed(2)+`(元)\n`;
  }
  receiptText += `----------------------
总计：` + receiptItems.total.toFixed(2) + `(元)
节省：` + receiptItems.save.toFixed(2) + `(元)
**********************`;
  return receiptText;
};
