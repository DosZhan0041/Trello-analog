import { useNavigate } from 'react-router-dom';
import './Header.css';
import { IoLogoBuffer } from "react-icons/io";
import { BoardsContext } from '../../context/BoardsProvider';
import { useContext } from 'react';
import { MdOutlineLightMode } from "react-icons/md";
import { CiDark } from "react-icons/ci";

const Header = () =>{

    let currentUser = JSON.parse(localStorage.getItem('user'))
    const navigate = useNavigate()
    const { theme, toggleTheme } = useContext(BoardsContext);

    let logOut=()=>{
        localStorage.removeItem("user")
        navigate("/login")
    }

    return(
        <header>
            <div className='header-left' onClick={()=>navigate('/')}>
                <h1>Trello</h1>
                <IoLogoBuffer />
            </div>
            <div className='header-right'>
                <button onClick={toggleTheme} className="theme-toggle">
                    {theme === "light" ? <CiDark /> : <MdOutlineLightMode />}
                </button>
                {
                    currentUser!=null ? (<p onClick={logOut}>Log Out</p>) : (<p onClick={()=>{navigate("/login")}}>Sign In</p>)
                } 
            </div>
        </header>
    )
}
export default Header;