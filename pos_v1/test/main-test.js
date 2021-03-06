'use strict';

describe('pos', () => {
  let inputs;

  beforeEach(() => {
    inputs = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2',
      'ITEM000005',
      'ITEM000005',
      'ITEM000005'
    ];
  });

  it('should print correct text', () => {

    spyOn(console, 'log');
    http://es6.ruanyifeng.com/
    printReceipt(inputs);

    const expectText = `***<没钱赚商店>收据***
名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
名称：荔枝，数量：2斤，单价：15.00(元)，小计：30.00(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
----------------------
总计：51.00(元)
节省：7.50(元)
**********************`;

    expect(console.log).toHaveBeenCalledWith(expectText);
  });

  describe('unit test',() => {
    it('should build correct cartItems',() => {
      let cartItems = buildCartItems(inputs);

      const expectArray = [
        {
          item:{
            barcode: 'ITEM000001',
            name: '雪碧',
            unit: '瓶',
            price: 3.00
          },
          count:5
        },
        {
          item:{
            barcode: 'ITEM000003',
            name: '荔枝',
            unit: '斤',
            price: 15.00
          },
          count:2
        },
        {
          item:{
            barcode: 'ITEM000005',
            name: '方便面',
            unit: '袋',
            price: 4.50
          },
          count:3
        }
      ];

      expect(cartItems).toEqual(expectArray);
    });

    it('should build correct promotionItems',() => {
      let promotionItems = buildPromotionItems([
        {
          item:{
            barcode: 'ITEM000001',
            name: '雪碧',
            unit: '瓶',
            price: 3.00
          },
          count:5
        },
        {
          item:{
            barcode: 'ITEM000003',
            name: '荔枝',
            unit: '斤',
            price: 15.00
          },
          count:2
        },
        {
          item:{
            barcode: 'ITEM000005',
            name: '方便面',
            unit: '袋',
            price: 4.50
          },
          count:3
        }
      ]);
      const expectArray = [
        {
          cartItem:{
            item:{
              barcode: 'ITEM000001',
              name: '雪碧',
              unit: '瓶',
              price: 3.00
            },
            count:5
          },
          subSave:3,
          subTotal:12
        },
        {
          cartItem:{
            item:{
              barcode: 'ITEM000003',
              name: '荔枝',
              unit: '斤',
              price: 15.00
            },
            count:2
          },
          subSave:0,
          subTotal:30
        },
        {
          cartItem:{
            item:{
              barcode: 'ITEM000005',
              name: '方便面',
              unit: '袋',
              price: 4.50
            },
            count:3
          },
          subSave:4.5,
          subTotal:9
        }
      ];

      expect(promotionItems).toEqual(expectArray);
    });

    it('should build correct receiptItems',() => {
      let receiptItems = buildReceiptItems([
        {
          cartItem:{
            item:{
              barcode: 'ITEM000001',
              name: '雪碧',
              unit: '瓶',
              price: 3.00
            },
            count:5
          },
          subSave:3,
          subTotal:12
        },
        {
          cartItem:{
            item:{
              barcode: 'ITEM000003',
              name: '荔枝',
              unit: '斤',
              price: 15.00
            },
            count:2
          },
          subSave:0,
          subTotal:30
        },
        {
          cartItem:{
            item:{
              barcode: 'ITEM000005',
              name: '方便面',
              unit: '袋',
              price: 4.50
            },
            count:3
          },
          subSave:4.5,
          subTotal:9
        }
      ]);
      const expectCollection = {
        promotionItems:[
          {
            cartItem:{
              item:{
                barcode: 'ITEM000001',
                name: '雪碧',
                unit: '瓶',
                price: 3.00
              },
              count:5
            },
            subSave:3,
            subTotal:12
          },
          {
            cartItem:{
              item:{
                barcode: 'ITEM000003',
                name: '荔枝',
                unit: '斤',
                price: 15.00
              },
              count:2
            },
            subSave:0,
            subTotal:30
          },
          {
            cartItem:{
              item:{
                barcode: 'ITEM000005',
                name: '方便面',
                unit: '袋',
                price: 4.50
              },
              count:3
            },
            subSave:4.5,
            subTotal:9
          }
        ],
        total:51,
        save:7.5
      };

      expect(receiptItems).toEqual(expectCollection);
    });

    it('should build correct receiptText',() => {
      let receiptText = buildReceiptText({
        promotionItems:[
          {
            cartItem:{
              item:{
                barcode: 'ITEM000001',
                name: '雪碧',
                unit: '瓶',
                price: 3.00
              },
              count:5
            },
            subSave:3,
            subTotal:12
          },
          {
            cartItem:{
              item:{
                barcode: 'ITEM000003',
                name: '荔枝',
                unit: '斤',
                price: 15.00
              },
              count:2
            },
            subSave:0,
            subTotal:30
          },
          {
            cartItem:{
              item:{
                barcode: 'ITEM000005',
                name: '方便面',
                unit: '袋',
                price: 4.50
              },
              count:3
            },
            subSave:4.5,
            subTotal:9
          }
        ],
        total:51,
        save:7.5
      });
      const expectText = `***<没钱赚商店>收据***
名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
名称：荔枝，数量：2斤，单价：15.00(元)，小计：30.00(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
----------------------
总计：51.00(元)
节省：7.50(元)
**********************`;

      expect(receiptText).toEqual(expectText);
    });

  });
});
