import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";

// Backend URL from environment variable
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const SingleProduct = () => {
  const { products, navigate, addToCart } = useAppContext();
  const { id } = useParams();
  const [thumbnail, setThumbnail] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const product = products.find((p) => p._id === id);

  useEffect(() => {
    if (products.length > 0 && product) {
      const related = products.filter(
        (p) => p.category === product.category && p._id !== product._id
      );
      setRelatedProducts(related.slice(0, 5));
    }
  }, [products, product]);

  useEffect(() => {
    if (product?.image?.length > 0) {
      setThumbnail(product.image[0]);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="mt-16 text-center text-gray-600">
        Product not found.
      </div>
    );
  }

  return (
    <div className="mt-16">
      <p>
        <Link to="/">Home</Link> /{" "}
        <Link to="/products">Products</Link> /{" "}
        <Link to={`/products/${product.category?.toLowerCase()}`}>
          {product.category}
        </Link>{" "}
        / <span className="text-indigo-500">{product.name}</span>
      </p>

      <div className="flex flex-col md:flex-row gap-16 mt-4">
        {/* Product Images */}
        <div className="flex gap-3">
          <div className="flex flex-col gap-3">
            {product.image?.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setThumbnail(img)}
                className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer"
              >
                <img
                  src={`${BACKEND_URL}/images/${img}`}
                  alt={`Thumbnail ${idx + 1}`}
                />
              </div>
            ))}
          </div>

          <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
            {thumbnail && (
              <img
                src={`${BACKEND_URL}/images/${thumbnail}`}
                alt="Selected product"
              />
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="text-sm w-full md:w-1/2">
          <h1 className="text-3xl font-medium">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-0.5 mt-1">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <img
                  key={i}
                  src={
                    i < Math.round(product.rating || 0)
                      ? assets.star_icon
                      : assets.star_dull_icon
                  }
                  alt="star"
                  className="w-3.5 md:w-4"
                />
              ))}
            <p className="text-base ml-2">({product.rating || 0})</p>
          </div>

          {/* Price */}
          <div className="mt-6">
            <p className="text-gray-500/70 line-through">
              MRP: ${product.price}
            </p>
            <p className="text-2xl font-medium">
              MRP: ${product.offerPrice}
            </p>
            <span className="text-gray-500/70">
              (inclusive of all taxes)
            </span>
          </div>

          {/* Description */}
          <p className="text-base font-medium mt-6">About Product</p>
          <ul className="list-disc ml-4 text-gray-500/70">
            {Array.isArray(product.description)
              ? product.description.map((desc, idx) => (
                  <li key={idx}>{desc}</li>
                ))
              : <li>{product.description}</li>}
          </ul>

          {/* Buttons */}
          <div className="flex items-center mt-10 gap-4 text-base">
            <button
              onClick={() => addToCart(product._id)}
              className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
            >
              Add to Cart
            </button>
            <button
              onClick={() => {
                addToCart(product._id);
                navigate("/cart");
                scrollTo(0, 0);
              }}
              className="w-full py-3.5 cursor-pointer font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition"
            >
              Buy now
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="flex flex-col items-center mt-20">
        <div className="flex flex-col items-center w-max">
          <p className="text-2xl font-medium">Related Products</p>
          <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
        </div>

        <div className="my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {relatedProducts
            .filter((p) => p.inStock)
            .map((p, idx) => (
              <ProductCard key={idx} product={p} />
            ))}
        </div>

        <button
          onClick={() => {
            navigate("/products");
            scrollTo(0, 0);
          }}
          className="w-1/2 my-8 py-3.5 cursor-pointer font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition"
        >
          See More
        </button>
      </div>
    </div>
  );
};

export default SingleProduct;
