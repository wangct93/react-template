


/**
 * 字典格式化
 * @param data
 * @param valueField
 * @param textField
 * @returns {*}
 */
export function dicFormatter(data,valueField,textField){
  return toAry(data).map((item) => ({
    ...item,
    text:item[textField],
    value:item[valueField],
  }));
}

/**
 * 获取字典格式化
 * @param valueField
 * @param textField
 * @returns {function(*=): *}
 */
export function getDicFormatter(valueField,textField){
  return (data) => {
    return dicFormatter(data,valueField,textField);
  }
}
