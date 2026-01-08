"use client";

import { useState } from "react";
import { createComment} from "../actions/comments";
import { useRouter } from "next/navigation"

type CommentFormProps ={
    productId: number
    
}
export default function CommentForm({ productId}: CommentFormProps) {
  const [content, setContent] = useState("");
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;

    await createComment(productId, content );
    setContent("");
    router.refresh()
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Écrire un commentaire..."
        className="w-full border p-2 rounded"
        required
      />
      <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
        Poster
      </button>
    </form>
  );

}


