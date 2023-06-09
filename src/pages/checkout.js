import { useContext, useEffect, useState } from "react"
import Layout from "../../components/layout/Layout"
import CheckoutProductCard from "../../components/productCard/CheckoutProductCard"
import CheckoutCustomProductCard from "../../components/productCard/CheckoutCustomProductCard"
import { ProductsContext } from "../../components/productCard/ProductsContext"
import useLocalStorageState from "use-local-storage-state"

export default function CheckoutPage() {
    const { selectedProducts, selectedCustomProducts, nonCustomProductsNew } = useContext(ProductsContext)
    const [nonCustomProductsData, setNonCustomProductsData] = useLocalStorageState("nonCustomProductsBagData", {defaultValue: []})
    const [customProductsData, setCustomProductsData] = useLocalStorageState("customProductsBagData", {defaultValue: []})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const uniqueIds = [...new Set(selectedProducts)]
        const uniqueCustomIds = [...new Set(selectedCustomProducts)]
        async function fetchProducts() {
            if (uniqueIds.length > 0) {
                await fetch("/api/products?ids="+uniqueIds.join(","))
                    .then(response => response.json())
                    .then(json => setNonCustomProductsData(json))
            }
            if (uniqueCustomIds.length > 0) {
                try {
                    const response = await fetch("/api/post?ids="+uniqueCustomIds.join(","), {
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    if (response.ok) {
                        const fetchedData = await response.json()
                        setCustomProductsData(fetchedData.data) 
                    }
                } catch(error) {
                    alert(error)
                } finally {
                    setLoading(false)
                }
            } else {
            setLoading(false)
            }
        }
        fetchProducts()
    }, [selectedProducts, selectedCustomProducts])

    // Calculate total price to be paid
    var totalSum = 0
    selectedProducts.map(productId => totalSum+=nonCustomProductsNew.find(productData => productData._id === productId).price)
    selectedCustomProducts.map(() => totalSum+=20)

    return (
        <Layout>
            {!loading?
                <div className="flex flex-wrap justify-center py-10 sm:flex-row">
                
                    <div className="flex flex-col pb-5">
                        
                        {(!selectedProducts.length && !selectedCustomProducts.length) && (
                            <div>
                                <h1>There are no products in your shopping cart.</h1>
                            </div>
                        )}
                        {(selectedProducts.length > 0 || selectedCustomProducts.length > 0) && <h1 className="mx-5 sm:mx-10 font-bold text-3xl">Your Bag</h1>}
                        {selectedProducts.length > 0 && (
                            nonCustomProductsData.map(productInfo => <CheckoutProductCard key={productInfo._id} id={productInfo._id} name={productInfo.name} description={productInfo.description} image={productInfo.picture} price={productInfo.price} quantity={selectedProducts.filter(id => id === productInfo._id).length}/>

                        ))}
                        {selectedCustomProducts.length > 0 && (
                            customProductsData.map(productInfo => <CheckoutCustomProductCard key={productInfo._id} {...productInfo}/>  
                        ))}
                    </div>

                    {(selectedProducts.length > 0 || selectedCustomProducts.length > 0) && (
                        <div className="grow max-w-xs mr-5">
                            <h1 className="font-bold text-3xl">Summary</h1>
                            <div className="py-5">
                                <div className="flex flex-row items-center text-xl">
                                    <h1 className="grow">Subtotal</h1>
                                    <div>${totalSum}</div>
                                </div>
                                <div className="flex flex-row items-center text-xl mt-1">
                                    <h1 className="grow">Estimated Delivery Fees</h1>
                                    <div>Free</div>
                                </div>
                                <div className="flex flex-row items-center border-y-2 py-3 my-5 text-xl">
                                    <h1 className="grow">Total</h1>
                                    <div>${totalSum}</div>
                                </div>
                                <div className="flex flex-col justify-center py-5">
                                    <button className="bg-black rounded-3xl text-white hover:bg-gray-500 grow py-3 my-2">Checkout with Card (Stripe)</button>
                                    <button className="bg-black rounded-3xl text-white hover:bg-gray-500 grow py-3 my-1">Checkout with Paynow</button>
                                </div>
                            </div>
                        </div>
                    )}    
                </div>
            : <div className="h-screen"></div>}
        </Layout>
    )
}
