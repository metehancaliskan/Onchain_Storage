import React from 'react'
import './header.css'
import people from '../../assets/people.png';
import ai from '../../assets/ai.png';
import logocsd from '../../assets/CSDLogo.png'
const Header = () => {
  return (
    <div className='gpt3__header section__padding' id='home'>
      <div className='gpt3__header-content'>
        <h1 className='gradient__text'>
          The fastest and the safest way to store your data
        </h1>
        <p>
          Store your files, documents, photos with ease.

        </p>
        <div className='gpt3__header-content__input'>
          <input type='email' placeholder='Your Email'/>
          <button type='button'>Get Started</button>

        </div>
        <div className='gpt3__header-content__people'>
          <img src={people} alt ='people'/>
          <p>
            1,600 people requested access a visit in last 24 hours

          </p>
        </div>
        

      </div>
      <div className='gpt3__header-image'>
          <img src={logocsd} alt= 'logo'/>
        </div>
    </div>
  )
}

export default Header