var nodemailer = require('nodemailer');

const { readFileSync, writeFileSync } = require('fs');

let configOptions = {
    host: "post.mail.kz",
    port: 465,
    tls: {
        rejectUnauthorized: true,
        minVersion: "TLSv1.2"
    },
    secure: true,
    auth: {
        user: 'oil_sea_kazakhstan@mail.kz',
        pass: 'Zinka2030'
    }
}

// const file = readFileSync('./email.txt', {encoding: 'utf-8'});
const text = readFileSync('./text.txt', { encoding: 'utf-8' });

// const emailList = file.split('\n');

// const emailObject = {}
// for(const email of emailList) {
//     emailObject[email.trim()] = true;
// }

// writeFileSync('./emails.json', JSON.stringify(emailObject, null, 4), {encoding: 'utf-8'});
const emailObject = JSON.parse(readFileSync('./emails.json', { encoding: 'utf-8' }));

const pureEmails = Object.keys(emailObject);


console.log(pureEmails.length);
console.log(pureEmails);

var transporter = nodemailer.createTransport(configOptions);
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
async function send() {
    for (const email of pureEmails) {
        
        if (emailObject[email] === false) {
            console.log('skipped for ', email);
            continue;
        }

        await delay(10000);

        console.log('sending for ', email);

        transporter.verify(function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log("Server is ready to take our messages");
            }
        });

        var mailOptions = {
            from: 'oil_sea_kazakhstan@mail.kz',
            to: email,
            subject: 'We are looking for 90 tons of oil per month',
            text: text,
            attachments: [
                {
                    filename: 'total elf.xlsx',
                    path: './total elf.xlsx',
                },
            ]
        };

       
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                emailObject[email] = false;
                writeFileSync('./emails.json', JSON.stringify(emailObject, null, 4), { encoding: 'utf-8' });        
                console.log('Email sent: ' + info.response);
            }
        });
    }
}

send();