const cloudinary = require("cloudinary").v2;

try {
  cloudinary.config({
    cloud_name: "dhdz1ujwf",
    api_key: "918525894218944",
    api_secret: "qvLTdWU3AIpNPjyc3TKP5AwiFS0",
  });
  console.log("Cloudinary configured");
} catch (err) {
  console.log(err);
}

module.exports = cloudinary;