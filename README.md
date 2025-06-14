# DomainGen - AI-Powered Domain Name Generator

DomainGen is an intelligent web application that helps users generate and check domain name availability based on their business or project descriptions. Using natural language processing (NLP), it suggests relevant domain names and verifies their availability in real-time.

## 🌟 Features

- **AI-Powered Domain Generation**: Uses NLP to extract keywords and generate relevant domain name combinations
- **Real-time Availability Check**: Integrates with GoDaddy API to check domain availability instantly
- **User Authentication**: Secure login and registration system
- **Domain Management**: Save and manage your favorite domain suggestions
- **Responsive Design**: Modern and user-friendly interface

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: EJS (Embedded JavaScript templating)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **APIs**: GoDaddy Domain Availability API
- **NLP**: Compromise.js for natural language processing
- **Security**: bcrypt for password hashing
- **Additional**: Axios for HTTP requests, Cookie Parser for session management

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- GoDaddy API credentials

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/domain-generator.git
cd domain-generator
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory and add the following:
```env
JWT_KEY=your_jwt_secret_key
GODADDY_API_KEY=your_godaddy_api_key
GODADDY_API_SECRET=your_godaddy_api_secret
```

4. Update the MongoDB connection string in `config/development.json` with your MongoDB Atlas credentials

5. Start the server
```bash
npm start
```

The application will be available at `http://localhost:3000`

## 💻 Usage

1. Register a new account or login to your existing account
2. Enter your business or project description
3. The system will generate relevant domain name suggestions
4. Check domain availability in real-time
5. Save your favorite domain names for future reference

## 🔒 Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Secure session management
- Protected routes using middleware
- Environment variable configuration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- GoDaddy API for domain availability checking
- Compromise.js for NLP capabilities
- MongoDB Atlas for database hosting

## 📞 Support

For support, please open an issue in the GitHub repository or contact [your-email@example.com]

## 🔄 Future Improvements

- [ ] Add more TLD options
- [ ] Implement domain price checking
- [ ] Add bulk domain availability checking
- [ ] Implement domain name suggestions based on industry
- [ ] Add domain name history tracking
- [ ] Implement domain name analytics

---

⭐ Star this repository if you find it helpful! 