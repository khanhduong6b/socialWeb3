"use client";
import { getWeb3, initWeb3 } from "@/app/services/web3";
import { useCallback, useEffect, useState } from "react";
import SocialWeb3 from "../../components/socialWeb3.json";
type Post = {
  postId: number;
  handle: string;
  content: string;
  timestamp: number;
};
export default function Post() {
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
              process.env.NEXT_PUBLIC_SOCIALWEB3_ADDRESS
            );
            const tx = await contract.methods.getPostWithNumber(0).call();
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
      <h1 className="head-text text-left">POSTS</h1>
      {posts.map((ele) => {
        if (!ele.postId) return;
        return (
          <div
            key={ele.postId}
            style={{
              border: "2px solid lightgray",
              color: "white",
              margin: "4rem 2rem",
              padding: "1rem",
              minHeight: "14rem",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                borderBottom: "1px solid #ccc",
                paddingBottom: "0.7rem",
              }}
            >
              <h2
                style={{
                  padding: "0.2rem 0.8rem",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  display: "inline-block",
                  border: "1px solid #eee",
                  borderRadius: "20px",
                }}
              >
                {ele.handle ? ele.handle : "@temp"}
              </h2>
            </div>
            <p style={{ padding: "1rem" }}>
              {" "}
              {ele.content ? ele.content : "TEMP CONTENT"}
            </p>
          </div>
        );
      })}
    </div>
  );
}
