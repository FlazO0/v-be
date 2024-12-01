const mongoose        = require("mongoose");
const chalk           = require("chalk");

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URI}/${process.env.DB_PATH}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(chalk.bold.white("    >>>") + chalk.italic.blue(" Database connected "));
    } catch (err) {
        console.log(chalk.bold.white("    >>>") + chalk.italic.red(" Database not connected /", err.message))
        process.exit(1); // Encerra o processo em caso de falha
    }
};

module.exports = connectDB;
