/**
 * 验证规则
 * validation rules
 */

// 验证电子邮件地址格式
// Validate email address format
export const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};
// 验证账号
// verify account
export const isValidUsername = (username) => {
    const re = /^[A-Za-z0-9_@.]{2,18}$/;
    return re.test(username);
  }
// 验证密码是否符合要求
//密码必须包含至少一个数字、一个小写字母、一个大写字母 8-16位 允许有下划线
// Verify that the password meets the requirements
//Password must contain at least one number, one lowercase letter, one uppercase letter, 8-16 digits, underscore is allowed
 export const isValidPassword = (password) => {
    // const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,16}$/;
    const re = /^[A-Za-z0-9_@.]{3,18}$/;
    return re.test(password);
};

// 验证确认密码是否与密码匹配
// Verify that the password matches the password
export const isConfirmPasswordMatched = (password, confirmPassword) => {
    return password === confirmPassword;
};

// 验证字符串是否为空
// Verify that the string is empty
export const isNotEmpty = (str) => {
    return str.trim() !== '';
};

// 验证字符串是否是数字
// Verify that the string is a number
export const isNumber = (str) => {
    return !isNaN(str);
};

export const maxLength = (value, length) => {
    if (value.length > length) {
        return `This field cannot exceed ${length} characters`;
    }
};
//判断货币符号
// determine the currency symbol
export const validateCurrencySymbol = (inputString) => {
    const currencySymbols = ['$', '€', '¥', '£', '₽', '₹', '₩', '₺', '₴', '₿'];
    const pattern = new RegExp(`^[${currencySymbols.join('')}]`);
    return pattern.test(inputString);
  };