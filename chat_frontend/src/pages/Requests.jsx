import Navbar from "../components/Navbar"
import RequestsList from "../components/RequestsList"

const Requests = () => {
  return (
    <div className="lg:flex">
      <Navbar/>
      <RequestsList/>
    </div>
  )
}

export default Requests