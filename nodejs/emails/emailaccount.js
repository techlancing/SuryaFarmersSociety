/*const sgMail = require('@sendgrid/mail')

const sendgridAPIKey = ''

sgMail.setApiKey(sendgridAPIKey)


const sendWelcomeEmail = (email,name) => {
    sgMail.send({
        to: email,//oUser.sUserEmail, // list of receivers
        from: '"DEEMPORIUM" <info@adaptnext.com>', // sender address
        subject: "Thanks for joining in!", // Subject line
        text: `Welcome to DEEmporium, ${name}.`, // plain text body
    })    
}

const sendCancellationEmail = (email,name) => {
    sgMail.send({
        to: email,//oUser.sUserEmail, // list of receivers
        from: '"DEEMPORIUM" <info@adaptnext.com>', // sender address
        subject: "Sorry to see you go!", // Subject line
        text: `Goodbye, ${name}. We hope to see you back sometime soon.`, // plain text body
    })    
}*/

const nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport
  /*let transporter = nodemailer.createTransport({
    host: "mail.adaptnext.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'info@adaptnext.com', // generated ethereal user
      pass: 'AdaptNext#2020', // generated ethereal password
    },
  });*/

  const sendWelcomeEmail = async(email,name) => {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "mail.adaptnext.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'info@adaptnext.com', // generated ethereal user
        pass: 'AdpNxt#2018', // generated ethereal password
      },
    });

    let mailOptions = {
      from: '"Surya Co-Operative Society Limited" <info@adaptnext.com>', // sender address
      to: email, // list of receivers
      subject: "Thanks for joining in!", // Subject line
      text: `Welcome to Surya Co-Operative Society Limited, ${name}.`,
      //html: "<b>Order Placed successfully</b>", // html body
      //html: `<a href='`+link+`'>link</a>`
      html:`
      <p>Hey ${name},</p>
      <p>I’m Venkata Krishna, the founder of SRI BASARA and I’d like to 
      personally thank you for signing up to our educational app.</p>
      <p>We established Surya Co-Operative Society Limited in order to give you best Banking Service.</p>
      <p>I’d love to hear what you think of our app and if there is anything we can improve. 
      If you have any questions, please reply to this email. I’m always happy to help!</p>
      <p></p>
      <p>Warm Regards,</p>
      <p></p>
      <p>Venkanna</p>
      <p>Founder
      </p>
      `
      //html: ejs.render( fs.readFileSync('e-mail.ejs', 'utf-8') , {mensagem: 'olá, funciona'})
    };
    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
  });
  }

 const sendCancellationEmail = async(email,name) => {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "mail.adaptnext.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'info@adaptnext.com', // generated ethereal user
        pass: 'AdpNxt#2018', // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Surya Co-Operative Society Limited" <info@adaptnext.com>', // sender address
      to: email, // list of receivers
      subject: "Sorry to see you go!", // Subject line
      text: `Goodbye, ${name}. We hope to see you back sometime soon.` // plain text body
      //html: "<b>Order Placed successfully</b>", // html body
      //html: `<a href='`+link+`'>link</a>`
    });
  }

  const sendOrderConfirmationEmail = async(email,name,newOrder) => {
    let item = ``;
    console.log(newOrder);
    for(let i=0;i<newOrder.oCartHistory.items.length;i++){
      item = item + `
      <tr style="margin:0;padding:0">
            <td style="vertical-align:top;margin:0;padding:10px;font-weight:normal;font-size:13px">
            ${ newOrder.oCartHistory.items[i].product.oBasicInfo.sProductName} </td>
            <td style="margin:0;text-align:right;padding:10px;font-weight:normal;font-size:13px;padding-right:200px">
            ${ newOrder.oCartHistory.items[i].quantity }</td>
            
            <td align="right" style="margin:0;padding:10px;font-weight:normal;font-size:13px;padding-right:15px">
            ₹&nbsp;${ newOrder.oCartHistory.items[i].total } </td>
        </tr>
        <tr width="100%">
            <td>
                <div style="min-height:1px;width:100%;background:#e9e9e9;clear:both"></div>
            </td>
            <td>
                <div style="min-height:1px;width:100%;background:#e9e9e9;clear:both"></div>
            </td>
            <td>
                <div style="min-height:1px;width:100%;background:#e9e9e9;clear:both"></div>
            </td>
        </tr>
      `;
    }

    let shippingaddElem = ``;
    
    let htmlelem = `
    <div style="background-color:white;display:grid;
    gap:20px;">
    <table width="100%" cellspacing="0" cellpadding="0" style="margin:0;padding:0">
    <tbody><tr style="margin:0;padding:0">
        <td valign="top" align="center" width="100" style="margin:0;padding:0">
            <img alt="Surya Co-Operative Society Limited" style="width:120px;margin:10px 0;padding:0;max-width:100%" 
            src="https://scslapp.suryacoperativesocietylimited.com/assets/images/logo-light.png" >
        </td>
    </tr>
  </tbody></table>
      <p>Hello ${name}, Your order is placed successfully</p
      <p style="font-weight:bold">ORDER ID:${newOrder.nOrderId}</p>
      <p style="margin:10px 0 0;padding:0;color:#1a1a1a;font-size:13px">Order placed at: 
      <strong>${newOrder.createdAt}</strong></p>
      <div style="display:grid">
      <p>Delivery to:</p>
      <p style="margin:0">${newOrder.oShippingAddress.sUserName}</p>
      <p style="margin:0">${newOrder.oShippingAddress.sAddressline}</p>
      <p style="margin:0">${newOrder.oShippingAddress.nMobile}</p>
      <p style="margin:0">${newOrder.oShippingAddress.sUserEmail}</p>
      </div>
      <p></p>
      <table  cellspacing="0" cellpadding="0" style="margin:0;padding:0;width:calc(100% - 40px)">
        <thead style="margin:0;padding:0;text-align:left;background:#e9e9e9;border-collapse:collapse;border-spacing:0;border-color:#ccc">
        <tr style="margin:0;padding:0">
            <th style="margin:0;padding:10px 15px;font-size:13px">Item Name</th>
            <th style="margin:0;padding:10px 15px;font-size:13px;text-align:right;padding-right:180px">Quantity</th>
            <th align="right" style="margin:0;padding:10px 15px;font-size:13px">Price</th>
        </tr>
        </thead>
        <tbody style="margin:0;padding:0">
    ${item}
    <tr><td><span>
        <span>
            </span></span></td></tr><tr style="margin:0;padding:0">
                <td width="80%" scope="row" colspan="2" style="margin:0;padding:10px 0;text-align:right;font-weight:normal;
                border:0;font-size:13px">Subtotal:</td>
                <td width="20%" style="margin:0;padding:5px 0;font-weight:normal;
                border-bottom:0px solid #e9e9e9;font-size:13px;text-align:right;
                border:0;padding-right:15px"> ₹&nbsp;${newOrder.oCartHistory.subtotal}</td>
            </tr>
    <tr><td><span>
        <span>
            </span></span></td></tr><tr style="margin:0;padding:0">
                <td width="80%" scope="row" colspan="2" style="margin:0;padding:10px 0;text-align:right;font-weight:normal;
                border:0;font-size:13px">${newOrder.oCartHistory.totals[0].title}:</td>
                <td width="20%" style="margin:0;padding:5px 0;font-weight:normal;
                border-bottom:0px solid #e9e9e9;font-size:13px;text-align:right;
                border:0;padding-right:15px"> ₹&nbsp;${newOrder.oCartHistory.totals[0].price}</td>
            </tr>
    <tr><td><span>
        <span>
            </span></span></td></tr><tr style="margin:0;padding:0">
                <td width="80%" scope="row" colspan="2" style="margin:0;padding:10px 0;
                text-align:right;font-weight:normal;border:0;
                font-size:13px">${newOrder.oCartHistory.totals[2].title}:</td>
                <td width="20%" style="margin:0;padding:5px 0;font-weight:normal;
                border-bottom:0px solid #e9e9e9;font-size:13px;text-align:right;
                border:0;padding-right:15px"> ₹&nbsp;${newOrder.oCartHistory.totals[2].price}</td>
            </tr>
    <tr><td><span>
        
        
        <span>
            </span></span></td></tr><tr style="margin:0;padding:0">
                <td width="80%" scope="row" colspan="2" style="margin:0;padding:10px 0;
                text-align:right;font-weight:normal;border:0;
                font-size:13px">${newOrder.oCartHistory.totals[3].title}:</td>
                <td width="20%" style="margin:0;padding:5px 0;font-weight:normal;
                border-bottom:0px solid #e9e9e9;font-size:13px;text-align:right;
                border:0;padding-right:15px"> ₹&nbsp;${newOrder.oCartHistory.totals[3].price}</td>
            </tr>
        
    
    <tr width="100%">
        <td>
            <div style="width:100%;clear:both"></div>
        </td>
        <td>
            <div style="min-height:15px;width:100%;clear:both"></div>
        </td>
        <td>
            <div style="min-height:15px;width:100%;clear:both"></div>
        </td>
    </tr>
    <tr style="margin:0;padding:0;color:#79b33b;background:#f9f9f9">
        <th width="80%" scope="row" colspan="2" style="margin:0;padding:10px 0;
        text-align:right;font-weight:bold;border:0;font-size:13px">Order Total:</th>
        <td width="20%" style="margin:0;padding:10px 0;font-weight:bold;
        border-bottom:1px solid #e9e9e9;font-size:13px;text-align:right;
        border:0;padding-right:15px"> ₹&nbsp;${newOrder.oCartHistory.total}</td>
    </tr>
    <tr><td><span>
    </span>
    </td></tr></tbody>
  </table>
  <p>For more information, please login to 
  <a href="https://scslapp.suryacoperativesocietylimited.com">suryacoperativesocietylimited.com</a></p>
    </div>
    
    `;
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "mail.adaptnext.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'info@adaptnext.com', // generated ethereal user
        pass: 'AdpNxt#2018', // generated ethereal password
      },
    });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Surya Co-Operative Society Limited" <info@adaptnext.com>', // sender address
    to: email, // list of receivers
    subject: "Order Placed successfully", // Subject line
    text: `Hello ${name}, Your order is placed successfully`, // plain text body
    html: htmlelem, // html body
    //html: `<a href='`+link+`'>link</a>`
  });
}

