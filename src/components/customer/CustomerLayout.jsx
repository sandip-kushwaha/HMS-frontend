import CustomerNavbar from './CustomerNavbar'
import { Outlet } from 'react-router-dom'
import CustomerFooter from './CustomerFooter'

const CustomerLayout = () => {
  return (
    <div className="h-screen overflow-hidden bg-gray-50 text-white">
         <div className="h-screen flex flex-col">
            <CustomerNavbar/>
             <main className="flex-1 overflow-y-auto">
                <div className="p-6 min-h-full">
                    <Outlet/>
                </div>  
              <CustomerFooter/>
            </main>

        </div>
    </div>
  )
}

export default CustomerLayout