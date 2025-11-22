import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - Allow CORS from all origins
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Forward webhook to n8n Cloud
app.post('/call-n8n', async (req, res) => {
    try {
        console.log('📤 Received request from frontend:', JSON.stringify(req.body, null, 2));

        const n8nWebhookUrl = 'https://carreer-path.app.n8n.cloud/webhook-test/send';

        // Forward request to n8n Cloud
        const response = await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        console.log('✅ N8N Response received:', JSON.stringify(data, null, 2));

        // Return response to frontend
        res.json({
            success: true,
            statusCode: response.status,
            data: data
        });

    } catch (error) {
        console.error('❌ Error calling N8N webhook:', error.message);
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Mock webhook endpoint for testing (bypass n8n)
app.post('/call-n8n-mock', async (req, res) => {
    try {
        console.log('🧪 Mock webhook called:', JSON.stringify(req.body, null, 2));

        const { userMessage, candidateName } = req.body;

        // Generate mock AI response based on user message
        const mockResponses = {
            'cố lên bạn ơi': 'Cảm ơn bạn! Bạn có thể kể rõ hơn về tên của mình không?',
            'default': 'Cảm ơn bạn đã chia sẻ! Đó là thông tin rất hữu ích. Bạn có thể tiếp tục chia sẻ thêm về kinh nghiệm của mình không?'
        };

        const aiResponse = mockResponses[userMessage?.toLowerCase()] || mockResponses['default'];

        res.json({
            success: true,
            response: aiResponse,
            timestamp: new Date().toISOString(),
            candidateName: candidateName
        });

        console.log('✅ Mock response sent:', aiResponse);

    } catch (error) {
        console.error('❌ Mock webhook error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: err.message
    });
});

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║  Interview Assistant Backend Server    ║
║  Running on: http://localhost:${PORT}      ║
║  Health check: http://localhost:${PORT}/health  ║
║  N8N Proxy: http://localhost:${PORT}/call-n8n  ║
╚════════════════════════════════════════╝
    `);
});
