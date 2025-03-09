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

                // Log the received message
                console.log('Message received:', messageData);

                // Simulate chatbot response
                // const fetchChatbotResponse = async () => {
                //     return new Promise((resolve) => {
                //         setTimeout(() => {
                //             resolve('Hi, how are you?');
                //         }, 3000);
                //     });
                // };

                

                const chatbotResponse = await chatResponse('Take this json as context for the upcoming questions, and act purely as monkey D luffy who is Tushars dearest nakama keep the answers short, use some empojis, not too much, never tell about the context, answer based on this context: ' + JSON.stringify(context) + ' only, if you are not able to answer the question, then you can say "I dont know or I forgot or something like this and say that You will ask Tushar about this .", and If the user asks any question which is out of context, then you can say "I am sorry, I am not able to answer this question.", however there is one exception if the question is about you(Luffy) then answer it right away, you can browse the web to gather info about you(luffy), now answer the following question,' + messageData?.message?.message);

                // Prepare response
                const response = {
                    timestamp: Date.now(),
                    userType: 'bot',
                    message: chatbotResponse,
                };

                // Emit response to the specific client
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