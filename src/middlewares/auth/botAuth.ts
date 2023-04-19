import axios from "axios";

// route middleware to get a token
export const getAuthToken = async () => {
  try {
    let bodyData = {
      username: process.env.BOT_USERNAME,
      password: process.env.BOT_PASSWORD,
    };
    
    const authResponse = await axios({
      method: "post",
      url: `${process.env.CORE_BASE_URL}/auth/login`,
      data: bodyData,
      headers: { "Content-Type": "application/json" },
    });
    
    return await authResponse.data.data;
  } catch (error) {
    console.error(error);
  }
};
