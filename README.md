# Premium Code Snippets Platform 🚀

A Full-Stack SaaS (Software as a Service) MVP built with **Next.js**. This project demonstrates the implementation of modern web architectures including OAuth 2.0 authentication, JWT session management, payment processing with Stripe, and a Headless CMS approach using Supabase.

## 📋 Features

* **🔐 OAuth 2.0 Authentication:** Secure login using Google Accounts (via NextAuth.js).
* **🎫 JWT Sessions:** Stateless session management using JSON Web Tokens.
* **💳 Payment Gateway:** Integration with Stripe Checkout to process payments for premium content.
* **🗄️ Headless CMS / Database:** Real-time data fetching from Supabase (PostgreSQL) to manage code snippets.
* **🔒 Access Control:** Logic to differentiate between "Free" and "Premium" content based on user payment status.

## 🛠️ Tech Stack

* **Framework:** Next.js 14 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Authentication:** NextAuth.js (Google Provider)
* **Database:** Supabase (PostgreSQL)
* **Payments:** Stripe API

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1. Clone the repository

git clone [https://github.com/Sarlacc3010/Premium-Code-Snippets.git](https://github.com/Sarlacc3010/Premium-Code-Snippets.git)
cd premium-code-snippets

### 2. Install dependencies

npm install

### 3. Environment Variables
Create a .env.local file in the root directory and add the following keys:
Fragmento de código

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_string

# Stripe (from Stripe Developer Dashboard - Test Mode)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Supabase (from Supabase Project Settings)
NEXT_PUBLIC_SUPABASE_URL=[https://your-project.supabase.co](https://your-project.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

### 4. Database Setup (Supabase)
This project requires two tables in your Supabase project. Disable RLS (Row Level Security) for testing purposes.

Table 1: snippets | Column Name | Type | Description | |-------------|------|-------------| | id | int8 | Primary Key | | title | text | Title of the snippet | | code | text | The code content | | is_premium | bool | TRUE for paid content, FALSE for free |

Table 2: premium_users | Column Name | Type | Description | |-------------|------|-------------| | email | text | Primary Key (Stores email of paid users) |

### 5. Run the server

npm run dev
Open http://localhost:3000 with your browser to see the result.

🧪 How to Test
View Free Content: Open the homepage. You will see free snippets available. Premium snippets will be blurred/locked.

Login: Click "Sign in with Google" to authenticate via OAuth 2.0.

Unlock Premium: Click "Unlock for $10". You will be redirected to Stripe.

Payment (Test Mode): Use the following test card details:

Card: 4242 4242 4242 4242

Date: Any future date (e.g., 12/30)

CVC: 123

Success: Upon successful payment, you will be redirected to the success page, and your email will be added to the database. The premium content will now be visible.

📄 License
This project is for educational purposes.