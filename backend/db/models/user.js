const mongoose = require('mongoose');

// Define the User schema
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

const User = mongoose.model('User', UserSchema);

User.createNew = async (username, email, password) => {
    try {
      // Create a new user instance
      const newUser = new User({
        username,
        email,
        password
      });
  
      // Save the user to the database
      await newUser.save();
      console.log("User created successfully:", newUser);
    } catch (error) {
      console.error("Error creating user:", error);
    }
}

module.exports = User;
