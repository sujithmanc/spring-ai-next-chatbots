import Timer from './components/Timer'

export default function ProductLayout({ children }) {
  return (
    <>
      <Timer />
      {children}
    </>
  )
}
