import { FiStar, FiUser } from "react-icons/fi";

const ProductReviews = ({ reviews = [] }) => {
  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={`
              h-4 w-4
              ${
                star <= rating
                  ? "text-[hsl(var(--primary))]"
                  : "text-[hsl(var(--foreground)/0.3)]"
              }
            `}
          />
        ))}
      </div>
    );
  };

  if (reviews.length === 0) {
    return (
      <div
        className="
          py-8
          text-center
          text-sm
          text-[hsl(var(--foreground)/0.6)]
        "
      >
        هنوز نظری برای این محصول ثبت نشده است.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review, index) => (
        <div
          key={index}
          className="
            border
            border-[hsl(var(--border))]
            p-4
            transition-shadow
            duration-200
            hover:shadow-sm
          "
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-full
                  bg-[hsl(var(--foreground)/0.05)]
                "
              >
                <FiUser
                  className="
                    h-4 w-4
                    text-[hsl(var(--foreground)/0.6)]
                  "
                />
              </div>

              <div>
                <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                  {review.author}
                </p>
                <p className="text-xs text-[hsl(var(--foreground)/0.5)]">
                  {review.date}
                </p>
              </div>
            </div>

            {renderStars(review.rating)}
          </div>

          <p
            className="
              text-sm
              leading-relaxed
              text-[hsl(var(--foreground)/0.7)]
            "
          >
            {review.comment}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ProductReviews;
