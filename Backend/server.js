require("dotenv").config();

const app = require('./src/app');
const connectDB = require('./src/config/database');

const { resume, selfDescription, jobDescription } =
    require('./src/services/temp');

const { generateInterviewReport } =
    require('./src/services/ai.service');

async function startServer() {
    try {
        // Connect to MongoDB first
        await connectDB();

        console.log('Connected to database');

        // Start Express server
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });

        // Generate AI interview report
        try {
            await generateInterviewReport(
                resume,
                selfDescription,
                jobDescription
            );
        } catch (error) {
            console.log('AI Report Error:', error.message);
        }

    } catch (error) {
        console.log('MongoDB connection failed:', error.message);
        process.exit(1);
    }
}

startServer();