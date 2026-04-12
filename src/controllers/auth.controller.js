const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    if (!email.includes("@")) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    try {
        // 🔐 Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log("Hashed password:", hashedPassword);

        // ✅ Don't send hash to client
        res.status(201).json({
            message: "User registered successfully"
        });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { registerUser };