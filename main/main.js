const datbase = require('../main/datbase');

function printInventory(inputs) {
    var name = getItemName(inputs);
    var unit = getItemUnit(inputs);
    var price = getItemPrice(inputs);
    var items = countItemsNum(inputs);
    var allPrice = 0;
    var savePrice = 0;
    var promotionItems = new Array();
    var result = '***<没钱赚商店>购物清单***\n';
    for (var i in items) {
        var item = items[i];
        result += '名称：' + getItemName(item.code) + '，数量：' + item.num + getItemUnit(item.code) + '，单价：'
            + toDecimal(getItemPrice(item.code)) + '(元)，小计：' + toDecimal(calculationPrice(item.code, item.num)) + '(元)\n';
        allPrice += calculationPrice(item.code, item.num);
        promotionItems.push({'code': item.code, 'num': calculationPromotionNum(item.code, item.num)})
    }
    result += '----------------------\n';
    result += '挥泪赠送商品：\n';
    for (var j in promotionItems) {
        var promotionItem = promotionItems[j];
        if (promotionItem.num == 0)
            continue;
        result += '名称：' + getItemName(promotionItem.code) + '，数量：' + promotionItem.num + getItemUnit(promotionItem.code) + '\n';
        savePrice += promotionItem.num * getItemPrice(promotionItem.code);
    }
    result += '----------------------\n';
    result += '总计：' + toDecimal(allPrice) + '(元)\n';
    result += '节省：' + toDecimal(savePrice) + '(元)\n';
    result += '**********************';
    console.log(result);
}

/**
 * 统计所有商品数量
 */
function countItemsNum(inputs) {
    var items = new Array();
    for (var item in inputs) {
        if (inputs[item].indexOf('-') != -1) {
            var itemArr = inputs[item].split('-');
            var code = itemArr[0];
            var num = itemArr[1];
            if (isExistItem(items, code))
                addItemCount(items, code, num);
            else
                items.push({'code': code, 'num': num});
        } else {
            if (isExistItem(items, inputs[item]))
                addItemCount(items, inputs[item], 1);
            else
                items.push({'code': inputs[item], 'num': 1});
        }
    }
    return items;
}

/**
 * 如果数组已存在，则给其对应项增加相应数量
 */
function addItemCount(items, code, num) {
    for (var i in items) {
        if (items[i].code == code)
            items[i].num += num;
    }
}

/**
 * 判断数组中是否已存在对应项
 */
function isExistItem(items, code) {
    for (var i in items) {
        if (items[i].code == code)
            return true;
    }
    return false;
}

/**
 * 计算商品小计
 */
function calculationPrice(code, num) {
    if (isPromotion(code)) {
        var i = parseInt(num / 3);
        var j = num % 3;
        return (i * 2 + j) * getItemPrice(code);
    }
    return parseInt(num) * getItemPrice(code);
}

/**
 * 计算促销数量
 */
function calculationPromotionNum(code, num) {
    if (isPromotion(code)) {
        var i = parseInt(num / 3);
        var j = num % 3;
        return num - (i * 2 + j);
    }
    return 0;
}

/**
 * 判断商品是否促销
 */
function isPromotion(code) {
    var promotions = datbase.loadPromotions();
    for (var promotion in promotions) {
        if (promotions[promotion].type == 'BUY_TWO_GET_ONE_FREE') {
            for (var promotionCode in promotions[promotion].barcodes) {
                if (promotions[promotion].barcodes[promotionCode] == code)
                    return true;
            }
        }
    }
    return false;
}

/**
 * 获取商品单价
 */
function getItemPrice(code) {
    var allItems = datbase.loadAllItems();
    for (var item in allItems) {
        if (allItems[item].barcode == code)
            return allItems[item].price;
    }
    return allItems[item].price;
}

/**
 * 获取商品名称
 */
function getItemName(code) {
    var allItems = datbase.loadAllItems();
    for (var item in allItems) {
        if (allItems[item].barcode == code)
            return allItems[item].name;
    }
    return allItems[item].name;
}

/**
 * 获取商品单位
 */
function getItemUnit(code) {
    var allItems = datbase.loadAllItems();
    for (var item in allItems) {
        if (allItems[item].barcode == code)
            return allItems[item].unit;
    }
    return allItems[item].unit;
}

/**
 * 将数字保留两位小数
 */
function toDecimal(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    var f = Math.round(x * 100) / 100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }
    return s;
}

exports.printInventory = printInventory;
module.exports ={countItemsNum,getItemName,getItemUnit,getItemPrice};