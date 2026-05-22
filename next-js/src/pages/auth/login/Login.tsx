"use client"
import { useState } from "react";
import scss from "./login.module.scss";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";

export default function Login() {
  const [lookPassword , setLookPassword] = useState<boolean>(false)
  return (
    <div className={scss.container}>
      <div className={scss.mainContainer}>
        <h2>Кош Келдиңиз</h2>
        <p>Аккаунтуңузга кириңиз.</p>

        <div className={scss.form}>
          <div className={scss.inputBox}>
            <h5>Email</h5>
            <div className={scss.inputWrapper}>
              <input type="text" placeholder="inzenGo@gmail.com" />
            </div>
          </div>
          <div className={scss.inputPass}>
            <h5>Паполь</h5>
            <div className={scss.inputWrapper}>
              <input type={!lookPassword ? "password" : "text"} placeholder="Password" />
            <span onClick={() => setLookPassword(!lookPassword)} className={scss.look}>{lookPassword ? <FaRegEye/> : <FaRegEyeSlash/>}</span>
            </div>
          </div>
          <button className={scss.button}>Кирүү</button>
        </div>
        <p>
          Аккаунтуңуз жокпу? <a href="./register">Катталуу</a>
        </p>
      </div>
    </div>
  );
}
