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
  const [posts, setPosts] = useState<Post[]>([]);
  const handleFetchPost = useCallback(async () => {
    try {
      {
        initWeb3();
        const web3 = getWeb3();
        if (web3) {
          const accounts = await web3.eth.getAccounts();
          if (accounts && accounts.length > 0) {
            const contract = await new web3.eth.Contract(
              SocialWeb3.abi,
              process.env.SOCIALWEB3_ADDRESS
            );
            const tx = await contract.methods.getPostWithNumber(10).call();
            if (Array.isArray(tx)) {
              const result = tx.map((ele: any) => {
                const temp: Post = {
                  postId: Number(ele.postId),
                  handle: ele.handle,
                  content: ele.content,
                  timestamp: Number(ele.timestamp),
                };
                return temp;
              });
              setPosts(result);
              console.log(result);
            }
          }
        }
      }
    } catch (error: any) {
      console.error("Error while logging in:", error.message);
    }
  }, []);
  useEffect(() => {
    handleFetchPost();
  }, []);
  return (
    <div>
      <h1 className="head-text text-left">Create Post</h1>
      <PostForm />
    </div>
  );
}
