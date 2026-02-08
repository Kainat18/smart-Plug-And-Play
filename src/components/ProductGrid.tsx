import { ShoppingCart } from "lucide-react";
import productPro from "@/assets/product-pro-27.jpg";
import productGaming from "@/assets/product-gaming-32.jpg";
import productBudget from "@/assets/product-budget-24.jpg";

const products = [
  {
    id: 1,
    name: 'UltraView Pro 27"',
    description: "4K resolution with 100% sRGB color accuracy and USB-C connectivity for seamless workflow integration.",
    features: ["4K UHD", "100% sRGB", "USB-C"],
    price: 499,
    image: productPro,
  },
  {
    id: 2,
    name: 'UltraView Gaming 32"',
    description: "Lightning-fast 240Hz refresh rate with 1ms response time and G-Sync compatibility for competitive gaming.",
    features: ["240Hz", "1ms", "G-Sync"],
    price: 699,
    image: productGaming,
  },
  {
    id: 3,
    name: 'UltraView Budget 24"',
    description: "Full HD IPS panel with 75Hz refresh rate. Excellent color and clarity at an unbeatable price point.",
    features: ["Full HD", "75Hz", "IPS"],
    price: 199,
    image: productBudget,
  },
];

const ProductGrid = () => {
  return (
    <section id="products" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground text-center mb-4">
          Featured Products
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
          Discover the perfect display for your needs — from professional color accuracy to competitive gaming performance.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {products.map((product, i) => (
            <div
              key={product.id}
              className="bg-card rounded-xl border border-border overflow-hidden hover-lift group animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Image */}
              <div className="h-[200px] overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-card-foreground mb-2">
                  {product.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {product.description}
                </p>

                {/* Feature tags */}
                <div className="flex gap-2 mb-5">
                  {product.features.map((f) => (
                    <span
                      key={f}
                      className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-md"
                    >
                      {f}
                    </span>
                  ))}
                </div>

                {/* Price + CTA */}
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">
                    ${product.price}
                  </span>
                  <button className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors duration-200">
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
