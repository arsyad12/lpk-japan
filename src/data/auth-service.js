// authService.js

import axios from 'axios';

const API_URL = "http://103.127.133.56/api";

export const authService = {
  login: async (email, password) => {
    try {
    //   const response = await fetch(`${API_URL}/login`, {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
    //   console.log(response);
      if (response.status === 200) {
        localStorage.setItem('accessToken', response.data.authorization.token);
        return true;
      } else {
        return false;
      }
    } catch (error) {
    //   console.error('Error during login:', error);
      return false;
    }
  },

  register: async (name, email, password) => {
    try {
    //   const response = await fetch(`${API_URL}/login`, {
      const response = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      console.log(response);
      if (response.status === 200) {
        // localStorage.setItem('accessToken', response.data.authorization.token);
        return true;
      } else {
        return false;
      }
    } catch (error) {
    //   console.error('Error during login:', error);
      return false;
    }
  },

  resetPass: async (email) => {
    try {
    //   const response = await fetch(`${API_URL}/login`, {
      const response = await axios.post(`${API_URL}/password/email`, {
        email 
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      // console.log(response);
      if (response.status === 200) {
        // localStorage.setItem('accessToken', response.data.authorization.token);
        return response;
      } else {
        return false;
      }
    } catch (error) {
    //   console.error('Error during login:', error);
      return false;
    }
  },

  loginGoogle: async () => {
    try {
      const response = await axios.get(`https://rsp-onlineclass.com/api/auth/google/callback`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      // console.log(response);
      // setProfileData(response.data);
      return response.data; 
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
    // fetch(`${API_URL}/login/google`, {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Accept': 'application/json'
    //     }
    //   })
    //     .then((response) => {
    //       if (response.ok) {
    //         return response.json();
    //       }
    //       throw new Error('Something went wrong!');
    //     })
    //     .then((data) => setLoginUrl(data.url))
    //     .catch((error) => console.error(error));
  },
  
  logout: () => {
    // Hapus token dari localStorage atau state manajemen
    localStorage.removeItem('accessToken');
  },

  isAuthenticated: () => {
    // Periksa apakah token ada di localStorage atau state manajemen
    const auth = localStorage.getItem('accessToken');
    return auth;
  }
};

export default authService;
