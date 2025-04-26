import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ui/shared/product/product-card";
import {
  getAllCategories,
  getAllProducts,
} from "@/lib/actions/product.actions";
import { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata(props: {
  searchParams: Promise<{
    q: string;
    category: string;
    price: string;
    rating: string;
  }>;
}) {
  const {
    q = "all",
    category = "all",
    rating = "all",
    price = "all",
  } = await props.searchParams;

  const isSet = (value: string) => {
    return value && value !== "all" && value.trim() !== "";
  };

  const isQuerySet = isSet(q);
  const isCategorySet = isSet(category);
  const isRatingSet = isSet(rating);
  const isPriceSet = isSet(price);

  if (isQuerySet || isCategorySet || isRatingSet || isPriceSet) {
    return {
      title: `Search ${isQuerySet ? q : ""} 
      ${isCategorySet ? `: category ${category}` : ""} ${
        isRatingSet ? `: rating ${rating}` : ""
      } ${isPriceSet ? `: price ${price}` : ""} `,
    };
  } else {
    return {
      title: "Search Products",
    };
  }
}

const prices = [
  {
    name: "$1 to $50",
    value: "1-50",
  },
  {
    name: "$51 to $100",
    value: "51-100",
  },
  {
    name: "$101 to $200",
    value: "101-200",
  },
  {
    name: "$201 to $500",
    value: "201-500",
  },
  {
    name: "$501 to $1000",
    value: "501-1000",
  },
];

const sortOrders = ["newest", "lowest", "highest", "rating"];

const ratings = ["4", "3", "2", "1"];

const SearchPage = async (props: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
    page?: string;
    rating?: string;
    price?: string;
  }>;
}) => {
  const {
    q = "all",
    category = "all",
    sort = "newest",
    page = "1",
    rating = "all",
    price = "all",
  } = await props.searchParams;

  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg,
  }: {
    c?: string;
    s?: string;
    p?: string;
    r?: string;
    pg?: string;
  }) => {
    const params = {
      category,
      sort,
      page,
      rating,
      price,
    };

    if (c) params.category = c;
    if (s) params.sort = s;
    if (p) params.price = p;
    if (r) params.rating = r;
    if (pg) params.page = pg;

    const urlParams = new URLSearchParams(params);

    return `/search?${urlParams.toString()}`;
  };

  const products = await getAllProducts({
    query: q,
    category,
    rating,
    price,
    page: Number(page),
    sort,
  });
  const categories = await getAllCategories();

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links ">
        <div className="text-xl mb-2 mt-3">Department</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                href={getFilterUrl({ c: "all" })}
                className={`${
                  (category === "all" || category === "") && "font-bold"
                }`}
              >
                {" "}
                Any{" "}
              </Link>
            </li>
            {categories.map((x) => (
              <li key={x.category}>
                <Link
                  href={getFilterUrl({ c: x.category })}
                  className={`${category === x.category && "font-bold"}`}
                >
                  {" "}
                  {x.category}{" "}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xl mb-2 mt-8">Price</div>
          <div>
            <ul className="space-y-1">
              <li>
                <Link
                  href={getFilterUrl({ p: "all" })}
                  className={`${price === "all" && "font-bold"}`}
                >
                  {" "}
                  Any{" "}
                </Link>
              </li>
              {prices.map((x) => (
                <li key={x.value}>
                  <Link
                    href={getFilterUrl({ p: x.value })}
                    className={`${price === x.value && "font-bold"}`}
                  >
                    {" "}
                    {x.name}{" "}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <div className="text-xl mb-2 mt-8">Customer Ratings</div>
          <div>
            <ul className="space-y-1">
              <li>
                <Link
                  href={getFilterUrl({ r: "all" })}
                  className={`${rating === "all" && "font-bold"}`}
                >
                  {" "}
                  Any{" "}
                </Link>
              </li>
              {ratings.map((x) => (
                <li key={x}>
                  <Link
                    href={getFilterUrl({ r: x })}
                    className={`${rating === x && "font-bold"}`}
                  >
                    {" "}
                    {x}
                    {" Starts & Up"}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="md:col-span-4 space-y-4">
        <div className="flex-between flex-col md:flex-row my-4">
          <div className="flex items-center">
            {q && q !== "all" && q !== "" && "Query : " + q}
            {category &&
              category !== "all" &&
              category !== "" &&
              " Category : " + category}
            {price !== "all" && " Price: " + price}
            {rating !== "all" && " Rating: " + rating + " & Up"}
            &nbsp;
            {((q !== "" && q !== "all") ||
              (category !== "" && category !== "all") ||
              rating !== "all" ||
              price !== "all") && (
              <Button asChild variant="link">
                <Link href="/search">Clear</Link>
              </Button>
            )}
          </div>
          <div className="flex items-center">
            Sort By{" "}
            {sortOrders.map((s) => (
              <Link
                key={s}
                href={getFilterUrl({ s })}
                className={`mx-2 ${sort === s && "font-bold"}`}
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {products.data.length === 0 && <div>No Products Found </div>}
          {products.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
