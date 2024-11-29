"use client";
import React, {useState, useEffect, ChangeEvent, FormEvent } from 'react'
import axios from 'axios';

interface Product {
    product_type: string;
    price: number; 
    age: number;
    category: string; 
    name: string; 
    abv: string; 
    description: string; 
    review_point: number 
    score: number; 

};

export default function productDetail(){
    const [productType, setProductType] = useState('');
    const [priceRange, setPriceRange] = useState([0, 20000]);
    const [reviewScore, setReviewScore] = useState('');
    const [whiskyCategory, setWhiskyCategory] = useState('');
    const [whiskyAge, setWhiskyAge] = useState(0);
    const [wineCountry, setWineCountry] = useState('');
    const [keywords, setKeywords] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    const handleProductTypeChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setProductType(event.target.value);
      };
    const handleMinPriceChange = (event: { target: { value: any; }; }) => {
        setPriceRange([Number(event.target.value), priceRange[1]]);
    };
    const handleReviewScoreChange =  (event: { target: { value: any; }; }) => {
        setReviewScore(event.target.value);
    };
    const handleMaxPriceChange = (event: { target: { value: any; }; }) => {
        setPriceRange([priceRange[0], Number(event.target.value)]);
    };
    const handleWhiskyCategoryChange = (event: { target: { value: React.SetStateAction<string>; }; }) => setWhiskyCategory(event.target.value);
    const handleWhiskyAgeChange = (event: {target:{value:any;};})=>{
        const selectedAge = Number(event.target.value);
        setWhiskyAge(selectedAge);
    }
    const handleKeywordsChange = (event: { target: { value: React.SetStateAction<string>; }; }) => setKeywords(event.target.value);
    const handleWineCountryChange = (event: { target: { value: React.SetStateAction<string>; }; }) => setWineCountry(event.target.value);
    useEffect(() => {
        <div>
        {loading ? (
            <p>Loading products...</p>  //{/* Show loading state */}
        ) : results.length > 0 ? (
            <ul>
                {results.map((product, index) => (
                    <li key={index}>
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p>Price: ${product.price}</p>
                        <p>ABV: {product.abv}%</p>
                        {productType === 'whisky' && (
                            <>
                                <p>Age: {product.age} years</p>
                                <p>Category: {product.category}</p>
                            </>
                        )}
                        {productType === 'wine' && (
                            <>
                                <p>Country: {product.category}</p>
                                <p>Keywords: {keywords}</p>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        ) : (
            <p>No products found</p>
        )}
    </div>
        console.log('Fetched products:', results);
    }, [results]);
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const requestData = {
            product_type: productType,
            min_price: priceRange[0],
            max_price: priceRange[1],
            min_review: parseFloat(reviewScore) || 0,
            category: productType === 'whisky' ? whiskyCategory : wineCountry,
            min_age: productType === 'whisky' ? whiskyAge : undefined,
            keywords: keywords.split(',').map((kw) => kw.trim()).filter(Boolean),
        };

        console.log('Request data being sent:', requestData);
        setLoading(true);
        try {
            const {data} = await axios.post('/api/fetchProduct', requestData); 
            setResults(data);
            console.log("Data from API:",results)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error:', error.response?.data || error.message);
            } else {
                console.error('Unexpected error:', error);
            }
            alert('Failed to fetch products. Please try again.');
        }finally{
            setLoading(false);
        }
    };
    return(
        <main>
            <div>
                <h1>Product Matcher</h1>
            </div>
            <div>
                <form onSubmit={handleSubmit}>
                    <div className="productType">
                        <label htmlFor="productType">Type of Product: </label>
                        <select
                        id="productType"
                        name="productType"
                        value={productType}
                        onChange={handleProductTypeChange}
                        >
                        <option value="" disabled>Select a product type</option>
                        <option value="whisky">Whisky</option>
                        <option value="wine">Wine</option>
                        </select>
                    </div>
                    <div className="priceRange">
                        <label>Product Price : </label>
                        <div>
                            <input
                                type="range"
                                min="0"
                                max="1500"
                                value={priceRange[0]}
                                onChange={handleMinPriceChange}
                            />
                            <input
                                type="range"
                                min="0"
                                max="20000"
                                value={priceRange[1]}
                                onChange={handleMaxPriceChange}
                            />
                        </div>
                        <p>Selected Range: ${priceRange[0]} - ${priceRange[1]}</p>
                    </div>
                    <div className="productReview">
                    <label>Review Score : </label>
                    <input type="number" min="0" max="100" value={reviewScore} step="5" onChange={handleReviewScoreChange}/>
                </div>

                {productType === 'whisky' && (  
                    <>
                    <div className="productCategory">
                        <label>Whisky Category : </label>
                        <select value={whiskyCategory} onChange={handleWhiskyCategoryChange}>
                        <option value="" disabled>Select category</option>
                        <option value="Single Malt Scotch">Single Malt</option>
                        <option value="Blended Malt Scotch">Blended Malt</option>
                        <option value="Blended Scotch">Blended Scotch</option>
                        </select>
                    </div>
                    <div className="age">
                        <label>Whisky Age : </label>
                        <select value={whiskyAge} onChange={handleWhiskyAgeChange}>
                        <option value="0">No Age</option>
                        <option value="5">5 years</option>
                        <option value='10'>10 years</option>
                        <option value="12">12 years</option>
                        <option value="15">15 years</option>
                        <option value="18">18 years</option>
                        </select>
                    </div>
                    <div className="keywords">
                        <label>Whisky Keywords : </label>
                        <input type="text" placeholder="e.g., smoky, aged, peaty" value={keywords} onChange={handleKeywordsChange} />
                    </div>
                    </>
                )}

                {productType === 'wine' && (
                    <>
                    <div className="productCategory">
                        <label>Wine Category : </label>
                        <select value={wineCountry} onChange={handleWineCountryChange}>
                        <option value="" disabled>Select Country</option>
                        <option value="US">US</option>
                        <option value="France">France</option>
                        <option value="Italy">Italy</option>
                        <option value="Spain">Spain</option>
                        <option value="Portugal">Portugal</option>
                        <option value="Chile">Chile</option>
                        <option value="Argentina">Argentina</option>
                        <option value="Austria">Austria</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                        <option value="New Zealand">New Zealand</option>
                        <option value="South Africa">South Africa</option>
                        <option value="Israel">Israel</option>
                        </select>
                    </div>
                    <div className="keywords">
                        <label>Wine Keywords : </label>
                        <input type="text" placeholder="e.g., fruity, dry, full-bodied" value={keywords} onChange={handleKeywordsChange} />
                    </div>
                    </>
                )}
                <button type="submit">Search</button>
                </form>
            </div>
            <div>
                {loading ? (
                    <p>Loading products...</p>  //{/* Show loading state */}
                ) : results.length > 0 ? (
                    <ul>
                        {results.map((product, index) => (
                            <li key={index}>
                                <h3>{product.name}</h3>
                                <p>{product.description}</p>
                                <p>Price: ${product.price}</p>
                                <p>ABV: {product.abv}%</p>
                                {productType === 'whisky' && (
                                    <>
                                        <p>Age: {product.age} years</p>
                                        <p>Category: {product.category}</p>
                                    </>
                                )}
                                {productType === 'wine' && (
                                    <>
                                        <p>Country: {product.category}</p>
                                        <p>Keywords: {keywords}</p>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No products found</p>
                )}
            </div>
        </main>
    )
}


