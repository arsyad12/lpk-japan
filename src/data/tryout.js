import axios from 'axios';

export const Tryout = async () => {
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

        const response = await axios.get('http://103.127.133.56/api/tryout', config);
        // console.log(response);
        // setProfileData(response.data);
        return response.data; 
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };


export default Tryout;
