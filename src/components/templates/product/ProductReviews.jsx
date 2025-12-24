import { FiStar, FiUser } from "react-icons/fi";

const ProductReviews = ({ reviews }) => {
  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-primary text-primary"
                : "text-muted-foreground"
            }`}
          />
        ))}
      </div>
    );
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="animate-fade-in py-8 text-center text-muted-foreground">
        هنوز نظری برای این محصول ثبت نشده است.
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="rounded-sm border border-border p-4 transition-shadow duration-250 hover:shadow-sm"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <FiUser className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">{review.author}</p>
                <p className="text-xs text-muted-foreground">{review.date}</p>
              </div>
            </div>
            {renderStars(review.rating)}
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {review.comment}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ProductReviews;