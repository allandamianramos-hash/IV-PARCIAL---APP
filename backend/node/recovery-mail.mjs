import nodemailer from 'nodemailer';

export function mailConfigured(env=process.env){
  return !!(env.MAIL_SMTP_HOST && env.MAIL_SMTP_USER && env.MAIL_SMTP_PASSWORD && env.MAIL_FROM && env.MAIL_RESET_SECRET?.length>=32);
}
export function mailTransport(){
  return nodemailer.createTransport({
    host:process.env.MAIL_SMTP_HOST,port:Number(process.env.MAIL_SMTP_PORT||465),
    secure:process.env.MAIL_SMTP_SECURE!=='false',requireTLS:true,
    auth:{user:process.env.MAIL_SMTP_USER,pass:process.env.MAIL_SMTP_PASSWORD?.replace(/\s/g,'')},
    connectionTimeout:8000,greetingTimeout:8000,socketTimeout:12000,
    disableFileAccess:true,disableUrlAccess:true,logger:false,debug:false
  });
}
export async function sendRecoveryCode(email,code){
  const transport=mailTransport();
  let deadline;
  const text=`Tu código de recuperación de Rumbo es: ${code}\n\nVence en 10 minutos y solo puede usarse una vez. No compartas este código.\nSi no solicitaste cambiar tu contraseña, ignora este correo. Tu contraseña no ha cambiado.\n\nRumbo`;
  try{
    const delivery=transport.sendMail({from:{name:process.env.MAIL_FROM_NAME||'Rumbo',address:process.env.MAIL_FROM},to:email,subject:'Tu código de recuperación de Rumbo',text,
      html:`<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;color:#202724"><h1 style="font-size:28px">rumbo ↗</h1><h2 style="font-size:22px">Recupera tu cuenta</h2><p>Introduce este código en Rumbo:</p><p style="font-size:32px;font-weight:bold;letter-spacing:6px;padding:24px;background:#edf2e4;border-radius:12px">${code}</p><p>Vence en 10 minutos y solo puede usarse una vez.</p><p style="color:#59625d;font-size:13px">No compartas el código. Si no lo solicitaste, ignora este correo. Tu contraseña no ha cambiado.</p></div>`});
    const result=await Promise.race([delivery,new Promise((_,reject)=>{deadline=setTimeout(()=>{transport.close();reject(Error('MAIL_TIMEOUT'));},12000);})]);
    if(!result.accepted?.length)throw Error('MAIL_REJECTED');
  }finally{clearTimeout(deadline);transport.close();}
}
