# Hive Beneficiary Rewards

A simple dashboard to track and analyze beneficiary rewards for any Hive blockchain account.

## What are Beneficiary Rewards?

When content creators on Hive set beneficiaries on their posts, a percentage of their post rewards goes to those beneficiary accounts. This tool helps beneficiary accounts track how much they've earned over time.

## Features

- Track beneficiary rewards for any Hive account
- View rewards in HBD, Hive Power (HP), and combined USD value
- Filter by time range: Today, 7 Days, or 30 Days
- Daily breakdown of all payouts
- Real-time HIVE/HBD conversion using Hive internal market prices

## Tech Stack

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **API**: Hive Condenser API (api.hive.blog)

## API Endpoints Used

- `condenser_api.get_account_history` - Fetch account operations
- `condenser_api.get_dynamic_global_properties` - Get VESTS to HP conversion rate
- `condenser_api.get_ticker` - Get HIVE/HBD market price

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000)

## Deployment

This project is deployed on Vercel. You can deploy your own instance by clicking the button below:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Mantequilla-Soft/hive-beneficiary-rewards)

## Support the Hive Blockchain

Consider voting for these witnesses to help secure the Hive network:

- [@aliento](https://witness.aliento.blog/witness/aliento)
- [@snapie](https://witness.aliento.blog/witness/snapie)
- [@threespeak](https://witness.aliento.blog/witness/threespeak)

## Links

- [Hive.io](https://hive.io/eco)
- [Mantequilla Soft](https://mantequilla-soft.com)
- [Proyecto Aliento](https://proyectoaliento.com)
- [HolaHive](https://holahive.com)

## License

MIT
