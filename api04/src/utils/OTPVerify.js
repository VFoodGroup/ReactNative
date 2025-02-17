function otpVerify(storedOtp, inputOtp) {
    return storedOtp === inputOtp;
  }
  
  module.exports = otpVerify;