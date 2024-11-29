// pages/api/fetchProducts.ts
import type { NextApiRequest, NextApiResponse } from 'next';



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('Received request:', req.method);
  if (req.method === 'POST') {
    console.log("Entered Post Method")
    try {
        
        const { product_type, min_price, max_price, category, min_review, min_age, keywords } = req.body || {};
        const sanitizedKeywords = Array.isArray(keywords) ? keywords.filter((keyword) => keyword.trim() !== "") : [];
        const payload = {
            product_type: product_type,
            min_price: min_price,
            max_price: max_price,
            min_review: min_review, 
            category: category,
            min_age: min_age,
            keywords:  sanitizedKeywords,
        };
        console.log("payload print",payload); 

        const lambdaResponse  = await fetch('https://yhx3jb7hx26h3gm7rg6sc2fzve0qagtz.lambda-url.eu-west-2.on.aws/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      if (!lambdaResponse.ok) {
        throw new Error('Error calling Lambda function');
      }

      const lambdaData = await lambdaResponse.json();
      console.log("Lambda response:", lambdaData);
      res.status(200).json({
        message: "Data received and Lambda invoked successfully",
        lambdaResponse: lambdaData,
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  } else {
    res.status(405).json({ error: 'Only POST requests are allowed' });
  }
}
