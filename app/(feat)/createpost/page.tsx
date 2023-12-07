"use client";
import { getWeb3, initWeb3 } from "@/app/services/web3";
import { useCallback, useEffect, useState } from "react";
import SocialWeb3 from "../../../components/socialWeb3.json";
import PostForm from "@/components/forms/PostForm";
type Post = {
  postId: number;
  handle: string;
  content: string;
  timestamp: number;
};
export default function CreatePost() {
  return (
    <div>
      <h1 className="head-text text-left">Create Post</h1>
      <PostForm />
    </div>
  );
}
