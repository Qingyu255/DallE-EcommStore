import { Fragment, useContext } from 'react'
import { ProductsContext } from '../productCard/ProductsContext'

export default function Card ({ _id, name, prompt, photo, shirtColour}) {
  // This Card is for the AI products overview/showcase
  const shirtRoute = "/products/blankShirts/" + shirtColour
  const { customProducts, setCustomProducts } = useContext(ProductsContext)

  function handleAddToCart() {
    setCustomProducts(prev => [...prev, _id])
  }

  return (
    <Fragment>
      <div className='flex flex-col'>
        <div className="w-72 sm:w-96">
          <div className="flex items-center justify-center group relative">
            <img src={shirtRoute} className="border-2 border-slate-600 rounded-xl "></img>  
            <div className="w-32 h-48 sm:w-40 sm:h-60 absolute flex justify-center">
              <img className="rounded-md absolute h-40 sm:h-52" src={photo}></img> 
            </div>
            
            <div className="group-hover:flex flex-col max-h-[94.5%] hidden absolute bottom-0 left-0 right-0 bg-[#10131f] m-2 p-3 rounded-md">
              <p className="text-white text-sm overflow-y-auto prompt">{prompt}</p>
              <div className="mt-3 flex justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full object-cover bg-green-700 flex justify-center items-center text-white text-xs font-bold">{name[0]}</div>
                  <p className="text-white text-sm">{name}</p>
                </div>
                <button type="button" onClick={handleAddToCart} className="outline-none bg-transparent border-none">
                  <img src="/addToCart.png" alt="download" className="w-8 h-8 object-contain invert" />
                </button>
              </div>
            </div>
          </div>
          
        </div>
        
      </div>
      
    </Fragment>
  )
}

