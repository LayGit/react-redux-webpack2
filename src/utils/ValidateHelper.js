/**
 * 身份证15位编码规则：dddddd yymmdd xx p
 * dddddd：地区码
 * yymmdd: 出生年月日
 * xx: 顺序类编码，无法确定
 * p: 性别，奇数为男，偶数为女
 * <p />
 * 身份证18位编码规则：dddddd yyyymmdd xxx y
 * dddddd：地区码
 * yyyymmdd: 出生年月日
 * xxx:顺序类编码，无法确定，奇数为男，偶数为女
 * y: 校验码，该位数值可通过前17位计算获得
 * <p />
 * 18位号码加权因子为(从右到左) Wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2,1 ]
 * 验证位 Y = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ]
 * 校验位计算公式：Y_P = mod( ∑(Ai×Wi),11 )
 * i为身份证号码从右往左数的 2...18 位; Y_P为脚丫校验码所在校验码数组位置
 *
 */
var Wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1 ];// 加权因子
var ValideCode = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ];// 身份证验证位值.10代表X
function IdCardValidate(idCard) {
    if (!idCard)
      return false
    idCard = trim(idCard.replace(/ /g, ""));
    if (idCard.length == 15) {
        return isValidityBrithBy15IdCard(idCard);
    } else if (idCard.length == 18) {
        var a_idCard = idCard.split("");// 得到身份证数组
        if(isValidityBrithBy18IdCard(idCard)&&isTrueValidateCodeBy18IdCard(a_idCard)){
            return true;
        }else {
            return false;
        }
    } else {
        return false;
    }
}
/**
 * 判断身份证号码为18位时最后的验证位是否正确
 * @param a_idCard 身份证号码数组
 * @return
 */
function isTrueValidateCodeBy18IdCard(a_idCard) {
    var sum = 0; // 声明加权求和变量
    if (a_idCard[17].toLowerCase() == 'x') {
        a_idCard[17] = 10;// 将最后位为x的验证码替换为10方便后续操作
    }
    for ( var i = 0; i < 17; i++) {
        sum += Wi[i] * a_idCard[i];// 加权求和
    }
    var valCodePosition = sum % 11;// 得到验证码所位置
    if (a_idCard[17] == ValideCode[valCodePosition]) {
        return true;
    } else {
        return false;
    }
}
/**
 * 通过身份证判断是男是女
 * @param idCard 15/18位身份证号码
 * @return 'female'-女、'male'-男
 */
function maleOrFemalByIdCard(idCard){
    idCard = trim(idCard.replace(/ /g, ""));// 对身份证号码做处理。包括字符间有空格。
    if(idCard.length==15){
        if(idCard.substring(14,15)%2==0){
            return 'female';
        }else{
            return 'male';
        }
    }else if(idCard.length ==18){
        if(idCard.substring(14,17)%2==0){
            return 'female';
        }else{
            return 'male';
        }
    }else{
        return null;
    }
}
 /**
  * 验证18位数身份证号码中的生日是否是有效生日
  * @param idCard 18位书身份证字符串
  * @return
  */
function isValidityBrithBy18IdCard(idCard18){
    var year =  idCard18.substring(6,10);
    var month = idCard18.substring(10,12);
    var day = idCard18.substring(12,14);
    var temp_date = new Date(year,parseFloat(month)-1,parseFloat(day));
    // 这里用getFullYear()获取年份，避免千年虫问题
    if(temp_date.getFullYear()!=parseFloat(year)
          ||temp_date.getMonth()!=parseFloat(month)-1
          ||temp_date.getDate()!=parseFloat(day)){
            return false;
    }else{
        return true;
    }
}
/**
 * 验证15位数身份证号码中的生日是否是有效生日
 * @param idCard15 15位书身份证字符串
 * @return
 */
function isValidityBrithBy15IdCard(idCard15){
    var year =  idCard15.substring(6,8);
    var month = idCard15.substring(8,10);
    var day = idCard15.substring(10,12);
    var temp_date = new Date(year,parseFloat(month)-1,parseFloat(day));
    // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法
    if(temp_date.getYear()!=parseFloat(year)
            ||temp_date.getMonth()!=parseFloat(month)-1
            ||temp_date.getDate()!=parseFloat(day)){
              return false;
      }else{
          return true;
      }
}
//去掉字符串头尾空格
function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

/**
  * 现行 16 位银联卡现行卡号开头 6 位是 622126～622925 之间的，7 到 15 位是银行自定义的，
  * 可能是发卡分行，发卡网点，发卡序号，第 16 位是校验码。
  * 16 位卡号校验位采用 Luhm 校验方法计算：
  * 1，将未带校验位的 15 位卡号从右依次编号 1 到 15，位于奇数位号上的数字乘以 2
  * 2，将奇位乘积的个十位全部相加，再加上所有偶数位上的数字
  * 3，将加法和加上校验位能被 10 整除。
**/
function validateBankCard(cardNum) {
  // 卡号16-19位
  if (!/^[0-9]{16,19}$/.test(cardNum))
    return false
  var bit = getBankCardCheckCode(cardNum.substring(0, cardNum.length - 1))
  return cardNum.charAt(cardNum.length - 1) == bit
}

// 从不含校验位的银行卡卡号采用 Luhm 校验算法获得校验位
function getBankCardCheckCode(nonCheckCodeCardNum) {
  var chs = nonCheckCodeCardNum.split('') // 转成 char 数组
  var luhmSum = 0
  for(var i = chs.length - 1, j = 0; i >= 0; i--, j++) {
      var k = chs[i] - '0'
      if(j % 2 == 0) {
          k *= 2
          k = parseInt(k / 10 + k % 10)
      }
      luhmSum += k
  }
  return (luhmSum % 10 == 0) ? '0' : (10 - luhmSum % 10).toString()
}

// 验证金额
function validateAmount(amount) {
  return /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/.test(amount)
}

export default {
  idCard: IdCardValidate,
  bankCard: validateBankCard,
  amount: validateAmount
}
