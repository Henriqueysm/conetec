require('dotenv').config();
const sgMail = require('@sendgrid/mail');
const fs = require('fs');
const path = require('path');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({ to, subject, codigo }) => {
  if (!to) throw new Error('O endereço de email do destinatário não foi fornecido.');
  if (!process.env.EMAIL_USER) throw new Error('EMAIL_USER não está definido.');

  // Caminho do template HTML
  const templatePath = path.join(__dirname, '../templates/email_verificacao.html');
  
  // Lê o HTML e substitui o placeholder {{codigo}}
  const html = fs.readFileSync(templatePath, 'utf8').replace('{{codigo}}', codigo);

  const msg = {
    to,
    from: process.env.EMAIL_USER,
    subject,
    html
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Email enviado para ${to}`);
  } catch (err) {
    console.error('❌ Erro ao enviar email:', err);
    throw err;
  }
};

module.exports = { sendEmail };
