interface EmailParams {
  to: string;
  subject: string;
  content: string;
}

export class EmailService {
  static async sendEmail({ to, subject, content }: EmailParams): Promise<boolean> {
    // In a real application, this would use a proper email service like SendGrid, AWS SES, etc.
    // For now, we'll simulate the email sending
    console.log(`Sending email to: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content: ${content}`);
    
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 1000);
    });
  }

  static async sendQuizResults(
    email: string,
    userName: string,
    courseName: string,
    score: number,
    totalQuestions: number,
    correctAnswers: number
  ): Promise<boolean> {
    const subject = `Quiz Results: ${courseName}`;
    const content = `
      Hi ${userName},

      Congratulations on completing the quiz for ${courseName}!

      Your Results:
      Score: ${score}%
      Correct Answers: ${correctAnswers}/${totalQuestions}

      ${score >= 70 ? 'Great job! You\'ve passed the quiz!' : 'Keep practicing and try again!'}

      Best regards,
      E-Learning Platform Team
    `;

    return await EmailService.sendEmail({
      to: email,
      subject,
      content
    });
  }

  static async sendCourseCompletionCertificate(
    email: string,
    userName: string,
    courseName: string,
    completionDate: Date
  ): Promise<boolean> {
    const subject = `Course Completion Certificate: ${courseName}`;
    const content = `
      Hi ${userName},

      Congratulations on completing ${courseName}!

      This email confirms that you have successfully completed all requirements
      for the course on ${completionDate.toLocaleDateString()}.

      Your digital certificate is attached. You can also view it in your dashboard.

      Keep up the great work!

      Best regards,
      E-Learning Platform Team
    `;

    return await EmailService.sendEmail({
      to: email,
      subject,
      content
    });
  }
}
