import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import pool from "../config/db.js"; // Change this line
import { createUser, getUserByEmail } from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

//endpoint for sign up
export const signup = async (req, res) => {
  try {
    const { username, email, password, phone_number, name } = req.body;

    if (!username || !email || !password || !phone_number || !name) {
      return res.status(400).json({
        success: false,
        error: "Please fill all the fields",
      });
    }

    // Check existing email
    getUserByEmail(email, async (err, existingUser) => {
      if (err) {
        console.error("Database error:", err); // Untuk debugging
        return res.status(500).json({
          success: false,
          error: "Database error",
        });
      }

      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: "Email already registered",
        });
      }

      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const id = uuidv4();

        const userData = {
          id,
          username,
          email,
          password: hashedPassword,
          phone_number,
          name,
        };

        createUser(userData, (err, result) => {
          if (err) {
            console.error("Create user error:", err); // Untuk debugging
            return res.status(500).json({
              success: false,
              error: "Error saving user",
            });
          }

          const token = jwt.sign({ id, username }, JWT_SECRET, {
            expiresIn: "1h",
          });

          res.status(201).json({
            success: true,
            message: "Registration successful! Welcome to our platform.",
            user: { id, username, name, email },
            token,
          });
        });
      } catch (error) {
        console.error("Registration error:", error); // Untuk debugging
        res.status(500).json({
          success: false,
          error: "Error processing registration",
        });
      }
    });
  } catch (error) {
    console.error("Unexpected error:", error); // Untuk debugging
    res.status(500).json({
      success: false,
      error: "An unexpected error occurred",
    });
  }
};

// endpoint for login
export const login = (req, res) => {
  const { username, password } = req.body;

  if (!username?.trim() || !password?.trim()) {
    return res.status(400).json({
      success: false,
      error: "Please fill all the fields",
    });
  }

  const query = "SELECT * FROM user WHERE username = ?";
  pool.query(query, [username.trim()], async (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        success: false,
        error: "Database error",
      });
    }

    if (!results || results.length === 0) {
      return res.status(401).json({
        success: false,
        error: "Invalid username or password",
      });
    }

    const user = results[0];

    try {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: "Invalid username or password",
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
        },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
        },
        token,
      });
    } catch (error) {
      console.error("Authentication error:", error);
      res.status(500).json({
        success: false,
        error: "Authentication error",
      });
    }
  });
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const query = `
      SELECT id, username, email, phone_number, name 
      FROM user 
      WHERE id = ?
    `;
    pool.query(query, [userId], (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: "Failed to fetch profile",
        });
      }
      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }
      res.json({
        success: true,
        user: results[0],
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error fetching profile",
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone_number } = req.body;

    const query = `
      UPDATE user 
      SET name = ?, phone_number = ? 
      WHERE id = ?
    `;
    pool.query(query, [name, phone_number, userId], (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: "Failed to update profile",
        });
      }
      res.json({
        success: true,
        message: "Profile updated successfully",
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error updating profile",
    });
  }
};
