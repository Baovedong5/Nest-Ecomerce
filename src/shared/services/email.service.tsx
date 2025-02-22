import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import envConfig from '../config';
import { OTPEmail } from 'emails/otp';
import * as React from 'react';

@Injectable()
export class EmailService {
  private resend: Resend;
  constructor() {
    this.resend = new Resend(envConfig.RESEND_API_KEY);
  }

  sendOTP(payload: { email: string; code: string }) {
    const subject = 'Mã OTP';

    return this.resend.emails.send({
      from: 'Ecomerce <onboarding@resend.dev>',
      to: ['lephuong10142002@gmail.com'],
      subject: 'Mã OTP',
      react: <OTPEmail code={payload.code} title={subject} />,
    });
  }
}
