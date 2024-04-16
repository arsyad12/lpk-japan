import axios from 'axios';
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export const SettingUserData = async () => {
  for (let attempt = 1; attempt <= 1; attempt++) {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('Access token not found.');
        return null;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await axios.get(
        'http://103.127.133.56/api/setting',
        config,
      );
      // console.log(response);
      // setProfileData(response.data);
      return response.data;
    } catch (error) {
      if (error.response.status === 429) {
        // Implement exponential backoff
        const delayTime = Math.pow(2, attempt) * 1000;
        await delay(delayTime);
      } else {
        console.error('Error fetching user profile:', error);
      }
    }
  }
};

export default SettingUserData;
