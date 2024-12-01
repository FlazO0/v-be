const session = require("express-session");
const MongoStore = require("connect-mongo");

const sessionConfig = (app) => {
    app.use(
        session({
            secret: process.env.SESSION_SECRET, // Chave secreta para as sessões
            resave: false, // Evita salvar a sessão sem modificações
            saveUninitialized: false, // Evita criar sessões vazias
            store: MongoStore.create({
                mongoUrl: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URI}/${process.env.DB_PATH}`, // Conexão com MongoDB
                collectionName: "sessions", // Nome da coleção de sessões
            }),
            cookie: {
                secure: process.env.NODE_ENV === "production", // Apenas HTTPS em produção
                httpOnly: true, // Inacessível via JavaScript do cliente
                maxAge: 1000 * 60 * 60 * 24, // 1 dia de duração
            },
        })
    );
};

module.exports = sessionConfig;
