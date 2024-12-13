
import React from 'react'
import CandidateMiniTab from './MiniTabs/Candidate'
import SkillsTabComponent from './MiniTabs/Skills'
import OverallImpressions from './MiniTabs/OverallImpressions'
import Header from '../Navbar/Header/Header'

const Preview = () => {
  return (
    <div>
        <Header/>
        <div className='p-8 border border-gray-500 rounded-md m-8'>
        <CandidateMiniTab/>
        <SkillsTabComponent/>
        <OverallImpressions/>
        </div>
    </div>
  )
}

export default Preview