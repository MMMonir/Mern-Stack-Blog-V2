import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Cats from '../cats/Cats';

const SideBar = () => {
    const [ cats, setCats ] = useState([]);

    useEffect(() => {
        const getCats = async() =>{
            const res = await axios.get("/categories");
            setCats(res.data);
        }
        getCats();
    },[])

    return (
<div className='rounded bg-light py-3 px-2'>
<div className='p-2 text-center'>
    <p className='border-top border-bottom pb-1 mx-2 fs-5 mb-3'>ABOUT ME</p>
    <img 
      src="https://z-p3-scontent.fdac12-1.fna.fbcdn.net/v/t39.30808-6/285720020_3194677014081034_8148393953883939316_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeEu_r31fjIFLwy_Dil8G8HvAarvKUomLkwBqu8pSiYuTGWralpx1UnWUlkZEuAyecBVpMU1EqUq9IFePU4tM0mg&_nc_ohc=4VM0JrhstxUAX-2vrUq&_nc_ht=z-p3-scontent.fdac12-1.fna&oh=00_AT9S74YeUl1p0R_FNoDh-oUgDa6cH6OyKEy-kUTmEUJqaw&oe=62F223CD" alt=""
      style={{"width": "120px", "borderRadius":"50%"}}
      className="me-2 my-1" 
      />
      <p>Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content.</p>
      <p className='border-top border-bottom pb-1 mx-2 fs-5 mt-4'>CATEGORY</p>
      <div className='text-start'>

    {
        cats.map((cat)=>(
            <Cats cat={cat} key={cat._id}/>
        ))
        
    }

      </div>
</div>
</div>
    );
};

export default SideBar;