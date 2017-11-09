module.exports = (doc) => {
  let output = {
    status: 200
  };
  output.html = '<div>Your payment has been successfully created, your Reference Code is <strong>'+doc.referenceCode+'</strong></div><div>You can check this payment record by your First Name , Last Name, Phone Number and Reference Code <a href="/paymentCheckingForm?fn='+doc.firstName+'&ln='+doc.lastName+'&pn='+doc.phoneNumber+'&rc='+doc.referenceCode+'" >here</a>.</div>';
  output.paymentCheckingFormURL = '/paymentCheckingForm?fn='+doc.firstName+'&ln='+doc.lastName+'&pn='+doc.phoneNumber+'&rc='+doc.referenceCode;
  output.referenceCode=doc.referenceCode;
  return output;
}
