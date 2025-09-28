Made at [Sundai]([url](https://www.sundai.club/))



# Massachusetts Employment Chatbot

A conversational AI assistant designed to help Massachusetts residents navigate unemployment benefits, job search resources, and employment services. Get personalized action plans and access to state-specific resources through an intuitive chat interface.

## 🌟 Features

- **Conversational Interface**: Natural chat experience with guided questions
- **Personalized Action Plans**: Customized step-by-step guidance based on your responses
- **Massachusetts-Specific Resources**: Curated list of state unemployment resources
- **Progress Tracking**: Mark action items as completed
- **Modern Design**: Clean, accessible cream and white color palette
- **Responsive**: Works seamlessly on desktop and mobile devices
- **Print/Email Support**: Save or share your action plan

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- pnpm (recommended) or npm
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/alexper490/Massgov-Employment-Chatbot.git
   cd Massgov-Employment-Chatbot
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Set up the database**
   ```bash
   pnpm db:push
   # or
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 💬 How to Use the Chatbot

### For Users

1. **Start a Conversation**
   - Open the app in your browser
   - The assistant will greet you and ask about your employment situation

2. **Answer Questions**
   - Choose from multiple choice options or type your own response
   - The conversation adapts based on your answers
   - Be honest about your situation for the best guidance

3. **Receive Your Action Plan**
   - Get a personalized action plan with immediate, short-term, and ongoing actions
   - Each action includes time estimates and relevant resources
   - Actions are tailored to your specific employment status

4. **Track Progress**
   - Mark completed actions as done
   - Access resources and contact information
   - Print or email your action plan for reference

### Common Use Cases

- **Recently Unemployed**: Get immediate steps to file for unemployment benefits
- **Job Searching**: Receive guidance on job search strategies and resources
- **Career Change**: Explore retraining and education opportunities
- **Benefits Questions**: Understand eligibility and application processes
- **Appeal Process**: Get help with unemployment claim appeals

## 📋 What You'll Get

### Personalized Action Plan
- **Immediate Actions** (0-3 days): Urgent steps you should take right away
- **Short-term Goals** (1-2 weeks): Important tasks to complete soon
- **Ongoing Activities** (ongoing): Long-term strategies for success

### Massachusetts Resources
- Direct links to state unemployment websites
- Contact information for local career centers
- Information about training programs
- Appeals and dispute resolution resources

## 🛠️ Troubleshooting

### Common Issues

**Q: The chatbot isn't responding**
- Check your internet connection
- Refresh the page
- Try clearing your browser cache

**Q: I can't see my action plan**
- Make sure you've completed the conversation flow
- Check if you answered all required questions
- Try refreshing the page

**Q: The page looks broken**
- Ensure you're using a modern browser (Chrome, Firefox, Safari, Edge)
- Check if JavaScript is enabled
- Try disabling browser extensions temporarily

**Q: I need to start over**
- Refresh the page to restart the conversation
- Your previous responses will be cleared

### Getting Help

If you encounter technical issues:
1. Check this documentation first
2. Try refreshing the page
3. Contact support if problems persist

For unemployment benefits questions, contact:
- Massachusetts Department of Unemployment Assistance: 877-626-6800
- Online: mass.gov/unemployment

## 🔧 For Developers

### Project Structure

```
src/
├── components/           # React components
│   ├── ActionPlan/      # Action plan display components
│   ├── Chat/           # Chat interface components
│   └── UI/             # Reusable UI components
├── data/               # JSON data files
│   ├── questions.json  # Conversation flow questions
│   ├── actionPlans.json # Action plan templates
│   └── resources.json  # Massachusetts resources
├── server/             # Backend server code
│   ├── trpc/          # tRPC API routes
│   └── utils/         # Server utilities
├── stores/            # State management (Zustand)
├── types/             # TypeScript type definitions
└── utils/             # Client-side utilities
```

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm db:push` - Push database schema changes
- `pnpm db:studio` - Open Prisma Studio

### Environment Variables

Create a `.env` file with:
```
DATABASE_URL="postgresql://username:password@localhost:5432/massgov_chatbot"
```

## 📱 Mobile Usage

The chatbot is fully responsive and works great on mobile devices:
- Touch-friendly interface
- Optimized for small screens
- Easy-to-read text and buttons
- Works on iOS and Android browsers

## 🔒 Privacy & Security

- Your conversation data is not stored permanently
- No personal information is collected
- All data is processed locally in your browser
- No third-party tracking

## 📞 Support

For technical support or questions about this application, please contact the development team.

For unemployment benefits assistance, contact the Massachusetts Department of Unemployment Assistance directly.

---

**Note**: This chatbot provides general guidance and information. For official unemployment benefits decisions, always consult with the Massachusetts Department of Unemployment Assistance directly.
