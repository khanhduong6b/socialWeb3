"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserValidation } from "@/lib/validations/user";
import * as z from "zod";
import Image from "next/image";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { getWeb3, initWeb3 } from "@/app/services/web3";
import Web3 from "web3";
import SocialWeb3 from "../socialWeb3.json";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { PostValidation } from "@/lib/validations/post";
//------------------------------------
const PostForm = () => {
  const router = useRouter();
  const [content, setContent] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      content: "",
    },
  });

  //------------------------------------
  const handleGetAccount = useCallback(async () => {
    try {
      {
        initWeb3();
        const web3 = getWeb3();
        if (web3) {
          const accounts = await web3.eth.getAccounts();
          if (accounts && accounts.length > 0) {
          }
        }
      }
    } catch (error: any) {
      console.error("Error while logging in:", error.message);
    }
  }, []);

  async function onSubmit(submittedValues: z.infer<typeof PostValidation>) {
    const web3 = new Web3(window.ethereum);
    setIsLoading(true);
    try {
      const contract = await new web3.eth.Contract(
        SocialWeb3.abi,
        process.env.NEXT_PUBLIC_SOCIALWEB3_ADDRESS
      );

      // const tx = await contract.methods.send({
      //   from: wallet,
      // });
      toast.success("Create post Successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error: any) {
      console.error("Error:", error.message);
      toast.error("Create Post failed", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setIsLoading(false);
    }
  }

  //------------------------------------
  useEffect(() => {
    handleGetAccount();
  }, []);

  //------------------------------------
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-start gap-10"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Type your thought in here!
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={10}
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500" disabled={isLoading}>
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default PostForm;
