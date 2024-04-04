import React, {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export function Google() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const dynamicCode = urlParams.get('code');
        // console.log(dynamicCode+'&scope=email+profile+openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&authuser=0&prompt=consent');

        const response = await axios.get('https://panel.goprestasi.com/api/auth/google/callback?code='+dynamicCode+'&scope=email+profile+openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&authuser=0&prompt=consent');
        // console.log(response.data.authorization.token);
        localStorage.setItem('accessToken', response.data.authorization.token);
        setData(response.data);
        setLoading(false);
        // Redirect ke rute home
        navigate('/dashboard/mytryout');
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, [navigate]); // Empty dependency array means this effect runs once when the component mounts

  return (
    <div>
      {/* Render your data here */}
    </div>
  );


}


export default Google;