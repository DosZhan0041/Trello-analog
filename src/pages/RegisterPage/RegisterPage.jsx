import './Register.css'
import { FaRegAddressCard } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { TbLockAccess } from "react-icons/tb";
import { useState } from 'react';
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

function Register() {
    const [data, setData] = useState({
        email: null,
        password: null
    })
    
    const [eye, setEye] = useState(true)

    const navigate = useNavigate()

    const eyeChange = () => {
        eye === true ? setEye(false)  : setEye(true)
    }


    let handleCreateUser = () => {
        fetch('http://localhost:8080/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Ошибка HTTP, статус " + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log(data); 
            localStorage.setItem('user', JSON.stringify({...data.user, accessToken: data.accessToken}))
            navigate("/");
        })
        .catch(error => {
            console.error("Произошла ошибка:", error);
        });
    }   

    return (
        <div className='reg-cont'>
            <div className='register'>
                <div className="register-icon">
                    <FaRegAddressCard />
                </div>
                <div className='register-form'>
                    <div className='reg-form-div'>
                        <FiUser />
                        <input type="text" placeholder='email...' onChange={(e)=>setData({...data, email: e.target.value})}/>
                    </div>
                    <div className='reg-form-div'>
                        <TbLockAccess />
                        <input type={eye === true ? "password" : "text" }  placeholder='password...' onChange={(e)=>setData({...data, password: e.target.value})} />
                        <button onClick={eyeChange}>{eye === true ? <FaRegEye /> : <FaRegEyeSlash /> }</button>
                    </div>
                </div>
                <div className="reg-button">
                    <button onClick={handleCreateUser}>Register</button>
                    <button onClick={()=>navigate('/login')}>I have Account!</button>
                </div>
            </div>
        </div>
    );
}

export default Register;