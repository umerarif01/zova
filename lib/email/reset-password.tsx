import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components";

interface ResetPasswordEmailProps {
  resetLink: string;
}

export function ResetPasswordEmail({ resetLink }: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Reset your password</Heading>
          <Text style={text}>
            Click the link below to reset your password. This link will expire
            in 1 hour.
          </Text>
          <Link style={button} href={resetLink}>
            Reset Password
          </Link>
          <Text style={text}>
            {`If you didn't request this, please ignore this email.`}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const h1 = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "normal",
  textAlign: "center" as const,
  margin: "30px 0",
};

const text = {
  color: "#4c4c4c",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#8b5cf6",
  borderRadius: "4px",
  color: "#fff",
  display: "block",
  fontSize: "16px",
  fontWeight: "bold",
  textAlign: "center" as const,
  textDecoration: "none",
  padding: "12px",
  margin: "24px auto",
};
