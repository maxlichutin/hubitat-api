import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });


// JWT
function generateAccessToken(origin) {
    return jwt.sign(
      { origin: origin, iat: Math.floor(Date.now() / 1000) - 30 },
      process.env.JWT_SECRET
    );
  }
  function verifyAccessToken(token) {
    try {
      let decoded = jwt.verify(token, process.env.JWT_SECRET);
      let dateNow = Math.floor(Date.now() / 1000);
      let age = dateNow - decoded.iat;
  
    //   console.log("Token age (seconds):", age);
    //   console.log("Token origin:", decoded.origin);
  
      if (decoded && age < 86400 * 365) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }


export { generateAccessToken as generateAccessToken };
export { verifyAccessToken as verifyAccessToken };

