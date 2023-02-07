import twilio from 'twilio';
import nodemailer from 'nodemailer';

const emailTemplate = `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
<div style="margin:50px auto;width:70%;padding:20px 0">
  <div style="border-bottom:1px solid #eee">
    <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">QR PETS</a>
  </div>
  <p style="font-size:1.1em">Hola,</p>
  <p>Nos complace informarle que hemos recibido información sobre la geolocalización de su mascota perdida. Hemos recibido una alerta de uno de nuestros usuarios que ha escaneado el collar QR de su mascota y ha decidido contactarnos para compartir la ubicación donde se encontró su mascota.</p>
  <a href="{{link}}">
    Da click en este enlace para visualizar la localización de tu mascota
  </a>
  <p>
    Informante:
    <ul>
      <li>Nombre: {{helperName}}</li>
      <li>Teléfono: {{helperPhone}}</li>
      <li>Correo: {{helperEmail}}</li>
    </ul>
  </p>
  <p style="font-size:0.9em;">Saludos,<br />QR Pets</p>
  <hr style="border:none;border-top:1px solid #eee" />
  <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
    <p>QR PETS SA</p>
    <p>Quito</p>
    <p>Ecuador</p>
  </div>
</div>
</div>`

const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
      user: 'rhh.pronaca@outlook.com',
      pass: 'UKRtG``Az9Y[Nm+<\'h:_'
  }
});

export default async function handler(req, res) {
  const {
    latitude,
    longitude,
    helperName,
    helperPhone,
    helperEmail,
    ownerPhone,
    ownerEmail,
  } = req.body;

  console.log({
    body: req.body,
  });

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = twilio(accountSid, authToken);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  const mailBody = emailTemplate.replace('{{link}}', googleMapsUrl).replace('{{helperName}}', helperName).replace('{{helperPhone}}', helperPhone).replace('{{helperEmail}}', helperEmail);

  const mailOptions = {
    // from: process.env.EMAIL_USER,
    from: 'rhh.pronaca@outlook.com',
    to: ownerEmail,
    subject: 'QR Pets - Se ha encontrado a su mascota',
    html: mailBody,
  };
  const promises = [];

  promises.push(transporter.sendMail(mailOptions))

  promises.push(client.messages.create({
    body: `Hola, se ha notificato la ubicación de tu mascota: ${googleMapsUrl}`,
    from: '+12764214127',
    to: `+593${ownerPhone.slice(1)}`,
  }));

  promises.push(client.messages.create({
    body: `Hola, se ha notificado que se ha encontrado a su mascota. Por favor, diríjase a la siguiente ubicación.\nInformación de contacto: \nNombre: ${helperName}\nTeléfono: ${helperPhone}\nCorreo: ${helperEmail}`,
    from: 'whatsapp:+14155238886',
    to: `whatsapp:+593${ownerPhone.slice(1)}`,
  }))

  promises.push(client.messages
  .create({
      from: 'whatsapp:+14155238886',
      body: 'Ubicación de la mascota:',
      to: `whatsapp:+593${ownerPhone.slice(1)}`,
      persistentAction: ['geo:' + latitude + ',' + longitude]
  }))

  await Promise.all(promises);


  res.status(200).json({ message: 'ok' });
}