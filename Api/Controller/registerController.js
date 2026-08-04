
const userModel = require('../Models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
  register: async function (req, res) {
     console.log("REGISTER API CALLED");
  
    try {
             const { username, email, password } = req.body;
//check all fields are provided
            if (!username || !email || !password) {
                return res.status(400).json({
                    message: "All fields are required"
                });
            }

            console.log("Username:", username);
            console.log("Email:", email);
            console.log("Password:", password);


            // check if email already exist
   const user = await userModel.findOne({ username });
     if (user) {
  return res.status(400).json({
    message: "This username is already used",
    success: false,
  });
}
    //create newu user
  const newUser = await userModel.create({
  username,
  email,
  password,
});

const token = jwt.sign(
  { id: newUser._id },
  req.app.get("secretKey"),
  { expiresIn: "1h" }
);

res.cookie("token", token, {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 60 * 60 * 1000,
});

return res.status(201).json({
  message: "Account created successfully",
  success: true,
  user: newUser,
});
     
  }
  catch (error) {

  console.error(error.stack);

  return res.status(500).json({
    message: "Oops! Something went wrong",
    error: error.message,
  });
  }
},
  
// login
 
  authenticate: async function (req, res) {
    console.log("LOGIN API CALLED");

    try {
      const { username, password } = req.body;

      // Check fields
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: "username and password are required",
        });
      }

      // Find user
      
      const user = await userModel.findOne({ username });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Generate JWT
      const token = jwt.sign(
        { id: user._id },
        req.app.get("secretKey"),
        { expiresIn: "1h" }
      );
      res.cookie("token", token, {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 60 * 60 * 1000,
});

      // Send token
      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });

        } catch (error) {
      console.error("LOGIN ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Login failed",
        error: error.message,
      });
    }
  },

   //FETCH USER 


  fetchUser: async function (req, res) {
    try {
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "No token found",
        });
      }

      const decoded = jwt.verify(token, req.app.get("secretKey"));

      const user = await userModel
        .findById(decoded.id)
        .select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // LOGOUT
logout: async function (req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
},
};