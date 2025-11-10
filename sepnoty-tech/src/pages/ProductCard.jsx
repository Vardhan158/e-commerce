import React from "react";

const ProductCard = ({ product }) => {
  const [count, setCount] = React.useState(0);

  return (
    <div
      className="
        border border-gray-200 rounded-xl p-3 bg-white shadow-sm 
        hover:shadow-lg hover:-translate-y-1 hover:scale-[1.03]
        transition-all duration-300 ease-out 
        w-full max-w-[180px] sm:max-w-[200px] mx-auto
      "
    >
      {/* 🖼 Product Image */}
      <div className="group relative cursor-pointer flex items-center justify-center mb-2">
        <img
          src={product.image}
          alt={product.name}
          className="
            w-[110px] sm:w-[130px] object-contain 
            transition-transform duration-500 ease-in-out 
            group-hover:scale-110
          "
        />
      </div>

      {/* 📝 Product Info */}
      <div className="text-gray-600 text-sm space-y-1">
        <p className="uppercase text-gray-400 text-xs tracking-wide">
          {product.category}
        </p>
        <p className="text-gray-800 font-semibold text-base truncate">
          {product.name}
        </p>

        {/* ⭐ Rating */}
        <div className="flex items-center gap-1">
          {Array(5)
            .fill("")
            .map((_, i) => (
              <svg
                key={i}
                width="14"
                height="13"
                viewBox="0 0 18 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z"
                  fill={product.rating > i ? "#615fff" : "rgba(97,95,255,0.3)"}
                />
              </svg>
            ))}
          <p className="text-xs text-gray-500 ml-1">({product.rating})</p>
        </div>

        {/* 💰 Price + Add Button */}
        <div className="flex items-end justify-between mt-3">
          <p className="text-indigo-600 font-semibold text-base">
            ${product.offerPrice}{" "}
            <span className="text-gray-400 text-xs line-through">
              ${product.price}
            </span>
          </p>

          {/* 🛒 Add/Increment/Decrement */}
          <div className="text-indigo-600">
            {count === 0 ? (
              <button
                onClick={() => setCount(1)}
                className="
                  flex items-center justify-center gap-1 
                  bg-indigo-50 border border-indigo-200 
                  px-3 py-1 rounded-full text-sm font-medium 
                  hover:bg-indigo-100 hover:scale-105 transition-all duration-300
                "
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
                    stroke="#615fff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Add
              </button>
            ) : (
              <div
                className="
                  flex items-center justify-center gap-2 
                  bg-indigo-100 rounded-full px-2 py-1 
                  text-sm font-semibold select-none 
                  hover:bg-indigo-200 transition-all duration-300
                "
              >
                <button
                  onClick={() => setCount((prev) => Math.max(prev - 1, 0))}
                  className="px-2 text-lg leading-none"
                >
                  -
                </button>
                <span className="w-4 text-center">{count}</span>
                <button
                  onClick={() => setCount((prev) => prev + 1)}
                  className="px-2 text-lg leading-none"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
