"use client";
import { useRouter } from "next/navigation";

const Navigation = () => {
  const router = useRouter();
  return (
    <div>
      <button onClick={() => router.back()} className="p-2">
        Go back
      </button>
      <button onClick={() => router.forward()} className="p-2">
        Go forward
      </button>
    </div>
  );
};

export default Navigation;
