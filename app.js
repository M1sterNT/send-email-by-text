const nodemailer = require('nodemailer');
const readF = require('readline')

/* Account UserName */
const account = {
    user: "",
    pass: "",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    tls:true
};

/* Mail Option */
const mailOption = {
    from: '"Mailer@Computer System Administrator Group"' + account.user, // sender address
    subject: 'CSAG 2018 Mailler', // Subject line
};



let email_List = []
let lineReader = readF.createInterface({
    input: require('fs').createReadStream('email.txt')
});

lineReader.on('line', function (line) {
    email_List.push(line)
});

lineReader.on('close', function (line) {
    recursive()
});


function recursive() {
    let email = email_List.pop()
    console.log("SYSTEM[load]: email sent by : "+email);

    if (email === undefined) return
    sendMail(email,function (error, res) {
        if (error === null) {
            recursive()
        }
    })
}
async function sendMail(email, callback) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: account.host,
        port: account.port,
        secure: account.secure, // true for 465, false for other ports
        tls:account.tls,
        auth: {
            user: account.user, // generated ethereal user
            pass: account.pass // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: mailOption.from, // sender address
        to: email, // list of receivers
        subject: mailOption.subject, // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>Hello world?</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            callback(error, null)
            return console.log(error);
        }
        console.log('Email To: %s', mailOptions.to);
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        callback(null, email)
    });
}
