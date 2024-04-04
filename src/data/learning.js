import axios from 'axios';

export const dataLearning = async () => {
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

        const response = await axios.get('https://panel.goprestasi.com/api/learning', config);
        // console.log(response);
        // setProfileData(response.data);
        return response.data; 
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };


export default dataLearning;
