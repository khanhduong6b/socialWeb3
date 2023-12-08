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
//------------------------------------
const AccountProfile = () => {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [wallet, setWallet] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      imageURI: "",
      handle: "",
      name: "",
      bio: "",
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
            const connectedAccount = accounts[0];
            setWallet(connectedAccount);
          }
        }
      }
    } catch (error: any) {
      console.error("Error while logging in:", error.message);
    }
  }, []);
  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      setFiles(Array.from(e.target.files));

      if (!file.type.includes("image")) return;
      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";

        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };
  async function onSubmit(submittedValues: z.infer<typeof UserValidation>) {
    if (
      !submittedValues.bio ||
      !submittedValues.handle ||
      !submittedValues.imageURI ||
      !submittedValues.name
    )
      return;
    const regex = /^[^\s\d!@#$%^&*()_+={}\[\]:;<>,.?\\/~`]{2,50}$/;
    const isValid = regex.test(submittedValues.handle);
    if (!isValid) return;
    setIsLoading(true);
    const web3 = new Web3(window.ethereum);
    try {
      const contract = await new web3.eth.Contract(
        SocialWeb3.abi,
        process.env.SOCIALWEB3_ADDRESS
      );
      const tx = await contract.methods
        .createProfileNFT([
          wallet,
          "@" + submittedValues.handle,
          submittedValues.name,
          submittedValues.imageURI,
          submittedValues.bio,
        ])
        .send({
          from: wallet,
        });
      toast.success("Profile created successfully!", {
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
      }, 5000);
    } catch (error: any) {
      console.error("Error:", error.message);
      toast.error("Create profile failed", {
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
          name="imageURI"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="account-form_image-label">
                {field.value ? (
                  <Image
                    src={field.value}
                    alt="profile photo"
                    width={96}
                    height={96}
                    priority
                    className="rounded-full object-contain"
                  />
                ) : (
                  <Image
                    src="/assets/profile.svg"
                    alt="profile photo"
                    width={24}
                    height={24}
                    className=" object-contain"
                  />
                )}
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Upload a Photo"
                  className="account-form_image-input"
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Name
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="handle"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Handle
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Bio
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

export default AccountProfile;
