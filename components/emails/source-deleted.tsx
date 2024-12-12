import {
  Body,
  Container,
  Column,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Row,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface EmailProps {
  firstName: string;
  sourceName: string;
}

export const SourceDeletedEmail = ({ firstName, sourceName }: EmailProps) => (
  <Html>
    <Tailwind>
      <Body className="bg-white font-sans">
        <Container className="bg-white font-sans border border-solid border-gray-200 rounded my-10 mx-auto p-5 max-w-[600px]">
          <Section className="py-10 px-[74px] text-center">
            <Img
              src={`https://zova.vercel.app/zova-logo.png`}
              width="42"
              height="42"
              className="mx-auto"
            />
            <Heading className="text-xl leading-tight font-bold text-center tracking-tight text-black">
              Your Knowledge Source Has Been Deleted
            </Heading>
            <Text className="text-gray-600 text-xl font-medium leading-8 m-0 mt-4">
              Hi {firstName} 👋
            </Text>
            <Text className="text-gray-600 font-medium leading-8 m-0">
              {`We're sorry to inform you that your knowledge source "${sourceName}" has been deleted. This action may have been taken due to one of the following reasons:`}
            </Text>
            <ul className="text-gray-600 font-medium leading-8 list-disc pl-8 text-left">
              <li>Violation of our content policy</li>
              <li>Request from the admin</li>
            </ul>
            <Text className="text-gray-600 font-medium leading-8 m-0 mt-4">
              If you believe this was a mistake, please contact our customer
              support team for assistance.
            </Text>
          </Section>
          <Hr className="border-gray-200 my-0" />

          <Section className="py-[22px]">
            <Row className="w-[166px] mx-auto">
              <Column>
                <Link href="">
                  <Text className="text-gray-400 text-sm text-center m-0">
                    Terms & Conditions
                  </Text>
                </Link>
              </Column>
              <Column>
                <Link href="" className="w-full">
                  <Text className="text-gray-400 text-sm text-center m-0">
                    Privacy Policy
                  </Text>
                </Link>
              </Column>
            </Row>
            <Row>
              <Text className="text-gray-400 text-sm text-center m-0 py-[30px]">
                {`Please contact us if you have any questions. (If you reply to
                  this email, we won't be able to see it.)`}
              </Text>
            </Row>
            <Row>
              <Text className="text-gray-400 text-sm text-center m-0">
                Support:{" "}
                <Link href="mailto:support@zova.chat">support@zova.chat</Link>
              </Text>
            </Row>
            <Row>
              <Text className="text-gray-400 text-sm text-center m-0">
                © 2024. Ecowear. All rights reserved.
              </Text>
            </Row>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default SourceDeletedEmail;
