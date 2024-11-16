

import React from 'react'
import './HeaderIcons.css'

import { HomeIcon,questionIcon,notificationIcon,profileIcon } from '../../IconsData'


const HeaderIcons = () => {
  return (
    <div className='header-icons--container'>
        {HomeIcon}
        {questionIcon}
        {notificationIcon}
        {profileIcon}
    </div>
  )
}

export default HeaderIcons