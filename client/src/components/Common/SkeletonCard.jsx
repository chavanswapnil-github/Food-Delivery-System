import "./SkeletonCard.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <Skeleton height={200} borderRadius={16} />

      <Skeleton
        height={25}
        style={{ marginTop: 20 }}
      />

      <Skeleton
        count={2}
        style={{ marginTop: 10 }}
      />

      <Skeleton
        height={40}
        style={{ marginTop: 20 }}
      />
    </div>
  );
}

export default SkeletonCard;