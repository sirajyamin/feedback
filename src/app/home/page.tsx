import Link from 'next/link'
import React from 'react'

function page() {
  return (
    <div>
      <Link href='/signin'>SignIn</Link>
      <Link href='/signup'>SignUp</Link>
    </div>
  )
}

export default page
