const dotenv = require('dotenv');
import express, { Request, Response } from 'express';
const mongoose = require('mongoose');
import JobListingModel, { JobListing } from "./models/job.model";
import CompanyModel, { Company } from "./models/company.model";
import UserModel, { User } from './models/user.model';
import { hashPassword, isValidEmail } from './authentication';
import jwt from 'jsonwebtoken';
import { GenerateThreadProps, generateTwitterThread } from './services/blogToTwitterThread';

const envFile = process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev';
dotenv.config({ path: envFile });

const { env } = process;
const port = env.PORT;
const app = express();
const router = express.Router();

const mongoURI = `mongodb+srv://${env.MONGO_USER}:${env.MONGO_PW}@${env.MONGO_CLUSTER}.vc6ol8u.mongodb.net/?retryWrites=true&w=majority`;

mongoose
    .connect(mongoURI, {
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Connected successfully!');
        
    })
    .catch((err: string) => {
        console.log('Failed to connect:', err);
    });

mongoose.connection.on('connected', () => {
    console.log('MongoDB connection established');
});

mongoose.connection.on('error', (err: string) => {
    console.log('MongoDB connection error', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB connection disconnected');
});

app.use('/api', router);
app.use(express.json());

app.get('/health', async (req, res) => {
    res.status(200).json({
        message: 'Up and running!',
        version: 1
    });
});

app.post('/generateThread', async (req: Request, res: Response) => {
    const { url, tweetCount, tone }: GenerateThreadProps = req.body; 
    const thread = await generateTwitterThread(url, tweetCount, tone);
    if (thread.error) {
        res.status(thread.code ?? 400).json(thread);
        return;
    }
    res.status(200).json(thread);
});

app.post('/user/new', async (req: Request, res: Response) => {
    const {
        firstName,
        lastName,
        authType,
        email,
        password
    }: User = req.body;

    if (!isValidEmail(email)) {
        res.status(500).json({
            message: "Not a valid email"
        });
    }

    const existingUser = await mongoose.findOne({email});
    if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
    }

    try {
        let hashedPassword = '';
        if (authType === "local") {
            if (!password) throw "Local users must have a password";
            hashedPassword = await hashPassword(password);
        }

        const newUser: User = new UserModel({
            firstName,
            lastName,
            email,
            authType,
            password: hashedPassword,
        });
        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, env.JWT_SK ?? '');

        res.status(201).json({ token, user: { id: newUser._id, email: newUser.email } });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create user",
            error
        });
    }
});

app.post('/company/new', async (req: Request, res: Response) => {
    const { 
        name,
        description,
        location
    }: Company = req.body;
    try {
        const newCompany: Company = new CompanyModel({
            name,
            description,
            location
        });
        const savedCompany = await newCompany.save();
        res.status(201).json(savedCompany);
    } catch (error) {
        res.status(500).json({
            message: "Failed to create new company",
            error
        });
    }
});

app.post('/listing/new', async (req: Request, res: Response) => {
    const { title, 
            company, 
            location,
            status,
            description
        }: Omit<JobListing, 'posted'> = req.body;
    try {
        const newListing: JobListing = new JobListingModel({
            title,
            company,
            location,
            description,
            status,
            posted: new Date()
        });
        const savedListing = await newListing.save();
        res.status(201).json(savedListing);
    } catch (error) {
        res.status(500).json({ 
            message: 'Failed to create listing',
            error
        });
    }
});

app.listen(port, () => {
    console.log("Listening on port", port);
});
