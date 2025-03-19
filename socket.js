const http = require('http');
const { Server } = require('socket.io');
const loggerUtils = require('./utils/logger.utils');
const chatSessionModel = require('./models/chatSession.model');
const { chatResponse } = require('./services/gemini.service');
const ChatContextSchemaModel = require('./models/chatbotContext.model');


let context;

function initSocketServer(app) {
    const server = http.createServer(app);

    const io = new Server(server, {
        cors: {
            origin: "*",
        }
    });

    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        // Start chat session
        socket.on('startChat', async ({ userId }) => {
            try {
                const newSession = new chatSessionModel({
                    userID: userId,
                });

                const savedSession = await newSession.save();
                socket.sessionID = savedSession._id;

                const contextData = await ChatContextSchemaModel.find({});
                context = contextData[0]?._doc;

                console.log(`Chat Session started, ID: ${savedSession._id}`);
                socket.emit('sessionStarted', savedSession);
            } catch (error) {
                console.error('Failed to save session details:', error);
                socket.emit('error', 'Could not start chat session');
            }
        });

        // Send chat message
        socket.on('user-message', async (messageData) => {
            try {
                if (!socket.sessionID) {
                    socket.emit('error', 'No active session');
                    return;
                }

                console.log('Message received:', messageData);

                const systemPrompt = `You are Monkey D. Luffy updated according to the current Manga, having a casual conversation with a friend of Tushar. 
Key personality traits to maintain:
- Cheerful, energetic, and straightforward
- Love for adventure and food (especially meat!)
- Strong sense of loyalty to friends
- Simple-minded but wise when it comes to friendship
- Use occasional "shishishi" (your signature laugh)

Base your knowledge about Tushar on this context: ${JSON.stringify(context)}

Rules:
1. Keep responses short and engaging (2-3 sentences max)
2. Use 1-2 relevant emojis naturally
3. If asked about yourself/adventures/crew, answer based on One Piece knowledge
4. If asked about Tushar, answer only based on the provided context
5. For questions you can't answer, say something like "Shishishi, I'll have to ask Tushar about that!"
6. Stay in character at all times

Current user message: ${messageData?.message?.message}`;

                const chatbotResponse = await chatResponse(systemPrompt);

                const response = {
                    timestamp: Date.now(),
                    userType: 'bot',
                    message: chatbotResponse,
                };

                socket.emit('server-message', response);
            } catch (error) {
                console.error('Failed to send message:', error);
                socket.emit('error', 'Could not send message');
            }
        });


        // Close chat session
        socket.on('closeChat', async () => {
            if (!socket.sessionID) {
                socket.emit('error', 'No active session to close');
                return;
            }

            try {
                const session = await chatSessionModel.findById(socket.sessionID);
                if (session) {
                    session.sessionEndTimestamp = new Date();
                    session.isSessionActive = false;
                    await session.save();

                    console.log(`Chat Session closed, ID: ${socket.sessionID}`);
                    socket.emit('sessionClosed', { sessionID: socket.sessionID });
                } else {
                    console.error('Session not found');
                    socket.emit('error', 'Session not found');
                }
            } catch (error) {
                console.error('Failed to close session:', error);
                socket.emit('error', 'Could not close chat session');
            }
        });

        // Disconnect event
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });

    return server;
}

module.exports = initSocketServer;