**BeyondChats Intercom Admin Panel Replica**

A React-based replica of the Intercom admin panel, built to mimic its functionality and polished UI. This project includes a chat interface, AI copilot for suggestions, and a knowledge base for article previews, styled to match the professional look of the original Intercom demo.

__Features__
**Chat Interface**: Send, receive, and delete messages with support for self and bot (Fin) messages.
**AI Copilot**: Provides suggestions and allows users to ask questions, enhancing the chat experience.
**Knowledge Base**: Displays articles with a preview modal for detailed views.
**Responsive Design**: Optimized for both desktop and mobile devices.
**Polished UI**: Updated background colors for improved visual hierarchy and efficiency
**Text Selection**: Select text in messages to trigger actions like "Ask Fin" (for non-self messages).

__Tech Stack__
**Frontend**: React.js
**Styling**: CSS (with styles.css for global styles)
**Build Tool**: Webpack (via create-react-app)
**Deployment**: Vercel
**Version Control**: Git/GitHub

**Project Setup**
Follow these steps to set up and run the project locally.
Prerequisites

**Node.js**: Version 14.x or higher
**npm**: Version 6.x or higher
**Git**: For cloning the repository

**Installation**
Clone the Repository:
git clone <repository-url>
cd client


**Install Dependencies**:
npm install


*Note*: If you encounter a marked module error, ensure it's either installed (npm install marked) if Markdown rendering is needed, or remove any unused imports of marked in the codebase (e.g., in src/components/ChatBody.js).


**Run the Development Server**:
npm start

The app will be available at http://localhost:3000.


Project Structure

intercom-replica/
├── client/                   # React frontend
│   ├── public/
│   │   ├── index.html       # Default HTML file for React
│   │   └── favicon.ico      # Optional: Favicon for the app
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.js   # Sidebar component (inbox, saved replies)
│   │   │   ├── Chat.js      # Chat window component (messages, input)
│   │   │   ├── ChatFooter.js # Chat footer component (input, rephrase menu) <--- Add here
│   │   │   ├── ChatHeader.js # Chat header component (assumed based on usage)
│   │   │   ├── ChatBody.js   # Chat body component (assumed based on usage)
│   │   │   └── AICopilot.js # AI Copilot component (suggestions, rephrasing)
│   │   ├── App.js           # Main app component
│   │   ├── index.js         # Entry point for React
│   │   └── styles.css       # Plain CSS for styling
│   ├── package.json         # Frontend dependencies and scripts
│   └── .env                 # Environment variables for the frontend (e.g., API URL)
├── server/                   # Express backend
│   ├── data/
│   │   └── messages.json    # Static data for messages (if SQLite not used)
│   ├── routes/
│   │   └── api.js           # API routes for messages and AI Copilot
│   ├── server.js            # Main Express server file
│   ├── package.json         # Backend dependencies and scripts
│   └── .env                 # Environment variables for the backend (e.g., OpenAI API key)
└── README.md                # Project documentation


**Deployment**
The project is deployed on Vercel at:
https://beyondchatsintercom-r7foxxno5-manikirans-projects-21dcde3d.vercel.app/
Deploy to Vercel

Install Vercel CLI (if not already installed):
npm install -g vercel


*Deploy*:
cd client
vercel deploy --prod


Verify Deployment:Visit the URL provided by Vercel 
(https://beyondchatsintercom-r7foxxno5-manikirans-projects-21dcde3d.vercel.app/)