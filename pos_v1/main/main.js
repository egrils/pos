'use strict';
function printReceipt(tags) {
  let cartItems = buildCartItems(tags);
  let promotionItems = buildPromotionItems(cartItems);
  let receiptItems = buildReceiptItems(promotionItems);
  let receiptText = buildReceiptText(receiptItems);

  console.log(receiptText);
}

function buildCartItems(tags) {
  let cartItems = [];
  let allItems = loadAllItems();
  let items = [];
  let count = 1;
  let frontBarcode = '';
  let frontItem;

  tags.forEach(function (tag) {
    let barcode = tag.substr(0,10);
    allItems.forEach(function (item) {
      if (item.barcode === barcode){
        items.push({item:item,tag:tag});
        if (barcode != tag){
          for (let i = 1 ;i < tag.substr(11,12);i ++){
            items.push({item:item,tag:tag});
          }
        }
      }
    });
  });
  items.forEach(function (Item) {
    let barcode = Item.item.barcode;

    if (barcode != frontBarcode) {
      cartItems.push({item:frontItem,count:count});
      count = 1;
    }else {
      count ++;
    }
    frontBarcode = Item.item.barcode;
    frontItem = Item.item;
  });

  cartItems.push({item:frontItem,count:count});
  cartItems.splice(0,1);

  return cartItems;
}

function buildPromotionItems(cartItems) {
  let allPromotions = loadPromotions();
  let getBacodes = () => {
    for (let promotion of allPromotions){
      if (promotion.type === 'BUY_TWO_GET_ONE_FREE'){
        return promotion.barcodes;
      }
    }
  };
  let barcodes = getBacodes();
  let promotionItems = [];

  cartItems.forEach(function (cartItem) {
    let subSave = 0;
    let subTotal = 0;
    barcodes.forEach(function (barcode) {
      if (cartItem.item.barcode === barcode){
        subSave = cartItem.item.price;
      }
    });
    subTotal = cartItem.item.price * cartItem.count - subSave;
    promotionItems.push({cartItem:cartItem,subSave:subSave,subTotal:subTotal});
  });

  return promotionItems;
}

function buildReceiptItems(promotionItems) {
  let total = 0;
  let save = 0;
  promotionItems.forEach(function (promotionItem) {
    total += promotionItem.subTotal;
    save += promotionItem.subSave;
  });
  return {promotionItems:promotionItems,total:total,save:save};
}

function buildReceiptText(receiptItems) {
  let receiptText = `***<没钱赚商店>收据***\n`;
  receiptItems.promotionItems.forEach(function (promotionItem) {
    let item = promotionItem.cartItem.item;
    receiptText += `名称：` + item.name + `，数量：` + promotionItem.cartItem.count +
      item.unit + `，单价：` + item.price.toFixed(2) + `(元)，小计：`+ promotionItem.subTotal.toFixed(2)+`(元)\n`;
  });
  receiptText += `----------------------
总计：` + receiptItems.total.toFixed(2) + `(元)
节省：` + receiptItems.save.toFixed(2) + `(元)
**********************`;
  return receiptText;
}
