import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface ContactFormData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    countryCode: string; // Add this field
    message: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: ContactFormData = await request.json();
        const {
            firstName,
            lastName,
            email,
            phoneNumber,
            countryCode,
            message,
        } = body;

        // Validate required fields
        if (
            !firstName ||
            !lastName ||
            !email ||
            !phoneNumber ||
            !countryCode ||
            !message
        ) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { message: "Invalid email format" },
                { status: 400 }
            );
        }

        // Create transporter with your Gmail credentials
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "Millenniumstar.be@gmail.com", // Your Gmail address
                pass: "sdgt pvaj mtnz pwna", // Your Gmail app password
            },
        });

        // Email content for admin notification
        const adminMailOptions = {
            from: "Millenniumstar.be@gmail.com",
            to: "Millenniumstar.be@gmail.com", // Admin email
            subject: `Millennium Star - Inquiry - ${firstName} ${lastName}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333; border-bottom: 2px solid #4A5568; padding-bottom: 10px;">
                        Millennium Star - Inquiry
                    </h2>
                    
                    <div style="background-color: #f7f7f7; padding: 20px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="color: #2D3748; margin-top: 0;">Contact Details:</h3>
                        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Phone:</strong> ${countryCode} ${phoneNumber}</p>
                    </div>
                    
                    <div style="background-color: #fff; padding: 20px; border-left: 4px solid #4A5568; margin: 20px 0;">
                        <h3 style="color: #2D3748; margin-top: 0;">Message:</h3>
                        <p style="line-height: 1.6;">${message}</p>
                    </div>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #718096;">
                        <p>This email was sent from the contact form on your Millenium Star website.</p>
                        <p>Received at: ${new Date().toLocaleString()}</p>
                    </div>
                </div>
            `,
        };

        // Email content for customer confirmation
        const customerMailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: "Thank you for contacting Millenium Star",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background-color: #2D3748; color: white; padding: 20px; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px; letter-spacing: 2px;">Millenium Star</h1>
                    </div>
                    
                    <div style="padding: 30px 20px;">
                        <h2 style="color: #2D3748;">Thank you for reaching out, ${firstName}!</h2>
                        
                        <p style="line-height: 1.6; color: #4A5568;">
                            We have received your message and appreciate you taking the time to contact us. 
                            Our team will review your inquiry and get back to you within 24-48 hours.
                        </p>
                        
                        <div style="background-color: #f7f7f7; padding: 20px; border-radius: 5px; margin: 20px 0;">
                            <h3 style="color: #2D3748; margin-top: 0;">Your Message Summary:</h3>
                            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                            <p><strong>Email:</strong> ${email}</p>
                            <p><strong>Phone:</strong> ${countryCode} ${phoneNumber}</p>
                            <p><strong>Message:</strong> ${message}</p>
                        </div>
                        
                        <p style="line-height: 1.6; color: #4A5568;">
                            If you have any urgent inquiries, please feel free to call us directly or visit our inventory page.
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${"https://diamond-elite.vercel.app/"}" 
                               style="background-color: #2D3748; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                                View Our Inventory
                            </a>
                        </div>
                    </div>
                    
                    <div style="background-color: #f7f7f7; padding: 20px; text-align: center; font-size: 12px; color: #718096;">
                        <p>© ${new Date().getFullYear()} Millenium Star . All rights reserved.</p>
                        <p>This is an automated response. Please do not reply to this email.</p>
                    </div>
                </div>
            `,
        };

        // Send emails
        await transporter.sendMail(adminMailOptions);
        await transporter.sendMail(customerMailOptions);

        return NextResponse.json(
            { message: "Message sent successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Contact form error:", error);
        return NextResponse.json(
            { message: "Failed to send message. Please try again later." },
            { status: 500 }
        );
    }
}
