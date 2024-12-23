# E-Learning Platform

### Introduction

This repository contains the source code for an WEB-LEARNING server side code. This platform allows administrators to create and manage courses, while users can enroll in and watch these courses.

### Features

#### Admin Panel:
1. Create and manage courses
2. Upload course content (videos, documents, etc.)
3. Set course enrollment deadlines and pricing
#### User Dashboard:
1. View enrolled courses
2. Watch course videos and download course materials
3. Interact with other learners through forums and comments
#### Technology Stack
1. Node.js
2. Express.js
3. MongoDB
4. cloudinary
5. Nodemailer
6. stripe
7. etc much more pakeages

### Clone the repository:
```bash
git clone [https://github.com/your-username/e-learning-platform.git](https://github.com/your-username/e-learning-platform.git)
```
### Install dependencies:
```bash
cd web-learning-server
npm install
```
### Set up Env
```bash
PORT=8000
CORS_ORIGIN=...
DB_URI=...
CLOUD_NAME =... 
CLOUD_API_KEY =.... 
CLOUD_SECRET = ....
REDIS_URL = ....
ACTIVATION_SECRET = ....
ACCESS_TOKEN = ....
ACCESS_TOKEN_EXPIRE = ....
REFRESH_TOKEN = ....
REFRESH_TOKEN_EXPIRE = ....
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 465
SMTP_SERVICE = gmail
SMTP_MAIL = ....
SMTP_PASSWORD = ....
STRIPE_SECRET_KEY = .....
STRIPE_PUBLISHABLE_KEY = .....
```
### Start the server
```bash
npm run dev
http://localhost:8000
```

### How to Use

#### Admin:
Login to the admin panel using your credentials.
Create a new course by providing the course name, description, and other relevant details.
Upload course content such as videos and documents.
Set the course enrollment deadline and pricing (if applicable).
#### User:
Create an account or log in to an existing account.
Browse available courses and enroll in the desired courses.
Access course content, including videos and documents.
Participate in discussions and forums.

### Contributing

#### We welcome contributions to this project. Please follow these guidelines:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.   
5. Push your changes to your forked repository.
6. Create a pull request to the main repository.

### Additional Notes
Security: Implement robust security measures to protect user data and prevent unauthorized access.
Scalability: Consider using a cloud platform to scale the application as needed.
User Experience: Design a user-friendly interface and provide clear instructions.

### Contact
For any questions or issues, please contact us at [Linkedin](https://www.linkedin.com/in/kunal003/).
