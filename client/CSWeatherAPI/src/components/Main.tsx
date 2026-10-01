import type { ReactNode } from 'react'

const Main = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <main className="select-none max-w-6xl mx-auto mb-25">          
        {children}
      </main>
    </>
  )
}

export default Main