import React from "react";

const ProductsPage = () => {
  const productImages = [
    "https://images.unsplash.com/photo-1606813902914-9b89a8a7d90e", // Nike Shoes
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8", // Headphones
    "https://images.unsplash.com/photo-1585386959984-a415522316d1", // Smartwatch
    "https://images.unsplash.com/photo-1581291519195-ef11498d1cf5", // T-Shirt
    "https://images.unsplash.com/photo-1574169207511-e21a21c8075a", // Camera
    "https://images.unsplash.com/photo-1616627781805-c9af1f9f7b7b", // Perfume
    "https://images.unsplash.com/photo-1592878904946-b3cd5fbdc1af", // Sunglasses
    "https://images.unsplash.com/photo-1618354691373-d851c90a3c1a", // Laptop
    "https://images.unsplash.com/photo-1587085758700-08dd01a1a0a3", // Mobile
    "https://images.unsplash.com/photo-1593642632559-0c8e8f3e1f47", // Macbook
    "https://images.unsplash.com/photo-1560347876-aeef00ee58a1", // Bag
    "https://images.unsplash.com/photo-1503602642458-232111445657", // Watch
    "https://images.unsplash.com/photo-1600185365506-6a4b339c6d44", // Earbuds
    "https://images.unsplash.com/photo-1600180758890-6b9452d8f1a0", // Gaming Controller
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff", // iPhone
    "https://images.unsplash.com/photo-1592503250891-4c57f6f3b3f3", // Speaker
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e", // Headphones 2
    "https://images.unsplash.com/photo-1512499617640-c2f999098c48", // Shoes 2
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f", // Smartwatch 2
    "https://images.unsplash.com/photo-1612831662375-bb77b4f78a9b", // Drone
    "https://images.unsplash.com/photo-1553456558-aff63285bdd8", // Bag 2
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f", // Watch 2
    "https://images.unsplash.com/photo-1600180758890-6b9452d8f1a0", // Controller 2
    "https://images.unsplash.com/photo-1600185365506-6a4b339c6d44", // Earbuds 2
    "https://images.unsplash.com/photo-1592503250891-4c57f6f3b3f3", // Speaker 2
  ];

  // Generate 25 unique products
  const products = productImages.map((img, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    category: ["Electronics", "Sports", "Fashion", "Accessories"][i % 4],
    price: 100 + i * 3,
    offerPrice: 80 + i * 2,
    rating: (Math.random() * 2 + 3).toFixed(1), // random 3.0–5.0
    image: `${img}?auto=format&fit=crop&w=300&q=80`,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50 py-10 px-4 sm:px-8">
      <h1 className="text-2xl font-bold text-center text-indigo-600 mb-6">
        Featured Products
      </h1>

      {/* Responsive Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 justify-items-center">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
