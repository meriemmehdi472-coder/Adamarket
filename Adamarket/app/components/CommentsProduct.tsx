"use client";

import { useState } from "react";
import { updateComment, deleteComment } from "@/app/actions/comments";

interface Props {
  commentId: number;
  commentContent: string;
  authorId: string;
  connectedUserId: string | null;
  productId: number,
}

export default function CommentProduct({ commentId,commentContent,authorId,connectedUserId, productId}: Props) {
  const [isModif, setIsModif] = useState(false);
  const [content, setContent] = useState(commentContent);

  if (connectedUserId !== authorId) return null;

  const handleUpdate = async () => {
    if (!content.trim()) return;
    await updateComment(commentId, content, productId);
    setIsModif(false);
  };

  const handleDelete = async () => {
    if (!confirm("Supprimer ce commentaire ?")) return;
    await deleteComment(commentId, productId);
    location.reload();
  };
  

  return (
    <div className="mt-2">
      {isModif ? (
        <>
          <textarea 
            className="w-full border p-2 rounded mb-2"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              
            >
              Enregistrer
            </button>
            <button
              onClick={() => {
                setContent(commentContent);
                setIsModif(false);
              }}
              className="bg-gray-400 text-white px-3 py-1 rounded"
            >
              Annuler
            </button>
          </div>
        </>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => setIsModif(true)}
           
          >
            Modifier
          </button>
          <button
            onClick={handleDelete}
        
          >
            Supprimer
          </button>
        </div>
      )}
    </div>
  );
}
