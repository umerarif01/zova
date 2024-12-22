# Zova

Zova is SaaS platform that leverages the Retrieval-Augmented Generation (RAG) framework, allowing users to create multi-source chatbots. These chatbots are capable of retrieving facts from diverse sources, including PDFs, Word documents, and websites, enhancing LLM performance and reliability.

## Features

- **Next.js Framework**: Fast and modern React-based framework for building server-side rendering and static web applications.
- **Database Management**: Integrated with Drizzle ORM for seamless database operations.
- **Authentication**: Utilizes NextAuth.js for secure and flexible authentication solutions.
- **Payment Integration**: Integrated with Stripe for handling payments and webhooks.
- **Drag-and-Drop**: Enhanced user experience with drag-and-drop functionality using DnD Kit.
- **AWS S3**: Utilizes AWS SDK for S3 storage solutions.
- **PDF Viewing and Parsing**: Supports PDF viewing and parsing with React PDF Viewer and PDF.js.
- **Email Handling**: Built-in email components using React Email.

## Installation

### Prerequisites

- Node.js (latest version recommended)
- npm or yarn package manager

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/umerarif01/zova.git
   cd zova
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory. Copy the `.env.example` file and fill in the variables.

4. Set up the database:
   Run Drizzle ORM migrations:

   ```
   npm run db:push
   ```

5. Run the development server:

   ```
   npm run dev
   ```

6. Run the ingest backend:

   clone the ingest backend from [here](https://github.com/umerarif01/zova-backend) and run it.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any bugs or feature requests.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries or support, please open an issue in the repository.
