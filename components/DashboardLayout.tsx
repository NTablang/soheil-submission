import React from 'react'

type Props = {
    children: React.ReactNode
}

function DashboardLayout({children}: Props) {
  return (
    <div className='px-36 pt-5 text-black font-spaceMono'>{children}</div>
  )
}

export default DashboardLayout