const QRCode = require("qrcode");

const generateQR = async (data) => {
  return await QRCode.toDataURL(data);
};

module.exports = generateQR;