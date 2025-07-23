import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MailService {
    private transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    async sendTemplateEmail(
        to: string,
        subject: string,
        templateName: string,
        context: Record<string, any>
    ) {
        const templatePath = path.join(__dirname, 'templates', `${templateName}.html`);
        const source = fs.readFileSync(templatePath, 'utf8');
        const compiledTemplate = handlebars.compile(source);
        const html = compiledTemplate(context);

        await this.transporter.sendMail({
            from: process.env.MAIL_USER,
            to,
            subject,
            html,
        });
    }
}
