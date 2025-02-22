import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import envConfig from '../config';

@Injectable()
export class EmailService {
  private resend: Resend;
  constructor() {
    this.resend = new Resend(envConfig.RESEND_API_KEY);
  }

  sendOTP(payload: { email: string; code: string }) {
    return this.resend.emails.send({
      from: 'Ecomerce <onboarding@resend.dev>',
      to: ['lephuong10142002@gmail.com'],
      subject: 'Mã OTP',
      html: `<strong>${payload.code}</strong>`,
    });
  }
}
