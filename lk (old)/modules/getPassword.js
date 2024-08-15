module.exports = function genPassword = (len, symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789") =>
{
    var password = "";
    for (var i = 0; i < len; i++) password += symbols.charAt(Math.floor(Math.random() * symbols.length));     
    
    return password;
}