const sendOtpForForgotPasswordEmail = async(email,otp) => {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "mail.adaptnext.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'info@adaptnext.com', // generated ethereal user
        pass: 'AdpNxt#2018', // generated ethereal password
      },
    });
  
    let mailOptions = {
      from: '"Surya Co-Operative Society Limited" <info@adaptnext.com>', // sender address
      to: email, // list of receivers
      subject: "OTP for forgot password", // Subject line
      text: `Hello , OTP for forgot password is ${otp}.`,
      //html: "<b>Order Placed successfully</b>", // html body
      //html: `<a href='`+link+`'>link</a>`
      /*html:`
      <p>Hey ${name},</p>
      <p>I’m Kishore, the co-founder of DEEmporium and I’d like to 
      personally thank you for signing up to our ecommerce app.</p>
      <p>We established DEEmporium in order to give you best shopping experience.</p>
      <p>I’d love to hear what you think of our app and if there is anything we can improve. 
      If you have any questions, please reply to this email. I’m always happy to help!</p>
      <p></p>
      <p>Warm Regards,</p>
      <p></p>
      <p>Kishore</p>
      <p>Co-Founder
      </p>
      `*/
      //html: ejs.render( fs.readFileSync('e-mail.ejs', 'utf-8') , {mensagem: 'olá, funciona'})
    };
    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
  });
  }

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail,
  sendOrderConfirmationEmail,
  sendOtpForForgotPasswordEmail

}