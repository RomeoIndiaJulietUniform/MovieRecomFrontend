import { useState, useEffect } from 'react';
import React from 'react'
import "../CompStyle/newscrawl.css"


const NewsCrawl = () => {
  return (
    <div className='newsCrawl'>
      <marquee behavior='scroll' direction='left'>
        {["Sorry for the latency issue for the inactivity delay, API fetching will be delayed by few seconds, Pls retype again"].map((article, index) => (
          <span key={index}>
            {article}
          </span>
        ))}
      </marquee>
    </div>
  )
}

export default NewsCrawl


